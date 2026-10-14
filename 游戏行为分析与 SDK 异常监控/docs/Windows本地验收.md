# v0.8 Windows 本地验收

日期：2026-10-14（北京时间）。本次在原项目上完成本地验收与最小修复，保留六个原生 ESM 入口、Node HTTP、SQLite、原业务和历史贡献边界。数据库真实持久化，业务样本仍为 Mock；本次修复与测试不属于历史生产成果。

## 结果与环境

Windows 11（10.0.22621）、PowerShell 7.6.5、Node v24.14.1、npm 11.11.0、SQLite 3.51.2、Python 3.12.10、Playwright 1.64.0、本机 Edge 155.0.4283.45。

| 验证 | 本次结果 | 证据 |
|---|---|---|
| `npm run verify` | PASS，197/197，构建与doctor通过 | [最终日志](windows-acceptance/verify-final.txt) |
| `npm start` | PASS，真实127.0.0.1:4173服务 | [启动日志](windows-acceptance/start.txt) |
| `npm run test:browser` | PASS，18/18，真实Edge页面→HTTP→临时SQLite | [最终日志](windows-acceptance/browser-final.txt)、[结构化结果](local-browser/results.json) |
| 自动演示 | PASS，自动完成19/19站，关闭前后SQL工作区逐值及修订完全相等 | 同上，`autoplay.status=complete`、19条执行回执；[完成截图](local-browser/autoplay-complete.png) |
| Windows启动与备份恢复 | PASS，12/12，中文/空格路径及非项目cwd | [结构化结果](windows-acceptance/backup-launcher-results.json) |
| 主库检查与备份 | PASS，quick_check=ok，真实VACUUM INTO副本 | [数据库检查](windows-acceptance/database-final.txt)、[最终备份日志](windows-acceptance/backup-final.txt) |

浏览器验收使用随机端口和临时数据库，结束后停止测试服务。没有使用页面注入、模拟SQL传输或更改浏览器政策。额外启动器验收复制一致性备份到 `data/windows-acceptance/`，所有测试笔记仅写副本；主库工作区哈希、修订和表行数前后不变。

正常加载无未捕获脚本错误或CSP错误。控制台的两条 `net::ERR_FAILED` 与一条 HTTP 409 是主动断网、丢失响应和旧窗口冲突的验收证据，单独列在结果JSON中。主库保持12,923条行为记录、36,720条SDK计数样本、2活动/4奖品、8字段/1事件。

## 实际操作闭环

- SQL核对10台/25次；EBI事件分析→设备列表→SDK-DEMO-1-1002四条异常，缺少正常行为的模块仍留空。
- CRM正式保存与未提交草稿分开，刷新/服务重启后恢复；奖品A→B→A缓存、排序字段保留、跨应用卸载重挂；110%与空领奖规则拦截，70%可正式保存，不强制凑满100%。
- 日志嵌套字段树与列表/查询/详情三配置区分别保存，刷新后核对数量、顺序、文案与操作符；非法查询字段及空文案仍阻断。
- SDK图表选择排序、告警空原因拦截、处理中→完成、刷新重开；其他事件状态不串改。
- 复盘笔记与讲解卡保存刷新恢复，卡片间不串改。
- v0.7工作区先预览且不写库，再确认恢复；local/session逐键逐值与fixture完全一致，正式配置、编辑草稿和笔记各自回显。
- 请求未提交就截断时不提示已保存；服务器COMMIT后截断响应时仍不提示成功，沿原请求ID重试且SQL修订不重复递增。
- 两窗口同键修改返回409，旧窗口不覆盖新值；旧窗口的待写内容可以实际下载为工作区JSON，再刷新读取SQL的新版本。
- 六个独立ESM入口都通过HTTP启动；其余五入口额外检查单应用runtime及bootstrap/mount日志；CRM跨应用操作核对unmount/mount。
- 19站快速档全程自动推进，包含业务主线、技术调用和独立CRM分支，完成后关闭回到原工作区；SQL配置、草稿、笔记与修订完全不变。
- Windows脚本从其他cwd启动指定副本；真实SQLite文件头、quick_check、运行中一致性备份、重启笔记与令牌轮换、备份作为新REPLAY_DB打开均验证。

## 修复内容

| 文件 | 实际问题与修复 |
|---|---|
| `src/apps/crm/index.js`、`src/apps/report/index.js` | 复盘抽屉打开时，点击宿主SQL重试按钮使焦点离开业务root，原Escape事件收不到。将键盘监听绑定document，并在unmount清理，保留原关闭和焦点逻辑。浏览器断网重试场景验证Escape可关闭CRM抽屉。 |
| `start-windows.cmd` | `pause`覆盖Node启动失败退出码，非法PORT原返回0。暂停前保存退出码并最终返回；同一非法PORT用例现返回1。 |
| `tests/browser_local.py` | 启动页h1断言过时；字符串轮询被严格CSP拒绝。改为真实现有标题和箭头函数，未改CSP或放宽断言。补本地测试依赖路径、丢失ACK/同ID重试、抽屉关闭检查、错误记录、全19站回执与截图。 |
| `tests/browser_acceptance_checks.py` | 新增X00—X06真实UI/SQL验收，补齐四业务、讲解、六入口、v0.7逐条恢复和双窗冲突。SDK确认后SQLACK早于异步查询/绘制，测试自动等待精确卡片数量和顺序，原结果断言保留，没有固定sleep。 |
| `scripts/accept-backup-launcher.mjs` | 新增可复跑Windows脚本与一致性备份验收；仅创建新副本和停止自己启动的进程。 |

没有调整业务规则、框架、schema或运行依赖，没有删除/重置主库、SQL迁移或测试。原 `MANIFEST.sha256` 为交付包历史哈希；本次修改的源码哈希另存于 `windows-acceptance/source-sha256.json`。

## 数据保留与日后启动

接手时 `data/` 只有README与.gitkeep，没有已有数据库文件；doctor首次创建主库并装入种子。现主库为 `data/replay.sqlite`，所有测试业务写入隔离库。主库一致性备份已保留：

- `data/backups/replay-2026-10-14T04-06-33-861Z.sqlite`：首次初始化后备份，16,769,024字节，未被验收覆盖。
- `data/backups/replay-2026-10-14T04-20-57-105Z.sqlite`：最终主库备份。

以后双击项目根目录 `start-windows.cmd`，脚本自动构建、开库并请求默认浏览器打开 [本地页面](http://127.0.0.1:4173)。保留启动终端；Ctrl+C停止。也可在PowerShell执行 `npm start` 后手动打开同一地址。当前4173主服务已保留运行；已有服务运行时直接用页面，避免重复启动同一端口。

日常备份执行 `npm run db:backup`。服务重启后旧页面需要刷新以重新握手；有待写内容先导出再刷新。版本冲突同样先导出再合并，不自动覆盖他窗数据。恢复时保留原库，复制一致性备份为新的文件，再通过REPLAY_DB选择，不混用旧WAL/SHM。

复测：

```powershell
npm run verify
npm run test:browser
# 上面浏览器验收自行启停隔离服务。下面脚本需要4173主服务已运行：
node scripts/accept-backup-launcher.mjs
```

可选Python测试依赖已在本机 `data/test-tools`。换电脑可执行 `python -m pip install --target data/test-tools playwright`；正常启动无需Python。当前使用已安装Edge；其他浏览器可通过CHROMIUM_PATH指定已安装的可用Chromium系程序。

## 未验证与现有边界

本次Windows验收范围内没有剩余FAIL/BLOCKED。macOS、Safari、Firefox与其他Node版本未在本次测试，不沿用Windows结果。默认浏览器的自动弹窗仅记录 `OPEN_REQUESTED`，未单独控制/观测系统默认浏览器窗口；实际Windows Edge HTTP页面及可见的Codex内置浏览器已分别验证。主服务保留运行，测试服务均停止。

日志保留了首次标题、CSP测试驱动及异步绘制等待失败，见 `windows-acceptance/browser-initial.txt`、`browser-title-fixed.txt`、`browser-expanded-initial.txt`；最终结论以 `browser-final.txt` 和结果JSON为准。原交付环境的150个离线注入场景及Linux BLOCKED为历史证据，未计入本次18个真实浏览器场景。
