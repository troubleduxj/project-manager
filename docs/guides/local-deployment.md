---
sidebar_position: 3
---

# 本地服务器部署指南

本指南介绍如何将文档系统部署到本地服务器（局域网环境）。

## 📋 适用场景

- 🏢 企业内网文档系统
- 💼 团队知识库
- 🔒 私有文档服务
- 🏠 家庭实验室
- 📚 离线文档查阅

## 🖥️ 服务器要求

### 最低配置
- **CPU**: 2核
- **内存**: 2GB
- **硬盘**: 20GB
- **操作系统**: Ubuntu 20.04/22.04 LTS、CentOS 7+、或 Windows Server

### 推荐配置
- **CPU**: 4核
- **内存**: 4GB
- **硬盘**: 50GB SSD
- **网络**: 千兆以太网

## 🚀 部署方式选择

### 方案 A: 静态文件部署（推荐）⭐⭐⭐⭐⭐

**优点：**
- ✅ 性能最好
- ✅ 维护简单
- ✅ 资源占用少
- ✅ 不需要 Node.js 环境

**流程：**
```
本地构建 → 上传静态文件 → Nginx 提供服务
```

### 方案 B: 开发服务器部署

**优点：**
- ✅ 支持热更新
- ✅ 适合开发测试

**缺点：**
- ⚠️ 性能较低
- ⚠️ 需要 Node.js 环境
- ⚠️ 不适合生产环境

---

## 📦 方案 A: 静态文件部署（推荐）

### 步骤 1: 准备服务器环境

#### Ubuntu/Debian 系统

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装 Nginx
sudo apt install nginx -y

# 3. 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 4. 检查状态
sudo systemctl status nginx
```

#### CentOS/RHEL 系统

```bash
# 1. 更新系统
sudo yum update -y

# 2. 安装 Nginx
sudo yum install epel-release -y
sudo yum install nginx -y

# 3. 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 4. 配置防火墙
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

#### Windows Server

```powershell
# 1. 下载 Nginx for Windows
# 访问：https://nginx.org/en/download.html

# 2. 解压到 C:\nginx

# 3. 启动 Nginx
cd C:\nginx
start nginx.exe

# 4. 检查是否运行
# 访问 http://localhost
```

### 步骤 2: 在本地构建项目

在你的开发机器上：

```bash
# 1. 进入项目目录
cd D:\Cursor_Project\docs-web

# 2. 安装依赖（如果还没安装）
npm install

# 3. 构建生产版本
npm run build

# 构建完成后，build 目录包含所有静态文件
```

### 步骤 3: 上传文件到服务器

#### 方法 1: 使用 SCP（推荐）

```bash
# 从 Windows 上传到 Linux 服务器
# 使用 PowerShell 或 Git Bash

scp -r build/* user@192.168.1.100:/var/www/docs-web/

# 或使用 rsync（更高效）
rsync -avz --delete build/ user@192.168.1.100:/var/www/docs-web/
```

#### 方法 2: 使用 WinSCP（Windows 图形界面）

1. 下载 WinSCP：https://winscp.net/
2. 连接到服务器
3. 将 `build` 目录内容复制到 `/var/www/docs-web/`

#### 方法 3: 使用共享文件夹（局域网）

```bash
# 在服务器上挂载 Windows 共享
sudo mount -t cifs //192.168.1.10/share /mnt/share -o username=youruser

# 复制文件
sudo cp -r /mnt/share/build/* /var/www/docs-web/
```

#### 方法 4: 使用 Git（自动化）

```bash
# 在服务器上直接从 GitHub 拉取
cd /tmp
git clone https://github.com/troubleduxj/DOCS-WEB.git
cd DOCS-WEB
npm install
npm run build
sudo cp -r build/* /var/www/docs-web/
```

### 步骤 4: 配置 Nginx

#### 创建网站配置文件

```bash
sudo nano /etc/nginx/sites-available/docs-web
```

添加以下内容：

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # 内网 IP 或域名
    server_name 192.168.1.100 docs.local.com;
    
    # 网站根目录
    root /var/www/docs-web;
    index index.html;
    
    # 访问日志
    access_log /var/log/nginx/docs-web-access.log;
    error_log /var/log/nginx/docs-web-error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml;
    
    # 主路由
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

#### 启用站点配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 步骤 5: 设置文件权限

```bash
# 创建目录（如果不存在）
sudo mkdir -p /var/www/docs-web

# 设置所有者
sudo chown -R www-data:www-data /var/www/docs-web

# 设置权限
sudo chmod -R 755 /var/www/docs-web
```

### 步骤 6: 配置防火墙

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 步骤 7: 测试访问

```bash
# 在服务器上测试
curl http://localhost

# 在其他机器上测试
# 访问 http://192.168.1.100
```

---

## 🔄 方案 B: 开发服务器部署

### 步骤 1: 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# 验证安装
node --version
npm --version
```

### 步骤 2: 部署项目

```bash
# 1. 克隆项目
cd /opt
sudo git clone https://github.com/troubleduxj/DOCS-WEB.git
cd DOCS-WEB

# 2. 安装依赖
sudo npm install

# 3. 构建项目
sudo npm run build
```

### 步骤 3: 使用 PM2 管理进程

```bash
# 1. 安装 PM2
sudo npm install -g pm2

# 2. 启动服务
pm2 start npm --name "docs-web" -- run serve

# 3. 设置开机自启
pm2 startup
pm2 save

# 4. 查看状态
pm2 status
pm2 logs docs-web
```

### 步骤 4: 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name 192.168.1.100;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🌐 内网域名配置

### 方案 1: 修改 hosts 文件

**Windows 客户端**
```
# 编辑 C:\Windows\System32\drivers\etc\hosts
192.168.1.100    docs.local.com
```

**Linux/Mac 客户端**
```bash
# 编辑 /etc/hosts
sudo nano /etc/hosts
192.168.1.100    docs.local.com
```

### 方案 2: 配置内网 DNS 服务器

#### 使用 dnsmasq（简单）

```bash
# 安装 dnsmasq
sudo apt install dnsmasq -y

# 配置
sudo nano /etc/dnsmasq.conf

# 添加
address=/docs.local.com/192.168.1.100

# 重启服务
sudo systemctl restart dnsmasq
```

#### 使用 BIND（企业级）

```bash
# 安装 BIND
sudo apt install bind9 -y

# 配置区域文件
sudo nano /etc/bind/named.conf.local

# 添加区域配置
zone "local.com" {
    type master;
    file "/etc/bind/db.local.com";
};

# 创建区域文件
sudo nano /etc/bind/db.local.com
```

---

## 🔄 自动更新部署

### 创建更新脚本

```bash
sudo nano /opt/update-docs.sh
```

添加以下内容：

```bash
#!/bin/bash

# 更新文档网站脚本
# 保存路径: /opt/update-docs.sh

set -e

echo "======================================"
echo "开始更新文档网站"
echo "======================================"

# 配置
REPO_DIR="/tmp/DOCS-WEB"
WEB_DIR="/var/www/docs-web"
GITHUB_REPO="https://github.com/troubleduxj/DOCS-WEB.git"
BACKUP_DIR="/backup/docs-web"

# 创建备份
echo "备份当前版本..."
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/docs-web-$DATE.tar.gz -C /var/www docs-web

# 清理临时目录
if [ -d "$REPO_DIR" ]; then
    rm -rf $REPO_DIR
fi

# 克隆最新代码
echo "从 GitHub 拉取最新代码..."
git clone $GITHUB_REPO $REPO_DIR
cd $REPO_DIR

# 安装依赖
echo "安装依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

# 停止旧服务（如果使用 PM2）
# pm2 stop docs-web

# 部署新版本
echo "部署新版本..."
sudo rm -rf $WEB_DIR/*
sudo cp -r build/* $WEB_DIR/

# 设置权限
sudo chown -R www-data:www-data $WEB_DIR
sudo chmod -R 755 $WEB_DIR

# 重启 Nginx
echo "重启 Nginx..."
sudo systemctl reload nginx

# 清理
rm -rf $REPO_DIR

echo "======================================"
echo "更新完成！"
echo "备份文件: $BACKUP_DIR/docs-web-$DATE.tar.gz"
echo "======================================"
```

设置执行权限：

```bash
sudo chmod +x /opt/update-docs.sh
```

### 手动更新

```bash
sudo /opt/update-docs.sh
```

### 定时自动更新

```bash
# 编辑 crontab
sudo crontab -e

# 每天凌晨 3 点自动更新
0 3 * * * /opt/update-docs.sh >> /var/log/docs-update.log 2>&1
```

### 使用 Webhook 自动更新

创建 webhook 脚本：

```bash
sudo nano /opt/webhook-deploy.sh
```

```bash
#!/bin/bash

# 接收 GitHub webhook 触发部署

cd /opt
git pull origin main
npm install
npm run build
sudo cp -r build/* /var/www/docs-web/
sudo systemctl reload nginx
```

---

## 🔒 访问控制

### 方案 1: IP 白名单

在 Nginx 配置中添加：

```nginx
server {
    listen 80;
    server_name 192.168.1.100;
    
    # 只允许特定 IP 段访问
    allow 192.168.1.0/24;    # 允许局域网
    allow 10.0.0.0/8;        # 允许内网
    deny all;                 # 拒绝其他
    
    root /var/www/docs-web;
    # ...其他配置
}
```

### 方案 2: 用户名密码认证

```bash
# 1. 安装工具
sudo apt install apache2-utils -y

# 2. 创建密码文件
sudo htpasswd -c /etc/nginx/.htpasswd admin

# 3. 添加更多用户
sudo htpasswd /etc/nginx/.htpasswd user2
```

在 Nginx 配置中添加：

```nginx
server {
    listen 80;
    server_name 192.168.1.100;
    
    # 基本认证
    auth_basic "文档系统";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    root /var/www/docs-web;
    # ...其他配置
}
```

### 方案 3: LDAP/AD 域认证

```bash
# 安装 LDAP 模块
sudo apt install libnginx-mod-http-auth-ldap -y
```

配置示例：

```nginx
http {
    ldap_server ad_server {
        url ldap://ad.company.com/DC=company,DC=com?sAMAccountName?sub?(objectClass=person);
        binddn "CN=nginx,OU=Service Accounts,DC=company,DC=com";
        binddn_passwd "password";
        group_attribute member;
        group_attribute_is_dn on;
        require valid_user;
    }
}

server {
    location / {
        auth_ldap "请登录";
        auth_ldap_servers ad_server;
    }
}
```

---

## 📊 监控和维护

### 查看访问日志

```bash
# 实时查看访问日志
sudo tail -f /var/log/nginx/docs-web-access.log

# 统计访问量
sudo cat /var/log/nginx/docs-web-access.log | wc -l

# 查看最常访问的页面
sudo cat /var/log/nginx/docs-web-access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10
```

### 性能监控

```bash
# 安装监控工具
sudo apt install htop iotop -y

# 查看系统资源
htop

# 查看磁盘 IO
sudo iotop

# 查看网络连接
sudo netstat -tulpn | grep nginx
```

### 定期维护任务

创建维护脚本：

```bash
sudo nano /opt/maintenance.sh
```

```bash
#!/bin/bash

# 清理旧日志（保留 30 天）
find /var/log/nginx/ -name "*.log" -mtime +30 -delete

# 清理旧备份（保留 7 天）
find /backup/docs-web/ -name "*.tar.gz" -mtime +7 -delete

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "警告：磁盘使用率超过 80%: $DISK_USAGE%"
fi

# 检查 Nginx 状态
if ! systemctl is-active --quiet nginx; then
    echo "警告：Nginx 未运行！"
    sudo systemctl restart nginx
fi

echo "维护任务完成: $(date)"
```

---

## 🆘 常见问题

### 1. 无法访问网站

**检查步骤：**

```bash
# 1. 检查 Nginx 是否运行
sudo systemctl status nginx

# 2. 检查端口是否监听
sudo netstat -tulpn | grep :80

# 3. 检查防火墙
sudo ufw status
sudo iptables -L

# 4. 检查文件权限
ls -la /var/www/docs-web/

# 5. 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 2. 页面显示不正常

```bash
# 检查静态资源路径
# 确保 build 目录内容完整复制

# 清除浏览器缓存
# Ctrl + F5 强制刷新

# 检查 Nginx 配置
sudo nginx -t
```

### 3. 构建失败

```bash
# 清除缓存重新构建
npm run clear
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. 权限错误

```bash
# 重新设置权限
sudo chown -R www-data:www-data /var/www/docs-web
sudo chmod -R 755 /var/www/docs-web
```

### 5. 内存不足

```bash
# 增加交换空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久生效
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📈 性能优化

### 1. 启用 HTTP/2

在 Nginx 配置中：

```nginx
server {
    listen 443 ssl http2;
    # ...
}
```

### 2. 配置浏览器缓存

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 启用 Gzip 压缩

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 4. 使用 CDN（可选）

对于静态资源，可以使用内网 CDN 或反向代理缓存。

---

## 🔐 HTTPS 配置（内网）

### 使用自签名证书

```bash
# 1. 生成私钥
sudo openssl genrsa -out /etc/nginx/ssl/docs-web.key 2048

# 2. 生成证书
sudo openssl req -new -x509 -key /etc/nginx/ssl/docs-web.key -out /etc/nginx/ssl/docs-web.crt -days 365

# 3. Nginx 配置
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/docs-web.crt;
    ssl_certificate_key /etc/nginx/ssl/docs-web.key;
    # ...
}
```

### 使用内网 CA 证书

如果公司有内网 CA，使用其签发的证书更好。

---

## 📝 部署检查清单

### 初次部署
- [ ] 服务器环境准备完成
- [ ] Nginx 安装并运行
- [ ] 项目构建成功
- [ ] 文件上传到服务器
- [ ] Nginx 配置正确
- [ ] 文件权限设置正确
- [ ] 防火墙规则配置
- [ ] 内网可以访问

### 日常维护
- [ ] 定期更新文档
- [ ] 查看访问日志
- [ ] 监控系统资源
- [ ] 定期备份
- [ ] 更新依赖版本

### 安全检查
- [ ] 配置访问控制
- [ ] 启用 HTTPS（推荐）
- [ ] 定期更新系统
- [ ] 查看安全日志

---

## 💡 最佳实践

1. **使用版本控制**
   - 所有配置文件纳入 Git 管理
   - 使用 tag 标记版本

2. **自动化部署**
   - 编写部署脚本
   - 使用 CI/CD 工具

3. **监控告警**
   - 配置服务监控
   - 设置告警通知

4. **定期备份**
   - 自动备份脚本
   - 异地备份存储

5. **文档化**
   - 记录部署步骤
   - 记录故障处理

---

## 🔗 相关资源

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)

---

**🎉 恭喜！你的文档系统已成功部署到本地服务器！**

如有问题，请参考故障排查部分或提交 Issue。

