export type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DeepSeekChatRequest = {
  messages: DeepSeekMessage[];
  model?: string;
  temperature?: number;
};

export type DeepSeekChatResponse = {
  content: string;
  raw?: unknown;
};

const proxyPath = (import.meta.env.VITE_DEEPSEEK_PROXY_PATH as string | undefined) || "/api/deepseek/chat";
const defaultModel = (import.meta.env.VITE_DEEPSEEK_MODEL as string | undefined) || "deepseek-chat";

export const requestDeepSeekChat = async (payload: DeepSeekChatRequest): Promise<DeepSeekChatResponse> => {
  const response = await fetch(proxyPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: payload.model ?? defaultModel,
      temperature: payload.temperature ?? 0.35,
      messages: payload.messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek proxy request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim?.() ?? data?.content ?? "";

  if (!content) {
    throw new Error("DeepSeek returned empty content");
  }

  return { content, raw: data };
};


