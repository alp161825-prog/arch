# DeepSeek 接入设计

## 推荐架构

不要在前端直接暴露 DeepSeek API Key。

推荐链路：

1. 前端页面调用 `/api/deepseek/chat`
2. 你的后端或 Serverless 函数读取 `DEEPSEEK_API_KEY`
3. 后端再请求 `https://api.deepseek.com/chat/completions`
4. 后端把结果裁剪后返回给前端

## 前端已准备的骨架

- `.env.example`
- `src/lib/ai/deepseek.ts`
- `server/deepseek-proxy.mjs`
- 首页 `AI 导览助手` 面板

## 本地运行方式

1. 在环境变量中配置服务端密钥
2. 运行 `npm run proxy`
3. 再运行 `npm run dev`

开发阶段 `vite` 已把 `/api` 代理到 `http://localhost:8787`

前端只需要知道：

- `VITE_DEEPSEEK_PROXY_PATH`
- `VITE_DEEPSEEK_MODEL`

## 建议的后端接口

请求：

```json
{
  "model": "deepseek-chat",
  "temperature": 0.35,
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

返回：

```json
{
  "choices": [
    {
      "message": {
        "content": "..."
      }
    }
  ]
}
```

## 接入后能做什么

1. 当前专题讲解词生成
2. 案例对比分析
3. 时间演进答疑
4. 地域差异解释
5. 展板摘要或课程文案生成
6. 基于当前页面上下文的智能问答

## 页面内最适合接入的位置

1. 首页右侧加“AI 导览助手”
2. 专题页加“让 AI 解释这一阶段”
3. 对比分析页加“让 AI 总结四类建筑差异”
4. 时间演进页加“让 AI 生成课程串讲稿”

## 安全建议

1. 不要把真实密钥写进 `VITE_*`
2. 不要把真实密钥提交到 git
3. 给后端接口加频率限制
4. 限制可调用模型和最大 token
5. 对前端透传的 prompt 做长度限制与日志审计
