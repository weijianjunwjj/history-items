@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo 请先安装 Node.js 24，关闭并重新打开终端后再试。
 pause
 exit /b 1
)
node scripts\start.mjs --open
set "replay_exit_code=%errorlevel%"
pause
exit /b %replay_exit_code%
