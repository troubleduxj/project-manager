#!/bin/bash

echo "===================================="
echo "   清理端口占用进程"
echo "===================================="
echo

# 定义要清理的端口
FRONTEND_PORT=7076
BACKEND_PORT=8080

echo "[信息] 正在检查端口占用情况..."
echo

# 检查并清理前端端口 7076
echo "[检查] 前端端口 $FRONTEND_PORT..."
PID=$(lsof -ti:$FRONTEND_PORT)
if [ -n "$PID" ]; then
    echo "[发现] 端口 $FRONTEND_PORT 被进程 $PID 占用"
    kill -9 $PID 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[成功] 已终止进程 $PID"
    else
        echo "[警告] 无法终止进程 $PID (可能需要 sudo)"
    fi
else
    echo "[OK] 端口 $FRONTEND_PORT 未被占用"
fi

echo

# 检查并清理后端端口 8080
echo "[检查] 后端端口 $BACKEND_PORT..."
PID=$(lsof -ti:$BACKEND_PORT)
if [ -n "$PID" ]; then
    echo "[发现] 端口 $BACKEND_PORT 被进程 $PID 占用"
    kill -9 $PID 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[成功] 已终止进程 $PID"
    else
        echo "[警告] 无法终止进程 $PID (可能需要 sudo)"
    fi
else
    echo "[OK] 端口 $BACKEND_PORT 未被占用"
fi

echo
echo "===================================="
echo "[完成] 端口清理完成"
echo "===================================="
echo

sleep 2

