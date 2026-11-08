@echo off
title TeluguTranslate AI - Complete Launcher
echo ========================================================
echo         Launching TeluguTranslate AI Website
echo ========================================================
echo.
echo 1. Opening TeluguTranslate AI in your default browser...
start "" "%~dp0open_website.html"
echo.
echo 2. Starting Flask Backend Server (Port 5000)...
start "TeluguTranslate AI Backend" run_backend.bat
echo.
echo 3. Starting React Vite Frontend Server (Port 5173)...
start "TeluguTranslate AI Frontend" run_frontend.bat
echo.
echo ========================================================
echo Both servers have been launched in separate windows!
echo Your website is now running at:
echo   - Local HTML View: open_website.html
echo   - Vite React Dev:  http://localhost:5173
echo   - Flask Backend:   http://127.0.0.1:5000
echo ========================================================
echo Keep the server windows open while testing.
pause
