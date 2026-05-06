# Vercel 数据库部署指南（SQLite -> Postgres）

## 1. 先在 Vercel 创建数据库
1. 打开你的 Vercel 项目。
2. 进入 `Storage`。
3. 创建 `Postgres`（Vercel Postgres）。
4. 创建完成后，Vercel 会自动提供 `POSTGRES_URL` 等环境变量。

## 2. 在项目里准备依赖
```bash
npm install
```

## 3. 配置环境变量
在 Vercel 项目 `Settings -> Environment Variables` 中确认存在以下变量（至少一个连接串）：
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL`
- `BUILDINGS_ADMIN_TOKEN`（可选，但推荐）

## 4. 部署 API（本仓库已新增）
已新增 Vercel Functions：
- `api/buildings/index.mjs`
- `api/buildings/[id].mjs`

前端现有请求 `/api/buildings` 不需要改动。

## 5. 迁移现有 SQLite 数据到 Postgres
先在本地 shell 设置数据库连接串（建议用 `DATABASE_URL`）：

```bash
# Windows PowerShell 示例
$env:DATABASE_URL = "你的 Postgres 连接串"
```

执行迁移命令：
```bash
npm run migrate:buildings:postgres
```

可选：指定 SQLite 文件路径（不指定时默认 `server/data/buildings.db`）：
```bash
node ./scripts/migrate-buildings-sqlite-to-postgres.mjs ./server/data/buildings.db
```

## 6. 验证线上接口
部署后访问：
```text
https://你的域名/api/buildings?limit=5
```

返回包含 `items` 即表示数据库连通成功。

## 7. 常见问题
- 页面没有数据且接口 500：通常是数据库连接串未配置或变量名错误。
- 页面没有数据且接口 404：通常是 API 函数未部署成功，检查构建日志。
- 新增/修改失败 403：已设置 `BUILDINGS_ADMIN_TOKEN` 但请求头缺少 `x-admin-token`。
