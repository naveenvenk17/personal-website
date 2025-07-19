@echo off
echo 🎨 Wilson Brock Portfolio Website
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if index.html exists
if not exist "index.html" (
    echo ❌ index.html not found in the current directory
    echo Make sure you're running this from the portfolio website directory
    pause
    exit /b 1
)

echo 🚀 Starting local server...
echo 📁 Serving files from: %CD%
echo 🌐 Server will be available at: http://localhost:8000
echo 📱 Your browser should open automatically
echo ⏹️  Press Ctrl+C to stop the server
echo.

REM Start the Python server
python start-local.py

pause 