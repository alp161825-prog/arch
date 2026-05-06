import {
  createBuilding,
  listBuildings,
} from "../../server/buildings-postgres.mjs";

const BUILDINGS_ADMIN_TOKEN = process.env.BUILDINGS_ADMIN_TOKEN || "";

const withCors = res => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-token");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
};

const readAdminToken = req => {
  const header = req.headers["x-admin-token"];
  if (Array.isArray(header)) return header[0] || "";
  return header || "";
};

const hasWritePermission = req => {
  if (!BUILDINGS_ADMIN_TOKEN) return true;
  return readAdminToken(req) === BUILDINGS_ADMIN_TOKEN;
};

const parseBody = req => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    return req.body.trim() ? JSON.parse(req.body) : {};
  }
  return req.body;
};

export default async function handler(req, res) {
  withCors(res);

  if (req.method === "OPTIONS") {
    res.status(200).json({ ok: true });
    return;
  }

  try {
    if (req.method === "GET") {
      const items = await listBuildings({
        topic: req.query.topic || "",
        provinceCode: req.query.provinceCode || "",
        q: req.query.q || "",
        limit: req.query.limit || "",
        offset: req.query.offset || "",
      });
      res.status(200).json({
        items,
        total: items.length,
      });
      return;
    }

    if (req.method === "POST") {
      if (!hasWritePermission(req)) {
        res.status(403).json({ error: "Forbidden: invalid admin token" });
        return;
      }

      const item = await createBuilding(parseBody(req));
      res.status(201).json({ item });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({
      error: "Buildings API error",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
