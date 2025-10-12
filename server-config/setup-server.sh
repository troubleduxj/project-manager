#!/bin/bash
#
# 服务器环境初始化脚本
# 这个脚本用于快速配置腾讯云服务器环境
#
# 使用方法:
# 1. SSH 连接到服务器
# 2. 下载脚本: wget https://raw.githubusercontent.com/yourusername/docs-web/main/server-config/setup-server.sh
# 3. 添加执行权限: chmod +x setup-server.sh
# 4. 运行脚本: sudo ./setup-server.sh
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数定义
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    log_error "请使用 root 权限运行此脚本"
    exit 1
fi

log_info "======================================"
log_info "开始配置服务器环境"
log_info "======================================"

# 1. 更新系统
log_info "更新系统软件包..."
apt update && apt upgrade -y

# 2. 安装基础工具
log_info "安装基础工具..."
apt install -y curl wget git vim ufw htop

# 3. 安装 Nginx
log_info "安装 Nginx..."
apt install -y nginx

# 4. 安装 Node.js（可选，用于本地构建）
log_info "安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 5. 创建网站目录
log_info "创建网站目录..."
mkdir -p /var/www/docs-web
mkdir -p /var/www/docs-web-dev
mkdir -p /var/log/nginx/docs-web

# 设置权限
chown -R www-data:www-data /var/www/docs-web
chown -R www-data:www-data /var/www/docs-web-dev
chmod -R 755 /var/www/docs-web
chmod -R 755 /var/www/docs-web-dev

# 6. 创建备份和脚本目录
log_info "创建备份和脚本目录..."
mkdir -p /backup/docs-web
mkdir -p /root/scripts

# 7. 配置防火墙
log_info "配置防火墙..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8080/tcp  # 内网访问（可选）

log_warn "防火墙规则已设置但未启用"
log_warn "请确认 SSH 可以访问后，手动运行: ufw enable"

# 8. 配置 Nginx
log_info "配置 Nginx..."
systemctl enable nginx
systemctl start nginx

# 9. 安装 Certbot（SSL 证书）
log_info "安装 Certbot..."
apt install -y certbot python3-certbot-nginx

# 10. 创建测试页面
log_info "创建测试页面..."
cat > /var/www/docs-web/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>文档系统 - 准备中</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; }
    </style>
</head>
<body>
    <h1>🚀 文档系统正在准备中</h1>
    <p>服务器环境配置完成！</p>
    <p>请完成以下步骤:</p>
    <ul style="list-style: none; padding: 0;">
        <li>1. 配置 Nginx 站点</li>
        <li>2. 设置 DNS 解析</li>
        <li>3. 配置 SSL 证书</li>
        <li>4. 部署文档系统</li>
    </ul>
</body>
</html>
EOF

# 11. 验证安装
log_info "======================================"
log_info "验证安装..."
log_info "======================================"

# 检查 Nginx
if systemctl is-active --quiet nginx; then
    log_info "✅ Nginx 服务运行正常"
    nginx -v
else
    log_error "❌ Nginx 服务未运行"
fi

# 检查 Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_info "✅ Node.js 已安装: $NODE_VERSION"
else
    log_warn "⚠️  Node.js 未安装"
fi

# 检查 npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_info "✅ npm 已安装: $NPM_VERSION"
else
    log_warn "⚠️  npm 未安装"
fi

# 检查 Certbot
if command -v certbot &> /dev/null; then
    log_info "✅ Certbot 已安装"
else
    log_warn "⚠️  Certbot 未安装"
fi

# 12. 显示后续步骤
log_info "======================================"
log_info "服务器环境配置完成！"
log_info "======================================"

cat << 'EOF'

📋 后续步骤:

1. 配置 Nginx 站点
   sudo nano /etc/nginx/sites-available/docs-web
   sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx

2. 配置 DNS 解析
   在域名服务商处添加 A 记录指向服务器 IP

3. 配置 SSL 证书
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

4. 配置 SSH 密钥认证
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/id_rsa  # 复制私钥到 GitHub Secrets

5. 启用防火墙
   sudo ufw enable

6. 测试网站访问
   curl http://localhost
   
7. 配置 GitHub Actions
   在 GitHub 仓库设置中添加 Secrets:
   - SSH_PRIVATE_KEY
   - REMOTE_HOST
   - REMOTE_USER

EOF

log_info "查看服务器 IP 地址:"
ip addr show | grep "inet " | grep -v 127.0.0.1

log_info "======================================"
log_info "安装完成！"
log_info "======================================"

