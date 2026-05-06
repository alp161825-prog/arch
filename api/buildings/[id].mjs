import {
  deleteBuilding,
  getBuildingById,
  updateBuilding,
} from "../../server/buildings-postgres.mjs";

const BUILDINGS_ADMIN_TOKEN = process.env.BUILDINGS_ADMIN_TOKEN || "";

const withCors = res => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-token");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
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
    const rawId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const id = decodeURIComponent(String(rawId || ""));

    if (!id) {
      res.status(400).json({ error: "Missing id parameter" });
      return;
    }

    if (req.method === "GET") {
      const item = await getBuildingById(id);
      if (!item) {
        res.status(404).json({ error: "Building not found", id });
        return;
      }
      res.status(200).json({ item });
      return;
    }

    if (req.method === "PUT") {
      if (!hasWritePermission(req)) {
        res.status(403).json({ error: "Forbidden: invalid admin token" });
        return;
      }
      const item = await updateBuilding(id, parseBody(req));
      if (!item) {
        res.status(404).json({ error: "Building not found", id });
        return;
      }
      res.status(200).json({ item });
      return;
    }

    if (req.method === "DELETE") {
      if (!hasWritePermission(req)) {
        res.status(403).json({ error: "Forbidden: invalid admin token" });
        return;
      }
      const deleted = await deleteBuilding(id);
      if (!deleted) {
        res.status(404).json({ error: "Building not found", id });
        return;
      }
      res.status(200).json({ ok: true, id });
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
