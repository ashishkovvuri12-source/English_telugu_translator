@echo off
title TeluguTranslate AI - Frontend Development Server
echo ========================================================
echo  Starting TeluguTranslate AI - React Vite Frontend
echo ========================================================
cd /d "%~dp0frontend"
echo Installing / checking Node dependencies...
call npm install
echo.
echo Starting Vite Dev Server and opening in your default browser...
echo (Website will open automatically at http://localhost:5173)
echo.
call npm run dev -- --open
pause
