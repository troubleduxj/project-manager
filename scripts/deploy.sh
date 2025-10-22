#!/bin/bash

# 项目管理系统部署脚本

set -e  # 遇到错误立即退出

# 配置
PROJECT_NAME="project-management"
PROJECT_DIR="/var/www/project-management"
BACKUP_DIR="/backup/project-management"
NODE_VERSION="18"

echo "🚀 开始部署项目管理系统..."

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用root权限运行此脚本"
    exit 1
fi

# 更新系统
echo "📦 更新系统包..."
apt update && apt upgrade -y

# 安装必要软件
echo "🔧 安装必要软件..."
apt install -y curl wget git nginx ufw

# 安装Node.js
echo "📦 安装Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs

# 验证安装
echo "✅ 验证安装..."
node --version
npm --version
nginx -v

# 创建项目目录
echo "📁 创建项目目录..."
mkdir -p $PROJECT_DIR
mkdir -p $BACKUP_DIR
mkdir -p /var/log/project-management

# 创建项目用户
echo "👤 创建项目用户..."
if ! id "pmuser" &>/dev/null; then
    useradd -r -s /bin/bash -d $PROJECT_DIR pmuser
fi

# 设置目录权限
chown -R pmuser:pmuser $PROJECT_DIR
chown -R pmuser:pmuser $BACKUP_DIR

# 安装PM2
echo "🔄 安装PM2..."
npm install -g pm2

# 配置防火墙
echo "🔒 配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 配置Nginx
echo "🌐 配置Nginx..."
if [ ! -f "/etc/nginx/sites-available/$PROJECT_NAME" ]; then
    cp nginx.conf.example /etc/nginx/sites-available/$PROJECT_NAME
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
fi

# 测试Nginx配置
nginx -t

# 创建systemd服务
echo "⚙️ 创建systemd服务..."
cat > /etc/systemd/system/$PROJECT_NAME.service << EOF
[Unit]
Description=Project Management System
After=network.target

[Service]
Type=simple
User=pmuser
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# 重新加载systemd
systemctl daemon-reload

# 创建备份定时任务
echo "⏰ 设置备份定时任务..."
cat > /etc/cron.d/$PROJECT_NAME-backup << EOF
# 每天凌晨2点备份项目管理系统数据
0 2 * * * pmuser $PROJECT_DIR/scripts/backup.sh >> /var/log/project-management/backup.log 2>&1
EOF

# 创建日志轮转配置
echo "📝 配置日志轮转..."
cat > /etc/logrotate.d/$PROJECT_NAME << EOF
/var/log/project-management/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 pmuser pmuser
}
EOF

echo "✅ 系统环境部署完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. 将项目代码复制到 $PROJECT_DIR"
echo "2. 切换到项目用户: sudo -u pmuser -i"
echo "3. 安装依赖: npm install"
echo "4. 初始化数据库: npm run init-db"
echo "5. 构建前端: npm run build"
echo "6. 启动服务: systemctl start $PROJECT_NAME"
echo "7. 启用开机自启: systemctl enable $PROJECT_NAME"
echo "8. 启动Nginx: systemctl start nginx && systemctl enable nginx"
echo ""
echo "🔧 配置文件位置："
echo "- Nginx配置: /etc/nginx/sites-available/$PROJECT_NAME"
echo "- 系统服务: /etc/systemd/system/$PROJECT_NAME.service"
echo "- 备份脚本: $PROJECT_DIR/scripts/backup.sh"
echo ""
echo "📊 管理命令："
echo "- 查看服务状态: systemctl status $PROJECT_NAME"
echo "- 查看日志: journalctl -u $PROJECT_NAME -f"
echo "- 重启服务: systemctl restart $PROJECT_NAME"
