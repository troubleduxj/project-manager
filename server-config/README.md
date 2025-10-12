# 服务器配置文件说明

这个目录包含了部署文档系统所需的所有服务器配置文件和脚本。

## 📁 文件清单

### Nginx 配置文件

1. **nginx-docs-web.conf** - 生产环境配置
   - 支持 HTTP 到 HTTPS 重定向
   - SSL/TLS 配置
   - Gzip 压缩
   - 静态资源缓存
   - 安全头配置
   - 内网访问配置

2. **nginx-docs-web-dev.conf** - 开发环境配置
   - HTTP 访问
   - 可选的基本认证保护

### 运维脚本

3. **backup-docs.sh** - 自动备份脚本
   - 自动备份网站文件
   - 自动备份 Nginx 配置
   - 自动清理旧备份
   - 磁盘空间监控

4. **monitor.sh** - 监控脚本
   - Nginx 服务监控
   - 网站可访问性检查
   - 磁盘空间监控
   - 内存和 CPU 监控
   - SSL 证书过期检查

5. **setup-server.sh** - 服务器初始化脚本
   - 一键安装所有必要软件
   - 创建目录结构
   - 配置防火墙
   - 安装 SSL 证书工具

## 🚀 使用指南

### 1. 服务器初始化

首次配置服务器时，运行初始化脚本：

```bash
# 下载脚本
wget https://raw.githubusercontent.com/yourusername/docs-web/main/server-config/setup-server.sh

# 添加执行权限
chmod +x setup-server.sh

# 运行脚本（需要 root 权限）
sudo ./setup-server.sh
```

### 2. 配置 Nginx

#### 生产环境

```bash
# 复制配置文件
sudo cp nginx-docs-web.conf /etc/nginx/sites-available/docs-web

# 修改配置文件中的域名
sudo nano /etc/nginx/sites-available/docs-web
# 将 yourdomain.com 替换为你的实际域名

# 启用站点
sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

#### 开发环境

```bash
# 复制配置文件
sudo cp nginx-docs-web-dev.conf /etc/nginx/sites-available/docs-web-dev

# 修改配置
sudo nano /etc/nginx/sites-available/docs-web-dev

# 启用站点
sudo ln -s /etc/nginx/sites-available/docs-web-dev /etc/nginx/sites-enabled/

# 重新加载
sudo systemctl reload nginx
```

### 3. 配置 SSL 证书

```bash
# 安装 Certbot（如果初始化脚本已运行，可跳过）
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 测试自动续期
sudo certbot renew --dry-run
```

### 4. 设置自动备份

```bash
# 复制备份脚本
sudo cp backup-docs.sh /root/scripts/

# 添加执行权限
sudo chmod +x /root/scripts/backup-docs.sh

# 测试运行
sudo /root/scripts/backup-docs.sh

# 添加到 crontab（每天凌晨 2 点执行）
sudo crontab -e
# 添加以下行：
0 2 * * * /root/scripts/backup-docs.sh
```

### 5. 设置监控

```bash
# 复制监控脚本
sudo cp monitor.sh /root/scripts/

# 添加执行权限
sudo chmod +x /root/scripts/monitor.sh

# 修改配置（域名、邮箱等）
sudo nano /root/scripts/monitor.sh

# 测试运行
sudo /root/scripts/monitor.sh

# 添加到 crontab（每 5 分钟执行一次）
sudo crontab -e
# 添加以下行：
*/5 * * * * /root/scripts/monitor.sh
```

## 🔧 配置项说明

### Nginx 配置重点

1. **域名配置**
   ```nginx
   server_name yourdomain.com www.yourdomain.com;
   ```

2. **SSL 证书路径**
   ```nginx
   ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   ```

3. **网站根目录**
   ```nginx
   root /var/www/docs-web;
   ```

4. **内网 IP**（如果需要内网访问）
   ```nginx
   server_name 192.168.x.x;  # 替换为实际内网 IP
   ```

### 备份脚本配置

编辑 `/root/scripts/backup-docs.sh`：

```bash
BACKUP_DIR="/backup/docs-web"      # 备份目录
SOURCE_DIR="/var/www/docs-web"     # 网站目录
RETENTION_DAYS=7                   # 保留天数
```

### 监控脚本配置

编辑 `/root/scripts/monitor.sh`：

```bash
WEBSITE_URL="https://yourdomain.com"     # 网站 URL
ALERT_EMAIL="your-email@example.com"     # 告警邮箱
```

## 📊 日志位置

- Nginx 访问日志：`/var/log/nginx/docs-web/access.log`
- Nginx 错误日志：`/var/log/nginx/docs-web/error.log`
- 备份日志：`/var/log/backup-docs.log`
- 监控日志：`/var/log/monitor-docs.log`

## 🔒 安全建议

1. **配置防火墙**
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw enable
   ```

2. **禁用密码登录，使用 SSH 密钥**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # 设置 PasswordAuthentication no
   sudo systemctl restart sshd
   ```

3. **安装 fail2ban**
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

## 🆘 故障排查

### Nginx 无法启动

```bash
# 检查配置语法
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 检查端口占用
sudo netstat -tulpn | grep :80
```

### SSL 证书问题

```bash
# 查看证书状态
sudo certbot certificates

# 手动续期
sudo certbot renew --force-renewal

# 查看 Certbot 日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### 网站 403 错误

```bash
# 检查文件权限
ls -la /var/www/docs-web

# 修复权限
sudo chown -R www-data:www-data /var/www/docs-web
sudo chmod -R 755 /var/www/docs-web
```

## 📚 相关文档

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Let's Encrypt 文档](https://letsencrypt.org/docs/)
- [UFW 防火墙指南](https://help.ubuntu.com/community/UFW)

## 🤝 支持

如有问题，请：
- 查看项目主 README.md
- 提交 GitHub Issue
- 联系技术支持

