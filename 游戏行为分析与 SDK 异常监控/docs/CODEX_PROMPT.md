请接手当前目录的 youyi-replay-local v0.8，不要重建项目。

这是魏建军根据友谊时光历史开发记录制作的个人复盘系统。ChatGPT已完成四组业务、六个原生ESM微前端入口、Node HTTP + SQLite、工作区持久化、19站隔离自动演示及测试。主要目的是自己操作找回工作细节，面试讲解是其次。

先依次阅读 AGENTS.md、README.md、CODEX_HANDOFF.md、docs/验收报告.md、docs/本地架构与SQL.md。原环境Node/SQL/HTTP测试已执行，但受管浏览器拦截localhost，真实Windows UI→HTTP→SQLite与CSP/srcdoc尚待本机验证。

请实际运行 npm run verify、npm start、npm run test:browser，并按交接文档完成刷新/进程重启持久化、CRM保存与草稿分离、日志三套配置、统一主线10台/25次→同设备4条、备份恢复、断线/冲突不假报成功、独立入口、19站自动演示不污染SQL。

只修本地运行或验收发现的真实问题；保留原交互、SQL和测试，不换Vue/React/single-spa、不加ORM/MySQL/Docker、不删除数据库或测试来制造通过。已有用户数据先备份。工具环境拦截则记录BLOCKED，不绕管理员政策。

完成后交付实际命令/版本/日志/修改文件和未解决项，不只给计划，也不要把注入页面回归冒充SQL浏览器联调通过。
