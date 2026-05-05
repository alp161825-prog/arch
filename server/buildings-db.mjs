import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let dbPromise = null;

const splitTopLevelArgs = input => {
  const tokens = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";
  let escapeNext = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (inQuote && char === "\\") {
      current += char;
      escapeNext = true;
      continue;
    }

    if (char === '"' || char === "'") {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (quoteChar === char) {
        inQuote = false;
        quoteChar = "";
      }
      current += char;
      continue;
    }

    if (!inQuote && char === ",") {
      tokens.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim().length) {
    tokens.push(current.trim());
  }

  return tokens;
};

const parseValue = raw => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }

  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber)) return asNumber;
  return trimmed;
};

const extractPointArgs = source => {
  const calls = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf("point(", cursor);
    if (start < 0) break;

    let i = start + "point(".length;
    let depth = 1;
    let inQuote = false;
    let quoteChar = "";
    let escapeNext = false;

    while (i < source.length && depth > 0) {
      const char = source[i];

      if (escapeNext) {
        escapeNext = false;
        i += 1;
        continue;
      }

      if (inQuote && char === "\\") {
        escapeNext = true;
        i += 1;
        continue;
      }

      if (char === '"' || char === "'") {
        if (!inQuote) {
          inQuote = true;
          quoteChar = char;
        } else if (quoteChar === char) {
          inQuote = false;
          quoteChar = "";
        }
        i += 1;
        continue;
      }

      if (!inQuote) {
        if (char === "(") depth += 1;
        if (char === ")") depth -= 1;
      }

      i += 1;
    }

    if (depth === 0) {
      calls.push(source.slice(start + "point(".length, i - 1));
      cursor = i;
    } else {
      break;
    }
  }

  return calls;
};

const parseAtlasPointsFromTs = atlasPath => {
  if (!existsSync(atlasPath)) return [];
  const raw = readFileSync(atlasPath, "utf8");
  const start = raw.indexOf("export const atlasHeritagePoints");
  if (start < 0) return [];
  const end = raw.indexOf("export const supportedProvinceCodes", start);
  const section = end > start ? raw.slice(start, end) : raw.slice(start);
  const calls = extractPointArgs(section);

  return calls
    .map(call => splitTopLevelArgs(call).map(parseValue))
    .filter(args => args.length >= 11)
    .map(args => ({
      id: String(args[0]),
      label: String(args[1]),
      longitude: Number(args[2]),
      latitude: Number(args[3]),
      regionId: String(args[4]),
      dynasty: String(args[5]),
      topic: String(args[6]),
      heat: Number(args[7]),
      provinceCode: String(args[8]),
      location: String(args[9]),
      summary: String(args[10]),
      source: "atlas-local",
    }))
    .filter(item => item.id && !Number.isNaN(item.longitude) && !Number.isNaN(item.latitude));
};

const ensureSchema = async db => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS buildings (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      longitude REAL NOT NULL,
      latitude REAL NOT NULL,
      region_id TEXT NOT NULL,
      dynasty TEXT NOT NULL,
      topic TEXT NOT NULL,
      heat INTEGER NOT NULL DEFAULT 0,
      province_code TEXT NOT NULL,
      location TEXT NOT NULL,
      summary TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_buildings_topic ON buildings(topic);
    CREATE INDEX IF NOT EXISTS idx_buildings_province_code ON buildings(province_code);
  `);

  const tableInfo = await db.all("PRAGMA table_info(buildings)");
  const hasImageColumn = tableInfo.some(column => column.name === "image");
  if (!hasImageColumn) {
    await db.exec("ALTER TABLE buildings ADD COLUMN image TEXT NOT NULL DEFAULT '';");
  }
};

const seedFromAtlasIfEmpty = async (db, projectRoot) => {
  const row = await db.get("SELECT COUNT(1) AS count FROM buildings");
  if ((row?.count ?? 0) > 0) {
    return { seeded: false, count: row.count ?? 0 };
  }

  const atlasPath = path.join(projectRoot, "src", "data", "atlasHeritagePoints.ts");
  const points = parseAtlasPointsFromTs(atlasPath);
  if (!points.length) {
    return { seeded: false, count: 0 };
  }

  await db.exec("BEGIN");
  try {
    const stmt = await db.prepare(`
      INSERT INTO buildings (
        id, label, longitude, latitude, region_id, dynasty, topic, heat, province_code, location, summary, image, source, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
      )
    `);
    for (const item of points) {
      await stmt.run(
        item.id,
        item.label,
        item.longitude,
        item.latitude,
        item.regionId,
        item.dynasty,
        item.topic,
        item.heat,
        item.provinceCode,
        item.location,
        item.summary,
        item.image || "",
        item.source,
      );
    }
    await stmt.finalize();
    await db.exec("COMMIT");
  } catch (error) {
    await db.exec("ROLLBACK");
    throw error;
  }

  return { seeded: true, count: points.length };
};

export const initBuildingsDb = async ({ projectRoot, dbPathOverride } = {}) => {
  if (!projectRoot) {
    throw new Error("projectRoot is required to initialize buildings db");
  }

  if (!dbPromise) {
    const dbPath =
      dbPathOverride || process.env.BUILDINGS_DB_PATH || path.join(projectRoot, "server", "data", "buildings.db");
    const dbDir = path.dirname(dbPath);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database,
    }).then(async db => {
      await db.exec("PRAGMA journal_mode = WAL;");
      await ensureSchema(db);
      const seedInfo = await seedFromAtlasIfEmpty(db, projectRoot);
      return { db, dbPath, seedInfo };
    });
  }

  return dbPromise;
};

export const listBuildings = async (db, filters = {}) => {
  const where = [];
  const values = [];

  if (filters.topic) {
    where.push("topic = ?");
    values.push(filters.topic);
  }
  if (filters.provinceCode) {
    where.push("province_code = ?");
    values.push(filters.provinceCode);
  }
  if (filters.q) {
    where.push("(label LIKE ? OR location LIKE ? OR summary LIKE ?)");
    const keyword = `%${filters.q}%`;
    values.push(keyword, keyword, keyword);
  }

  const limit = Math.max(1, Math.min(Number(filters.limit) || 200, 2000));
  const offset = Math.max(0, Number(filters.offset) || 0);

  const sql = `
    SELECT
      id, label, longitude, latitude,
      region_id AS regionId,
      dynasty, topic, heat,
      province_code AS provinceCode,
      location, summary, image, source,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM buildings
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY updated_at DESC, id ASC
    LIMIT ? OFFSET ?
  `;

  return db.all(sql, ...values, limit, offset);
};

export const getBuildingById = async (db, id) => {
  return db.get(
    `
    SELECT
      id, label, longitude, latitude,
      region_id AS regionId,
      dynasty, topic, heat,
      province_code AS provinceCode,
      location, summary, image, source,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM buildings
    WHERE id = ?
  `,
    id,
  );
};

const normalizePayload = payload => ({
  id: String(payload.id || "").trim(),
  label: String(payload.label || "").trim(),
  longitude: Number(payload.longitude),
  latitude: Number(payload.latitude),
  regionId: String(payload.regionId || "").trim(),
  dynasty: String(payload.dynasty || "").trim(),
  topic: String(payload.topic || "").trim(),
  heat: Number(payload.heat ?? 0),
  provinceCode: String(payload.provinceCode || "").trim(),
  location: String(payload.location || "").trim(),
  summary: String(payload.summary || "").trim(),
  image: String(payload.image || "").trim(),
  source: String(payload.source || "manual").trim(),
});

const validateBuilding = normalized => {
  const requiredStringFields = ["id", "label", "regionId", "dynasty", "topic", "provinceCode", "location", "summary"];
  for (const field of requiredStringFields) {
    if (!normalized[field]) {
      throw new Error(`Field '${field}' is required`);
    }
  }

  if (Number.isNaN(normalized.longitude) || Number.isNaN(normalized.latitude)) {
    throw new Error("longitude and latitude must be numbers");
  }

  if (Number.isNaN(normalized.heat)) {
    throw new Error("heat must be a number");
  }
};

export const createBuilding = async (db, payload) => {
  const normalized = normalizePayload(payload);
  validateBuilding(normalized);

  await db.run(
    `
    INSERT INTO buildings (
      id, label, longitude, latitude, region_id, dynasty, topic, heat, province_code, location, summary, image, source, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
    )
  `,
    normalized.id,
    normalized.label,
    normalized.longitude,
    normalized.latitude,
    normalized.regionId,
    normalized.dynasty,
    normalized.topic,
    normalized.heat,
    normalized.provinceCode,
    normalized.location,
    normalized.summary,
    normalized.image,
    normalized.source,
  );

  return getBuildingById(db, normalized.id);
};

export const updateBuilding = async (db, id, payload) => {
  const existing = await getBuildingById(db, id);
  if (!existing) return null;

  const normalized = normalizePayload({ ...existing, ...payload, id });
  validateBuilding(normalized);

  await db.run(
    `
    UPDATE buildings
    SET
      label = ?,
      longitude = ?,
      latitude = ?,
      region_id = ?,
      dynasty = ?,
      topic = ?,
      heat = ?,
      province_code = ?,
      location = ?,
      summary = ?,
      image = ?,
      source = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `,
    normalized.label,
    normalized.longitude,
    normalized.latitude,
    normalized.regionId,
    normalized.dynasty,
    normalized.topic,
    normalized.heat,
    normalized.provinceCode,
    normalized.location,
    normalized.summary,
    normalized.image,
    normalized.source,
    id,
  );

  return getBuildingById(db, id);
};

export const deleteBuilding = async (db, id) => {
  const existing = await getBuildingById(db, id);
  if (!existing) return false;
  await db.run("DELETE FROM buildings WHERE id = ?", id);
  return true;
};
