@echo off
chcp 65001 >nul
echo ====================================
echo   清理端口占用进程
echo ====================================
echo.

REM 定义要清理的端口
set FRONTEND_PORT=7076
set BACKEND_PORT=8080

echo [信息] 正在检查端口占用情况...
echo.

REM 检查并清理前端端口 7076
echo [检查] 前端端口 %FRONTEND_PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%FRONTEND_PORT%') do (
    set PID=%%a
    goto :kill_frontend
)
echo [OK] 端口 %FRONTEND_PORT% 未被占用
goto :check_backend

:kill_frontend
echo [发现] 端口 %FRONTEND_PORT% 被进程 %PID% 占用
taskkill /F /PID %PID% >nul 2>&1
if %errorlevel% equ 0 (
    echo [成功] 已终止进程 %PID%
) else (
    echo [警告] 无法终止进程 %PID% (可能需要管理员权限)
)

:check_backend
echo.
echo [检查] 后端端口 %BACKEND_PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%BACKEND_PORT%') do (
    set PID=%%a
    goto :kill_backend
)
echo [OK] 端口 %BACKEND_PORT% 未被占用
goto :done

:kill_backend
echo [发现] 端口 %BACKEND_PORT% 被进程 %PID% 占用
taskkill /F /PID %PID% >nul 2>&1
if %errorlevel% equ 0 (
    echo [成功] 已终止进程 %PID%
) else (
    echo [警告] 无法终止进程 %PID% (可能需要管理员权限)
)

:done
echo.
echo ====================================
echo [完成] 端口清理完成
echo ====================================
echo.
timeout /t 2 >nul

