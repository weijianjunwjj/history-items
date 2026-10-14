# 友谊时光工作复盘 · 本地微前端 + SQLite

**v0.8.0 / 2026-10-14**。由 v0.7 可操作演示增量改造，保留 EBI、CRM、日志配置、SDK 监控、跨页流程、19站自动演示、个人讲解和工作区备份。不需要 Codex 重新搭页面。

这是用于自己操作、找回工作细节、辅助面试讲解的脱敏复现项目。**数据库和 HTTP 请求是真的；业务记录仍是固定模拟样本。** 不连接公司网络，不采集真实 SDK，不发布活动或发奖。

## 1. 最快运行

需要 **Node.js 22.16.0 或更高版本**。已在 Windows 11 / Node **24.14.1** / Edge **155.0.4283.45** 完成本地验收；原交付环境 Node 22.16.0 的证据也保留。

解压到任意可写目录，在包含 `package.json` 的目录打开终端：

```sh
node -v
npm run start:open
```

这条命令会构建并启动服务、自动打开浏览器；已有同库服务时直接复用。只启动服务而不打开浏览器仍可用 `npm start`。页面地址：

```text
http://127.0.0.1:4173
```

**无需 `npm install`，无需 MySQL、Docker、Python 或额外数据库服务。** 项目没有运行时第三方依赖。`npm start` 会先构建，再创建/迁移 SQLite、装入初始模拟样本、启动一个本地服务。保留终端运行；按 Ctrl+C 停止。

**Windows 推荐直接双击 `双击启动.cmd`**（旧入口 `start-windows.cmd` 同样可用）；macOS 可在终端执行 `bash start-macos.command`。首次看到 SQLite ExperimentalWarning 不等于启动失败；以终端地址和 `npm run doctor` 结果为准。

一键启动会先检测是否已有**使用相同 SQLite 文件**的本项目实例：如果有，直接打开该页面，不会重复构建和启动。默认 `4173` 被其他软件占用时，自动尝试后续端口（通常为 `4174`）；不会关闭别的程序，也不会删除数据库。服务首次启动成功后请保留终端窗口，按 `Ctrl+C` 才会停止服务。浏览器关闭不代表后台服务停止。

如需手动固定端口，PowerShell：

```powershell
$env:PORT = '4180'
npm start
```

**显式设置 `PORT` 时不会自动换端口**；不想指定就先执行 `Remove-Item Env:PORT -ErrorAction SilentlyContinue`。独立启动测试：`npm run test:launcher`。

数据库默认位置：`data/replay.sqlite`。构建不会删除数据库，重启不会重新覆盖已保存内容。不要再用“双击 HTML”运行本地 SQL 版。

## 2. 第一次体验顺序

首页点「自动演示」，先看19站串联。退出后进入自己的工作区；演示修改只在独立内存中，不写你的数据库。

左侧「本地数据库与服务」可查看真实表行数，点「SQL核对 10台 / 25次」验证统一样本窗口。再去 CRM 改一个配置或留一段复盘笔记，等底部显示「SQLite 已同步」，刷新、停止并重开服务，核对内容。

**Windows 真实 HTTP → SQLite 链路已验收：18项浏览器场景、197项Node测试及12项启动/备份检查通过，19站自动播放完整结束且主SQL工作区不变。** 详见 [Windows本地验收](docs/Windows本地验收.md)。原交付环境的浏览器拦截和离线注入结果仍单独保留在 `docs/验收报告.md`。

## 3. 微前端入口

一个 Shell、六个独立 ESM 应用入口，共用本地 HTTP/SQL 服务。每个业务应用导出 `bootstrap / mount / update / unmount`；跨应用切换会卸载前一个并挂载下一个。

| 应用 | 独立入口 | 独立构建 |
|---|---|---|
| EBI | `/apps/ebi/index.html` | `npm run build:ebi` |
| CRM | `/apps/crm/index.html` | `npm run build:crm` |
| 日志上报配置 | `/apps/report/index.html` | `npm run build:report` |
| SDK监控 | `/apps/monitor/index.html` | `npm run build:monitor` |
| 业务/技术导览 | `/apps/journey/index.html` | `npm run build:journey` |
| 工作复盘 | `/apps/workbench/index.html` | `npm run build:workbench` |

独立入口可脱离主菜单加载一个应用；跳到其他业务时回主宿主。`dist/apps/<name>/manifest.json` 记录入口、生命周期、共享依赖和文件哈希。

**采用原生 ESM 路由级微前端，不是 single-spa/SystemJS，也没有改写成 Vue2。** 不具备独立依赖版本沙箱、任意第三方脚本隔离、多团队远程部署平台。四组业务应用与两个辅助应用不应说成六个历史业务项目。

## 4. SQL 真正负责什么

- `behavior_records`：12,923条正常行为练习记录；`sdk_samples`：36,720条带上报次数的 SDK 计数样本。数据日期/口径与 v0.7 一致。
- EBI 筛选、设备/模块读取、SDK 范围查询通过 HTTP，由参数化 SQL 选出记录；数据库核对使用 `COUNT(DISTINCT ...)` / `SUM(...)`。
- 原漏斗顺序计算、动态列 mapper、部分图表分桶在读取 SQL 结果后仍使用既有纯函数，避免换数据库时改变业务口径。
- 正式 CRM、奖品、通用字段、事件配置有结构化表；递归树/复杂配置保留 JSON。工作区保存和结构化映射位于同一 SQL 事务。
- 笔记、讲解、已暂存草稿、查询和列设置保存到 `workspace_state`；`local/session` 是兼容旧版的逻辑分区，**本版两者都在 SQL 中持久化**。
- 启动时从 SQL 读取的快照也供配置预览、SDK局部详情复用。并不是每个纯展示点击都产生新的 SQL 请求。没有来源的正常行为仍然留空。

普通新建事件的24条效果预览仍由配置生成模拟值，不代表接通真实日志上报。详情见 `docs/本地架构与SQL.md`。

## 5. 保存、冲突和备份

输入先进入视图缓存并排队写入，底部显示待确认。正式保存按钮等待服务器事务确认才提示已保存。断网/关服务会保留当前待写内容并显示错误，不静默改成假保存。多个窗口修改同一个键时返回版本冲突，不覆盖较新数据；先导出当前工作区，再刷新合并。不是多人协作系统。

重启服务会轮换本机请求令牌。旧页面请在确认无待写内容后刷新；有未保存内容时先导出，避免丢失。

工作区 JSON：左侧「备份与运行检查」→ 导出/导入，导入先预览和确认。**v0.7 的整套工作区备份可通过这里导入 SQL**；旧版个人笔记 JSON 只合并笔记。单独的 CRM/事件导出文件不作为整库恢复文件。不同 file/HTTP 入口的浏览器存储不能自动迁移。

完整数据库备份：

```sh
npm run db:backup
```

生成 `data/backups/*.sqlite`，通过 SQLite `VACUUM INTO` 创建一致性副本。不要在服务运行时只复制 `.sqlite` 主文件而漏掉 WAL。恢复数据库副本应先停服务、备份当前数据库文件组，再将一致性副本作为新 `REPLAY_DB` 启动；不要把旧 `-wal/-shm` 混用到恢复文件。

PowerShell 指定恢复副本（原库保留）：

```powershell
$env:REPLAY_DB = 'data/backups/你的备份文件.sqlite'
npm start
```

这会继续写入所选副本，正式使用前先另外复制留底。工作区、SQLite和备份含个人笔记，均不要提交公开仓库。

## 6. 开发与验证

```sh
npm run dev          # 直接服务源码；刷新加载修改，非自动热更新
npm run start:open   # 一键启动并打开默认浏览器；重复执行复用已有服务
npm run build        # 全部静态入口；不碰数据库
npm test             # 业务、SQL/HTTP、写入协议与启动器回归
npm run test:sql      # 只跑新增SQL相关测试
npm run doctor       # Node、目录权限、schema、seed、quick_check
npm run db:inspect   # 真实表数量和SQLite状态
npm run verify       # 构建 + 全部Node测试 + doctor
```

浏览器自动化是可选开发工具，**不影响正常启动**。本地需 Python 和 Playwright；Windows 默认尝试 Edge，也可指定 `CHROMIUM_PATH`。

```sh
python -m pip install --target data/test-tools playwright
# 本机没有Edge/Chrome/Chromium时，再安装测试浏览器：
python -m playwright install chromium
npm run test:browser
```

`tests/browser_local.py` 用临时数据库启动真实 localhost，测试刷新、重启、保存/草稿、下钻、导入、错误重试、独立入口、全19站自动演示。默认端口/数据库均隔离，不覆盖你的主库。失败必须查看报告，**退出码2表示环境拦截，不是通过**。

本机已将可选测试依赖放入被 Git 忽略的 `data/test-tools`，`npm run test:browser` 会自动读取。已通过的 Windows 测试使用本机 Edge；正常运行项目仍不需要 Python 或 Playwright。重测 Windows 脚本及一致性备份：主服务运行时执行 `node scripts/accept-backup-launcher.mjs`，它复制备份到独立测试目录，并打开三个临时服务的默认浏览器页面；不会覆盖主库。

`npm run test:browser:legacy` 为同构建页面注入的旧业务回归；它不验证 SQL 浏览器传输。两组结果必须分开。

## 7. 目录

```text
src/shell/                 主宿主、应用注册、生命周期
src/apps/{ebi,crm,report,monitor,journey,workbench}/
src/entry.js               SQL启动握手；失败不进入假保存模式
src/shared/sql-client.js   缓存、提交队列、ACK、版本冲突、幂等重试
src/api/                   页面异步API和响应适配
src/domain/                原业务纯函数与确定性模拟样本
server/server.mjs          HTTP/静态资源/本机安全约束
server/database.mjs        SQLite仓储、事务、种子与备份
server/queries.mjs         参数化SQL与既有业务转换
server/migrations/         SQL schema
apps/                      开发时六个独立HTML入口
dist/                      本次静态构建（npm start 会重新构建）
data/                      首次运行生成的数据库，不随交付包附带测试数据
scripts/ tests/ docs/       启动、验证、架构与证据
CODEX_HANDOFF.md            本机接手入口
AGENTS.md                   不能丢的目标与边界
```

## 8. 接手

先读 `CODEX_HANDOFF.md`，再把 `docs/CODEX_PROMPT.md` 发给 Codex。当前任务是验证/修复本机连接，不是重造前端、改选框架或重新猜业务。完整测试证据见 `docs/验收报告.md`。
