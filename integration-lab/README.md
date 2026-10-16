# 五大系统集成实验台（第一批）

目标：**优先恢复可调用的本地 HTTP/SQLite 后端**，再通过不同的微前端挂载方式对比隔离、生命周期和状态管理。不是重新做五套 UI，更不是用“前端 Mock + setTimeout”冒充后端。

## 运行

Node.js **22.16+**（使用 Node 内建的 `node:sqlite`，Node 22 会提示 experimental warning）。

```bash
cd integration-lab
npm start
# 浏览器打开 http://127.0.0.1:4300
npm test
```

**无需 npm install。** 默认只监听本机 127.0.0.1，使用 `data/lab.sqlite` 保存数据。重复启动不会覆盖数据。如要隔离测试，可设置环境变量 `LAB_DB` 指向其他数据库文件；`PORT` 可修改端口。数据文件应保留本地，不要提交真实客户数据。

## 目前真实可执行的核心 API

| 域 | 接口 | 行为 |
|---|---|---|
| 雅迪 | `POST /api/preBook` | 接收姓名、电话、车型，保存骑行预约 |
| 雅迪 | `GET /api/code` | **明确返回未发送**；没有短信供应商，不返回伪验证码 |
| 雅迪 | `GET/POST /api/lab/yadea/records` | 查询/创建本地预约 |
| 售后 | `GET /qrcode/work-ticket/list` | 查询真实 SQLite 工单 |
| 售后 | `GET /qrcode/work-ticket/types` | 工单类型 |
| 售后 | `GET /qrcode/work-ticket/get/:id` | 查询单据 |
| 售后 | `POST /qrcode/work-ticket/add` | 创建工单 |
| 售后 | `POST /qrcode/work-ticket/dispatch` | 仅待处理工单可派发 |
| 售后 | `POST /qrcode/work-ticket/close` | 仅已派发工单可关闭 |
| 售后 | `GET/POST /api/lab/aftersales/records` | 实验台标准入口 |
| 中邮通 | `GET/POST /api/ems/shipments` | 查询/创建运单 |
| 中邮通 | `PATCH /api/ems/shipments/:id` | 更新运单状态 |
| 中邮通 | `GET/POST /api/lab/ems/records` | 实验台标准入口 |
| 通用 | `GET /api/health` / `GET /api/systems` | 健康检查和五系统注册 |

约束：仅演示样本，未实现的端点返回 404，不用空白成功数据欺骗页面；请求字段做基本校验；本地实验环境不含生产认证、短信、支付、物流公司、物联网与视频服务。**不可暴露到公网使用。**

## 微前端切换（同一个页面，下拉框自由切换）

1. **iframe**：显示已有应用的完整页面。JavaScript、CSS、路由互相隔离，但仍要求原项目服务独立启动。不能把“原子页面可打开”当成后端已覆盖。
2. **原生 ESM**：实验台使用 `bootstrap/mount/unmount` 生命周期动态挂载业务迷你应用，切换后卸载，不是 single-spa/qiankun 的冒名实现。
3. **Web Components + Shadow DOM**：和 ESM 方式共用相同的真实 HTTP API，改由自定义元素挂载和样式隔离，便于实际观察 DOM/CSS 的不同。

ESM/Web Components 目前是**可操作的最小功能面板**（预约创建、工单创建/派发/关闭、运单创建/改状态），并非把五套原项目 Vue/Nuxt 页面“魔法般转成”原生组件。

### 原业务前端独立启动入口

| 系统 | 项目目录 | 预期地址 | 现状 |
|---|---|---|---|
| LiveShop | `LiveShop 海外社交电商/admin-live-shop` | `http://127.0.0.1:5173` | 已有 Node/SQLite 后端与完整接口测试；按自身 README 启动 |
| 雅迪 | `雅迪电动车品牌官网/yadea-website-master` | `http://127.0.0.1:8003` | 原 Nuxt 仍有旧远端/静态接口依赖；本实验台只实现预约核心 |
| 游戏行为分析/SDK | `游戏行为分析与 SDK 异常监控` | `http://127.0.0.1:4173` | 已有六个原生 ESM 子应用与 Node/SQLite；按 README 运行 |
| 码上售后 | `码上售后 App 与设备物联/qrcode-kefu-master` | `http://127.0.0.1:8888` | 原项目还依赖私有接口/SDK。独立启动需要补其构建环境 |
| 中邮通 | `中邮通管理后台与微信小程序/ems-backend` | 尚不可用 | 当前快照**缺少 src 目录**，不能声称页面完整可运行 |

不要通过 iframe 模式来验证接口是否真的走本实验台；**用 ESM/Web Components 里的操作 + 浏览器 Network + SQLite 重启核验**，或者让原页面逐一改到本地 API。

## 下一批应做的事

- 雅迪：查明预约表单字段，替换 `api/static/bookingRideApi.ts` 的历史硬编码第三方接口；恢复车型/资讯的本地 API。
- 售后：检查 `@hx/packages/service/request` 的响应约定和 dev proxy，按工单/设备/用户最短闭环接本地服务，未覆盖接口一律显示错误。
- 中邮通：找回缺失的 `src` 才能在原界面验证后台 CRUD；不能靠编造页面替代源码。
- 追加 Wujie/qiankun 比较前，先解决子应用跨域、资源路径、路由和生命周期：目前没有假装两者已接入。Wujie 对子应用入侵较小，但仍需满足资源 CORS 和启动前提。

## 验收方法

```bash
cd integration-lab
npm test
```

测试走真实 HTTP 并实际读写临时 SQLite，覆盖预约、工单状态机、物流唯一运单号、失败码。测试通过 **≠** 五个历史应用所有页面都已接线，也 **≠** 真人短信或真实设备接入。
