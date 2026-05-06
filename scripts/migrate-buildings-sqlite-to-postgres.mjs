import path from "node:path";
import { existsSync } from "node:fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {
  closePool,
  upsertBuildings,
} from "../server/buildings-postgres.mjs";

const resolveSqlitePath = () => {
  const fromArg = process.argv[2];
  if (fromArg) {
    return path.isAbsolute(fromArg)
      ? fromArg
      : path.resolve(process.cwd(), fromArg);
  }
  return path.resolve(process.cwd(), "server", "data", "buildings.db");
};

const run = async () => {
  const sqlitePath = resolveSqlitePath();
  if (!existsSync(sqlitePath)) {
    throw new Error(`SQLite file not found: ${sqlitePath}`);
  }

  const db = await open({
    filename: sqlitePath,
    driver: sqlite3.Database,
  });

  try {
    const rows = await db.all(`
      SELECT
        id, label, longitude, latitude,
        region_id AS "regionId",
        dynasty, topic, heat,
        province_code AS "provinceCode",
        location, summary, image, source
      FROM buildings
      ORDER BY id ASC
    `);

    const upserted = await upsertBuildings(rows);
    console.log(
      JSON.stringify(
        {
          ok: true,
          sqlitePath,
          totalRead: rows.length,
          totalUpserted: upserted,
        },
        null,
        2,
      ),
    );
  } finally {
    await db.close();
    await closePool();
  }
};

run().catch(error => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
