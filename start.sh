#!/bin/bash

echo "===================================="
echo "   项目管理与文档系统启动脚本"
echo "===================================="
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "[错误] Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查npm是否可用
if ! command -v npm &> /dev/null; then
    echo "[错误] npm 不可用"
    exit 1
fi

echo "[信息] Node.js 和 npm 检查通过"
echo

# 检查并清理端口
echo "[信息] 检查并清理端口..."
echo

# 检查前端端口 7076
FRONTEND_PID=$(lsof -ti:7076 2>/dev/null)
if [ -n "$FRONTEND_PID" ]; then
    echo "[警告] 端口 7076 被进程 $FRONTEND_PID 占用"
    echo "[操作] 正在终止进程 $FRONTEND_PID..."
    kill -9 $FRONTEND_PID 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[成功] 进程 $FRONTEND_PID 已终止"
    else
        echo "[警告] 无法终止进程 $FRONTEND_PID"
    fi
    sleep 1
fi

# 检查后端端口 7080
BACKEND_PID=$(lsof -ti:7080 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
    echo "[警告] 端口 7080 被进程 $BACKEND_PID 占用"
    echo "[操作] 正在终止进程 $BACKEND_PID..."
    kill -9 $BACKEND_PID 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[成功] 进程 $BACKEND_PID 已终止"
    else
        echo "[警告] 无法终止进程 $BACKEND_PID"
    fi
    sleep 1
fi

echo "[信息] 端口检查完成"
echo

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "[警告] 依赖未安装，正在安装..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[错误] 依赖安装失败"
        exit 1
    fi
fi

# 检查数据库是否存在
if [ ! -f "server/database/project_management.db" ]; then
    echo "[信息] 初始化数据库..."
    npm run setup
    if [ $? -ne 0 ]; then
        echo "[错误] 数据库初始化失败"
        exit 1
    fi
    echo "[成功] 数据库初始化完成"
    echo
fi

echo "[信息] 正在启动项目管理系统..."
echo "[信息] 后端服务: http://localhost:7080"
echo "[信息] 前端服务: http://localhost:7076"
echo "[信息] 项目管理: http://localhost:7076/project-management"
echo
echo "[提示] 按 Ctrl+C 停止服务"
echo "===================================="
echo

# 启动开发服务器（后端 + 前端）
npm run dev

echo
echo "[信息] 服务已停止"