import { Pool } from "pg";

let pool = null;
let schemaReady = false;

const BUILDINGS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS buildings (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    region_id TEXT NOT NULL,
    dynasty TEXT NOT NULL,
    topic TEXT NOT NULL,
    heat INTEGER NOT NULL DEFAULT 0,
    province_code TEXT NOT NULL,
    location TEXT NOT NULL,
    summary TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'manual',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const resolveDatabaseUrl = () => {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ""
  );
};

const isLocalConnection = databaseUrl => {
  return (
    databaseUrl.includes("localhost") ||
    databaseUrl.includes("127.0.0.1")
  );
};

const getPool = () => {
  if (pool) return pool;

  const connectionString = resolveDatabaseUrl();
  if (!connectionString) {
    throw new Error(
      "Missing database connection string. Set POSTGRES_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL.",
    );
  }

  pool = new Pool({
    connectionString,
    ssl: isLocalConnection(connectionString)
      ? false
      : { rejectUnauthorized: false },
  });

  return pool;
};

export const closePool = async () => {
  if (!pool) return;
  const current = pool;
  pool = null;
  schemaReady = false;
  await current.end();
};

export const ensureSchema = async () => {
  if (schemaReady) return;

  const currentPool = getPool();
  await currentPool.query(BUILDINGS_TABLE_SQL);
  await currentPool.query(
    "CREATE INDEX IF NOT EXISTS idx_buildings_topic ON buildings(topic);",
  );
  await currentPool.query(
    "CREATE INDEX IF NOT EXISTS idx_buildings_province_code ON buildings(province_code);",
  );
  schemaReady = true;
};

const mapRow = row => ({
  id: row.id,
  label: row.label,
  longitude: Number(row.longitude),
  latitude: Number(row.latitude),
  regionId: row.region_id,
  dynasty: row.dynasty,
  topic: row.topic,
  heat: Number(row.heat),
  provinceCode: row.province_code,
  location: row.location,
  summary: row.summary,
  image: row.image || "",
  source: row.source,
  createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
});

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
  const requiredStringFields = [
    "id",
    "label",
    "regionId",
    "dynasty",
    "topic",
    "provinceCode",
    "location",
    "summary",
  ];

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

const parseLimit = limit => Math.max(1, Math.min(Number(limit) || 200, 2000));
const parseOffset = offset => Math.max(0, Number(offset) || 0);

export const listBuildings = async (filters = {}) => {
  await ensureSchema();
  const currentPool = getPool();

  const where = [];
  const values = [];
  let paramIndex = 1;

  if (filters.topic) {
    where.push(`topic = $${paramIndex}`);
    values.push(filters.topic);
    paramIndex += 1;
  }

  if (filters.provinceCode) {
    where.push(`province_code = $${paramIndex}`);
    values.push(filters.provinceCode);
    paramIndex += 1;
  }

  if (filters.q) {
    where.push(
      `(label ILIKE $${paramIndex} OR location ILIKE $${paramIndex} OR summary ILIKE $${paramIndex})`,
    );
    values.push(`%${filters.q}%`);
    paramIndex += 1;
  }

  const limit = parseLimit(filters.limit);
  const offset = parseOffset(filters.offset);

  values.push(limit);
  const limitIndex = paramIndex;
  paramIndex += 1;
  values.push(offset);
  const offsetIndex = paramIndex;

  const sql = `
    SELECT
      id, label, longitude, latitude,
      region_id, dynasty, topic, heat,
      province_code, location, summary, image, source,
      created_at, updated_at
    FROM buildings
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY updated_at DESC, id ASC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const result = await currentPool.query(sql, values);
  return result.rows.map(mapRow);
};

export const getBuildingById = async id => {
  await ensureSchema();
  const currentPool = getPool();
  const result = await currentPool.query(
    `
      SELECT
        id, label, longitude, latitude,
        region_id, dynasty, topic, heat,
        province_code, location, summary, image, source,
        created_at, updated_at
      FROM buildings
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  if (!result.rows.length) return null;
  return mapRow(result.rows[0]);
};

export const createBuilding = async payload => {
  await ensureSchema();
  const currentPool = getPool();
  const normalized = normalizePayload(payload);
  validateBuilding(normalized);

  await currentPool.query(
    `
      INSERT INTO buildings (
        id, label, longitude, latitude, region_id, dynasty, topic, heat, province_code, location, summary, image, source
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
    `,
    [
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
    ],
  );

  return getBuildingById(normalized.id);
};

export const updateBuilding = async (id, payload) => {
  await ensureSchema();
  const existing = await getBuildingById(id);
  if (!existing) return null;

  const normalized = normalizePayload({ ...existing, ...payload, id });
  validateBuilding(normalized);
  const currentPool = getPool();

  await currentPool.query(
    `
      UPDATE buildings
      SET
        label = $1,
        longitude = $2,
        latitude = $3,
        region_id = $4,
        dynasty = $5,
        topic = $6,
        heat = $7,
        province_code = $8,
        location = $9,
        summary = $10,
        image = $11,
        source = $12,
        updated_at = NOW()
      WHERE id = $13
    `,
    [
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
    ],
  );

  return getBuildingById(id);
};

export const deleteBuilding = async id => {
  await ensureSchema();
  const currentPool = getPool();
  const result = await currentPool.query(
    "DELETE FROM buildings WHERE id = $1",
    [id],
  );
  return result.rowCount > 0;
};

export const upsertBuildings = async buildings => {
  await ensureSchema();
  if (!buildings.length) return 0;

  const currentPool = getPool();
  const client = await currentPool.connect();
  let upserted = 0;

  try {
    await client.query("BEGIN");
    for (const raw of buildings) {
      const normalized = normalizePayload(raw);
      validateBuilding(normalized);
      await client.query(
        `
          INSERT INTO buildings (
            id, label, longitude, latitude, region_id, dynasty, topic, heat, province_code, location, summary, image, source
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
          ON CONFLICT (id) DO UPDATE SET
            label = EXCLUDED.label,
            longitude = EXCLUDED.longitude,
            latitude = EXCLUDED.latitude,
            region_id = EXCLUDED.region_id,
            dynasty = EXCLUDED.dynasty,
            topic = EXCLUDED.topic,
            heat = EXCLUDED.heat,
            province_code = EXCLUDED.province_code,
            location = EXCLUDED.location,
            summary = EXCLUDED.summary,
            image = EXCLUDED.image,
            source = EXCLUDED.source,
            updated_at = NOW()
        `,
        [
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
        ],
      );
      upserted += 1;
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return upserted;
};
