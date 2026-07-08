@echo off
cd /d "%~dp0"
echo Starting MotionGraphic Studio...
start http://localhost:3000
npm run dev
pause
