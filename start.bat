@echo off
chcp 65001 >nul
echo ====================================
echo    Project Management System Startup
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not available
    pause
    exit /b 1
)

echo [INFO] Node.js and npm check passed
echo.

REM Check and clean ports before starting
echo [INFO] Checking and cleaning ports...
echo.

REM Check frontend port 7076
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :7076 ^| findstr LISTENING') do (
    echo [WARNING] Port 7076 is occupied by process %%a
    echo [ACTION] Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo [SUCCESS] Process %%a terminated
    ) else (
        echo [WARNING] Cannot terminate process %%a
    )
    timeout /t 1 >nul
)

REM Check backend port 7080
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :7080 ^| findstr LISTENING') do (
    echo [WARNING] Port 7080 is occupied by process %%a
    echo [ACTION] Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo [SUCCESS] Process %%a terminated
    ) else (
        echo [WARNING] Cannot terminate process %%a
    )
    timeout /t 1 >nul
)

echo [INFO] Port check completed
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [WARNING] Dependencies not installed, installing...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if database exists
if not exist "server\database\project_management.db" (
    echo [INFO] Initializing database...
    call npm run setup
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize database
        pause
        exit /b 1
    )
    echo [SUCCESS] Database initialization completed
    echo.
)

echo [INFO] Starting Project Management System...
echo [INFO] Backend Service: http://localhost:7080
echo [INFO] Frontend Service: http://localhost:7076
echo [INFO] Project Management: http://localhost:7076/project-management
echo.
echo [TIP] Press Ctrl+C to stop services
echo ====================================
echo.

REM Start development servers (backend + frontend)
npm run dev

echo.
echo [INFO] Services stopped
pause