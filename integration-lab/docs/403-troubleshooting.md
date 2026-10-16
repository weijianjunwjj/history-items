# 本地接口 403 排查与修复

## 根因与复现

2026-10-16，按 PR #2 的 P0 评论排查。评论没有提供用户浏览器的原始 Network 导出；以下使用仓库实际存在的雅迪 `test` 启动端口 8004 复现，不推断未提供的用户操作细节。

修复前提交：`b7870614bb6ae7557ebf5093698021a8c560eb4c`。Node v24.14.1、PowerShell 7.6.5；本机已有实验台监听 `127.0.0.1:4300`。

```powershell
$headers = @{ Origin = 'http://localhost:8004' }
Invoke-WebRequest http://127.0.0.1:4300/api/health -Headers $headers -SkipHttpErrorCheck
Invoke-WebRequest http://127.0.0.1:4300/api/preBook -Method Options -Headers @{
  Origin = 'http://localhost:8004'
  'Access-Control-Request-Method' = 'POST'
  'Access-Control-Request-Headers' = 'content-type'
} -SkipHttpErrorCheck
Invoke-WebRequest http://127.0.0.1:4300/api/preBook -Method Post -Headers $headers `
  -ContentType 'application/json' `
  -Body '{"userName":"P0复现","phone":"13000000000","carType":"测试车型","code":"000000"}' `
  -SkipHttpErrorCheck
```

三次请求均为 **HTTP 403**，响应体均为：

```json
{"code":403,"msg":"仅允许本机实验台的来源","data":null}
```

没有 `Access-Control-Allow-Origin`。同一健康检查改为 `Origin: http://localhost:8003` 即返回 200。`Origin: http://localhost:3000` 同样复现 403。请求直接访问本机 Node，没有经过 Nuxt 代理或外部服务；响应体与 `server.mjs` 的白名单拒绝分支完全一致。现有后端只记录启动及内部异常，没有逐请求访问日志，403 分支本身不输出日志。

原来源白名单由实验台端口和五个注册系统的固定 URL 生成，漏掉了雅迪实际脚本 `test` 的 8004、`prod` 的 8005 以及 Nuxt 常用的 3000，开发服务自动换端口也会失败。Origin 检查在 OPTIONS 处理前执行，JSON POST 的预检因此也被拒绝；浏览器会另外报告 CORS 错误。

核对入口：`microapps.mjs` 使用相对 API 路径，与实验台同源，无须改动。雅迪普通及静态 `bookingRideApi.ts` 在显式设置 `HISTORY_LAB_API_URL=http://127.0.0.1:4300` 后直接请求该地址的 `/api/code`、`/api/preBook`；桌面和移动预约页均使用该 API，读取 `status === 200` 和 `data.delivery/demoCode`。`nuxt.config.ts` 已向客户端公开这一显式配置，不需要另加代理或切换其他旧接口。

## 最小修复与安全边界

仅替换实验台的来源判断：用 URL 解析并要求规范的完整 HTTP(S) Origin，只接受精确回环主机 `localhost`、`127.0.0.1`、`[::1]`，允许合法开发端口变化。拒绝含凭据、路径、查询、片段、伪造后缀、外部主机、非 HTTP(S) 协议、无效端口或 `null` 的来源。

默认监听仍为 `127.0.0.1`；未改变业务、认证或代理。只回显获准来源，保留 `Vary: Origin`、允许方法和 `Content-Type` 限制，不允许跨域凭据。未实现接口仍返回 404。来源缺失的本机命令行请求保持可用，空 Origin 不作为缺失来源放行。

## 验证

新增回归测试在旧实现下实际失败：健康检查与原预约码请求均得到 403（当时 9 项测试，7 通过、2 失败）；修改实现后恢复通过。

```powershell
npm --prefix integration-lab test
```

最终结果：**10 项通过，0 失败**。测试使用真实 HTTP 和临时 SQLite，覆盖五系统注册来源、localhost/127.0.0.1、3000/8004/8005/动态端口、IPv6 回环及 HTTPS、本机无 Origin、OPTIONS、外部及畸形来源拒绝、预约与原表单字段、错误验证码和一次性使用、工单派发/关闭、物流单唯一性与状态更新、显式 404。持久化测试实际启动并正常关闭三个独立 Node 进程，验证验证码跨重启可用、预约跨重启保留、已消费验证码跨重启仍拒绝。

Chromium 145 浏览器实测（独立临时数据库，不污染已有演示数据）：

- 五个系统导航均能切换；ESM 和 Web Components 两种模式下，预约新增、工单创建/派发/关闭、物流创建/状态更新均通过；刷新后记录仍存在。
- LiveShop 和游戏面板继续明确引导使用独立真实后端，没有复制或伪造其 API。
- 从真实 `http://localhost:3000` 和 `http://localhost:8004` 页面跨域访问实验台：`GET /api/code` 为 200（`local_only`），浏览器自动发起的 `OPTIONS /api/preBook` 为 204，实际 JSON POST 为 201，响应 `status: 200`；重复提交同一验证码为 400，未实现接口为 404。
- 浏览器实测后端挂接临时访问日志，记录实际 method、URL、Origin、status 和允许来源，确认预检和 POST 均到达真实 Node/SQLite；没有拦截或 Mock 请求。

修复前的无效演示码 POST 在解除来源拒绝后应返回业务校验 400；获取真实本地演示码后才返回 201，不以一律返回成功掩盖错误。演示码仍只展示在本地页面，不发送短信。

已重启原有 `127.0.0.1:4300` 实验台进程，保留原数据库。重放相同地址和 `http://localhost:8004` 来源的健康检查与预约预检，分别返回 200、204；外部 `https://attacker.example` 仍返回 403。

## 雅迪完整原页与尚不可用的模块

已安装雅迪声明的依赖用于真实启动验证，没有修改或提交依赖清单与锁文件。当前无锁安装解析到 Nuxt 3.21.11、Vue 3.5.44、ant-design-vue 3.2.20。

- 原 `pnpm run test --host 127.0.0.1` 带有旧 `--mode test` 参数，在当前 CLI 下显示 Nuxt 欢迎页，没有加载原预约表单，不能作为原页通过证据。
- 用 `HISTORY_LAB_API_URL=http://127.0.0.1:4300`、`pnpm exec nuxt dev --port 8005 --host 127.0.0.1` 启动实际项目后，浏览器访问 `/booking-ride`、`/mob/booking-ride` 均为 SSR 500：`__vite_ssr_import_4__.default.mark is not a function`，栈位于 `ant-design-vue/es/notification/index.js`。Vite 同时报告 `api/honorsApi.ts` 引用不存在的 `~~/node-jiti/chunks-dep-5e7f419b.js.9ccbdf3a`；该导入在修复前 Git 提交中已经存在。
- 因此本次确认的是桌面/移动预约 API 的路径、字段、演示码响应契约和真实浏览器跨域请求；**完整 Nuxt 原页面点击预约仍未验收通过**。没有用 Mock、跳过异常或修改其他业务来伪造通过。临时 Nuxt 验证服务已关闭。
- 码上售后原页面的私有 SDK/IoT/视频服务、中邮通缺失 `src` 的原后台及其余未实现远端接口仍不可用；LiveShop、游戏原系统全量功能不属于此次变更。实验台三类面板及五系统注册已验证，不代表五套历史原页面全部恢复。
