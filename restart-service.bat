@echo off
echo ========================================
echo   重启后端服务
echo ========================================
echo.

echo [1/2] 停止旧的后端服务...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *" >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ 旧服务已停止
echo.

echo [2/2] 启动新服务...
echo.
echo 正在启动服务，请稍候...
echo.
start cmd /k "npm run dev"
echo.

timeout /t 3 /nobreak >nul

echo ========================================
echo   ✅ 服务重启完成！
echo ========================================
echo.
echo 📝 新窗口已打开，服务正在启动...
echo 💡 等待服务完全启动后（约10-15秒）
echo 💡 然后访问: http://localhost:7076
echo.
echo 🔑 登录信息:
echo    管理员: admin / admin123
echo    客户:   client / client123
echo.
pause

