# 本地数据

首次 `npm start` / `npm run doctor` 创建 `replay.sqlite`，并应用schema与固定种子。交付ZIP不附运行过的测试数据库或个人草稿。不要把此目录及备份提交到公开仓库。

在线一致性备份：`npm run db:backup`，输出到 `data/backups/`。使用SQLite VACUUM INTO，不是复制运行中的主文件。WAL模式下单复制replay.sqlite可能遗漏未checkpoint的提交。

恢复：停止服务，保留旧库，再用新的REPLAY_DB路径指向一致性备份副本启动。切勿把旧-wal/-shm混入另一个库。原生SQL备份包含所有样本和配置；UI工作区JSON只包含可携带配置/草稿/笔记，不含全部固定样本。

REPLAY_DB可以设为绝对路径或相对项目根目录路径；不要用云同步目录让多个进程/机器共享同一SQLite。
