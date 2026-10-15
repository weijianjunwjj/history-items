# LiveShop 本地管理后台

旧公司后端已替换为本地 Node.js + SQLite 后端，保留 Vue 3 管理界面。所有当前前端定义的接口按其字段约定重建，示例数据可增删改并持久保存。

## 快速启动

需要 Node.js 22.13+（推荐当前本机 Node.js 24）。首次安装依赖：

```powershell
pnpm install
npm run dev
```

已有 `node_modules` 时直接运行 `npm run dev` 即可。一个命令同时启动前端和后端。

- 管理界面：http://127.0.0.1:5173
- 后端健康检查：http://127.0.0.1:8787/api/health
- 初始账号：`admin`
- 初始密码：`admin123`
- 本地验证码：`1234`

管理员密码可在「用户中心」修改。首次初始化前设置 `ADMIN_PASSWORD` 可以覆盖初始密码；对已初始化数据库不生效。

## 数据与功能

数据库自动生成在 `server/data/liveshop.sqlite`，上传文件保存在 `server/data/uploads/`，均已忽略 Git。没有 MySQL、Redis、Docker 等启动依赖。退出终端再启动，数据依然保留；清空某模块不会被下一次启动重新填回。

已重建登录、菜单、管理员、权限组、字典、操作日志、商品分类、规格、商品库、预约/拼团/众筹活动、各类订单、运营用户、广告、通知、消息模板、社区动态/话题、充值配置、积分规则和统计接口。上传支持图片/视频并使用本地地址。

前端 API 经自动扫描共 109 个接口，覆盖检查已通过。完整地址、方法及能力说明见 [本地接口清单](docs/local-api.md)。可用 `node scripts/api-inventory.mjs` 重新扫描。

示例数据用于本地体验，并非原公司真实数据。发货、退款、充值、通知等操作在本地修改业务记录；未接入真实支付、物流、短信、推送或第三方社交服务。该版本优先用于恢复运行和开发，不应直接作为公网生产服务。

## 构建后运行

```powershell
npm run build
npm start
```

访问 http://127.0.0.1:8787，Node 同时提供 `dist` 前端和 API。开发时前端通过 Vite 把 `/api` 转发到本地后端，三个环境默认都不访问旧公司的服务器。

## 验证与配置

```powershell
npm run test:local
npm run build
```

`test:local` 验证新后端的接口、权限、业务变更、上传及 SQLite 重启持久化。仓库已有的 `tests/specs-page.test.mjs` 与当前规格页面源码不一致（引用了不存在的重构函数），未纳入这个后端验证命令。

- `API_PORT`：后端端口，默认 `8787`。
- `DATA_DIR`：数据目录，默认项目下 `server/data`。
- `npm run dev:backend` / `npm run dev:frontend`：分别启动后端和前端。

备份时先停止服务，再复制整个 `server/data` 目录（包括 SQLite 的 WAL 相关文件）。需要全新示例数据时，先停止服务并备份，再手动移走数据目录后重启。
