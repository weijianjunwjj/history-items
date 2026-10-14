@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where node.exe >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有找到 Node.js，请先安装 Node.js 22.16+（建议 24）。
  echo 安装后请关闭旧终端再双击本脚本。
  pause
  exit /b 1
)
echo [友谊时光] 正在检测服务，稍后会自动打开浏览器...
node "%~dp0scripts\start.mjs" --open
set "EXIT_CODE=%errorlevel%"
if not "%EXIT_CODE%"=="0" (
  echo.
  echo 启动失败。请保留此窗口的错误信息用于排查。
  pause
)
exit /b %EXIT_CODE%
