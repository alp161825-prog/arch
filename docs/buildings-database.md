# 建筑数据库与后端管理说明

## 当前状态
- 建筑数据存储在 SQLite：`server/data/buildings.db`
- 展示页面通过后端接口读取建筑数据
- 后端已提供 CRUD 接口（增删改查）
- 建筑图片支持数据库字段 `image`（优先使用）

## 启动方式
1. 启动后端：
```bash
npm run proxy
```

2. 启动前端：
```bash
npm run dev
```

## 接口列表
- `GET /api/buildings`
  - 查询参数：`topic`、`provinceCode`、`q`、`limit`、`offset`
- `GET /api/buildings/:id`
- `POST /api/buildings`
- `PUT /api/buildings/:id`
- `DELETE /api/buildings/:id`

## 写操作权限（后端管理）
- 环境变量：`BUILDINGS_ADMIN_TOKEN`
- 请求头：`x-admin-token`

规则：
- 未配置 `BUILDINGS_ADMIN_TOKEN` 时，写操作默认允许
- 已配置后，`POST/PUT/DELETE` 必须带正确 `x-admin-token`，否则返回 `403`

## 图片存储建议
- 图片文件放在：`public/user-images/图片/`
- 数据库 `image` 字段存静态访问路径，例如：`/user-images/图片/故宫.jpg`
- 页面会优先显示数据库 `image`，为空时再走旧的映射兜底

## 示例（PowerShell）
```powershell
$headers = @{ "Content-Type" = "application/json"; "x-admin-token" = "你的口令" }

$body = @{
  id = "demo-building-1"
  label = "测试建筑"
  longitude = 116.4
  latitude = 39.9
  regionId = "north"
  dynasty = "明清"
  topic = "palace"
  heat = 85
  provinceCode = "110000"
  location = "北京"
  summary = "用于测试"
  image = "/user-images/图片/故宫.jpg"
  source = "manual"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/buildings" -Method POST -Headers $headers -Body $body
```

## 字段参考
- `id`
- `label`
- `longitude` / `latitude`
- `regionId`
- `dynasty`
- `topic`
- `heat`
- `provinceCode`
- `location`
- `summary`
- `image`
- `source`
- `createdAt` / `updatedAt`
