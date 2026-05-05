import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createBuilding,
  deleteBuilding,
  getBuildingById,
  initBuildingsDb,
  listBuildings,
  updateBuilding,
} from "./buildings-db.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const loadEnvFile = filePath => {
  if (!existsSync(filePath)) return;

  const raw = readFileSync(filePath, "utf8");
  raw.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

loadEnvFile(path.join(projectRoot, ".env"));
loadEnvFile(path.join(projectRoot, ".env.local"));

const PORT = Number(process.env.DEEPSEEK_PROXY_PORT || 8787);
const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const BUILDINGS_ADMIN_TOKEN = process.env.BUILDINGS_ADMIN_TOKEN || "";
const OFFICIAL_PROXY_TARGETS = (process.env.OFFICIAL_PROXY_TARGETS || "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);

const officialSources = [
  {
    id: "mct-holiday-bulletin",
    title: "假日旅游市场数据发布",
    owner: "文化和旅游部",
    category: "holiday-flow",
    level: "national",
    access: "public-page",
    frequency: "节假日分时段或日更发布",
    coverage: "全国旅游出游人次、消费等宏观统计",
    endpointLabel: "发布页 / 通知公告",
    officialUrl: "https://www.mct.gov.cn/",
    note: "适合接入节假日总量监测与趋势看板，不一定提供统一开放 API。",
  },
  {
    id: "ncha-museum",
    title: "博物馆与文物资源公开信息",
    owner: "国家文物局",
    category: "cultural-relics",
    level: "national",
    access: "public-page",
    frequency: "按名录和公告更新",
    coverage: "博物馆、文物保护单位、展览和政策公告",
    endpointLabel: "政务公开 / 公告栏目",
    officialUrl: "https://www.ncha.gov.cn/",
    note: "适合做文博资源图谱、开放信息和专题知识库。",
  },
  {
    id: "beijing-open-data",
    title: "北京市公共数据开放平台",
    owner: "北京市公共数据开放平台",
    category: "open-platform",
    level: "local",
    access: "open-data",
    frequency: "按数据集更新频率而定",
    coverage: "部分文旅、博物馆、场馆、预约或运行类数据",
    endpointLabel: "开放数据集 / 数据接口",
    officialUrl: "https://opendata.beijing.gov.cn/",
    note: "需要按具体数据集判断是否有接口、是否需要 key 或授权。",
  },
  {
    id: "shanghai-open-data",
    title: "上海公共数据开放平台",
    owner: "上海市公共数据开放平台",
    category: "open-platform",
    level: "local",
    access: "open-data",
    frequency: "按数据集更新频率而定",
    coverage: "文旅、城市运行、公共服务等开放数据目录",
    endpointLabel: "开放属性 / 数据接口",
    officialUrl: "https://data.sh.gov.cn/",
    note: "适合补地方景区、文化场馆或城市运行类扩展数据。",
  },
  {
    id: "local-scenic-reservation",
    title: "景区预约与客流监测系统",
    owner: "各景区或属地文旅部门",
    category: "holiday-flow",
    level: "local",
    access: "authorized",
    frequency: "分钟级到小时级",
    coverage: "景区实时在园人数、预约人数、承载量阈值",
    endpointLabel: "预约系统接口 / 大屏接口",
    officialUrl: "https://www.mct.gov.cn/",
    note: "最接近实时客流，但通常需要合作或内部授权。",
  },
  {
    id: "local-museum-open",
    title: "地方博物馆开放信息",
    owner: "各地文博主管部门与博物馆官网",
    category: "cultural-relics",
    level: "local",
    access: "public-page",
    frequency: "日更或按公告更新",
    coverage: "节假日开闭馆、特展、预约时段、限流提示",
    endpointLabel: "官网公告 / 预约页",
    officialUrl: "https://www.ncha.gov.cn/",
    note: "适合做节假日开放提醒和专题推荐。",
  },
];

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-token",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  });
  res.end(JSON.stringify(body));
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

const readJsonBody = req =>
  new Promise((resolve, reject) => {
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk;
    });
    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url === "/health") {
    sendJson(res, 200, { ok: true, hasApiKey: Boolean(API_KEY), baseUrl: BASE_URL });
    return;
  }

  if (req.url === "/api/official/sources" && req.method === "GET") {
    sendJson(res, 200, {
      sources: officialSources.map(source => ({
        ...source,
        configured: OFFICIAL_PROXY_TARGETS.includes(source.id),
        mode: OFFICIAL_PROXY_TARGETS.includes(source.id) ? "proxy-ready" : "catalog",
        updatedAt: new Date().toISOString(),
      })),
    });
    return;
  }

  if (req.url.startsWith("/api/buildings")) {
    const url = new URL(req.url, "http://localhost");
    const pathname = url.pathname;
    const idMatch = pathname.match(/^\/api\/buildings\/([^/]+)$/);

    try {
      const { db, dbPath, seedInfo } = await initBuildingsDb({ projectRoot });

      if (pathname === "/api/buildings" && req.method === "GET") {
        const items = await listBuildings(db, {
          topic: url.searchParams.get("topic") || "",
          provinceCode: url.searchParams.get("provinceCode") || "",
          q: url.searchParams.get("q") || "",
          limit: url.searchParams.get("limit") || "",
          offset: url.searchParams.get("offset") || "",
        });
        sendJson(res, 200, {
          items,
          total: items.length,
          dbPath,
          seedInfo,
        });
        return;
      }

      if (idMatch && req.method === "GET") {
        const id = decodeURIComponent(idMatch[1]);
        const item = await getBuildingById(db, id);
        if (!item) {
          sendJson(res, 404, { error: "Building not found", id });
          return;
        }
        sendJson(res, 200, { item });
        return;
      }

      if (pathname === "/api/buildings" && req.method === "POST") {
        if (!hasWritePermission(req)) {
          sendJson(res, 403, { error: "Forbidden: invalid admin token" });
          return;
        }
        const body = await readJsonBody(req);
        const item = await createBuilding(db, body);
        sendJson(res, 201, { item });
        return;
      }

      if (idMatch && req.method === "PUT") {
        if (!hasWritePermission(req)) {
          sendJson(res, 403, { error: "Forbidden: invalid admin token" });
          return;
        }
        const id = decodeURIComponent(idMatch[1]);
        const body = await readJsonBody(req);
        const item = await updateBuilding(db, id, body);
        if (!item) {
          sendJson(res, 404, { error: "Building not found", id });
          return;
        }
        sendJson(res, 200, { item });
        return;
      }

      if (idMatch && req.method === "DELETE") {
        if (!hasWritePermission(req)) {
          sendJson(res, 403, { error: "Forbidden: invalid admin token" });
          return;
        }
        const id = decodeURIComponent(idMatch[1]);
        const deleted = await deleteBuilding(db, id);
        if (!deleted) {
          sendJson(res, 404, { error: "Building not found", id });
          return;
        }
        sendJson(res, 200, { ok: true, id });
        return;
      }

      sendJson(res, 405, { error: "Method not allowed" });
      return;
    } catch (error) {
      sendJson(res, 500, {
        error: "Buildings API error",
        detail: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  }

  if (req.url !== "/api/deepseek/chat" || req.method !== "POST") {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  if (!API_KEY) {
    sendJson(res, 500, { error: "DEEPSEEK_API_KEY is missing on the server" });
    return;
  }

  try {
      const body = await readJsonBody(req);
      const payload = {
        model: body.model || MODEL,
        temperature: typeof body.temperature === "number" ? body.temperature : 0.35,
        messages: Array.isArray(body.messages) ? body.messages : [],
      };

      if (!payload.messages.length) {
        sendJson(res, 400, { error: "messages are required" });
        return;
      }

      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        sendJson(res, response.status, {
          error: "DeepSeek upstream error",
          detail: data,
        });
        return;
      }

      sendJson(res, 200, data);
  } catch (error) {
    sendJson(res, 500, {
      error: "Proxy request failed",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(PORT, () => {
  console.log(`DeepSeek proxy listening on http://localhost:${PORT}`);
});
