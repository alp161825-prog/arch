const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const withCors = res => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
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

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!API_KEY) {
    res.status(500).json({ error: "DEEPSEEK_API_KEY is missing on the server" });
    return;
  }

  try {
    const body = parseBody(req);
    const payload = {
      model: body.model || MODEL,
      temperature: typeof body.temperature === "number" ? body.temperature : 0.35,
      messages: Array.isArray(body.messages) ? body.messages : [],
    };

    if (!payload.messages.length) {
      res.status(400).json({ error: "messages are required" });
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
      res.status(response.status).json({
        error: "DeepSeek upstream error",
        detail: data,
      });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Proxy request failed",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
