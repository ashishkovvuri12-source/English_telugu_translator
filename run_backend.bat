@echo off
title TeluguTranslate AI - Backend Server
echo ========================================================
echo  Starting TeluguTranslate AI - Flask Backend
echo ========================================================
cd /d "%~dp0backend"

:: Detect working Python launcher on Windows
set PY_CMD=

:: Check specific Anaconda Python paths
if exist "C:\Users\ashis\anaconda3\Anacondas\python.exe" (
    set PY_CMD="C:\Users\ashis\anaconda3\Anacondas\python.exe"
) else if exist "%USERPROFILE%\anaconda3\python.exe" (
    set PY_CMD="%USERPROFILE%\anaconda3\python.exe"
) else if exist "%USERPROFILE%\anaconda3\Anacondas\python.exe" (
    set PY_CMD="%USERPROFILE%\anaconda3\Anacondas\python.exe"
) else (
    python --version >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        set PY_CMD=python
    ) else (
        py -3 --version >nul 2>&1
        if %ERRORLEVEL% equ 0 (
            set PY_CMD=py -3
        ) else (
            py --version >nul 2>&1
            if %ERRORLEVEL% equ 0 (
                set PY_CMD=py
            )
        )
    )
)

if "%PY_CMD%"=="" (
    echo.
    echo [ERROR] Python was not found in system PATH or standard folders!
    echo Please install Python from https://www.python.org/downloads/
    echo and check "Add Python to PATH".
    echo.
    pause
    exit /b 1
)

echo Using Python launcher: %PY_CMD%
echo.
echo Installing / checking Python dependencies (flask-cors, flask, gunicorn)...
%PY_CMD% -m pip install flask flask-cors gunicorn
echo.
echo Starting Flask Server on http://127.0.0.1:5000...
echo.
%PY_CMD% app.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Flask server stopped.
    pause
)
