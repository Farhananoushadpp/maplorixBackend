@echo off
echo Starting Maplorix Backend...
echo.
echo 1. Killing existing processes...
taskkill /IM node.exe /F 2>nul
echo.
echo 2. Starting server...
cd /d "%~dp0"
npm run dev
echo.
echo Backend is running on http://localhost:4000
echo Press Ctrl+C to stop
pause