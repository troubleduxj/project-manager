---
sidebar_position: 2
---

# 部署指南

本指南介绍如何将文档系统部署到生产环境。

## 部署前准备

### 1. 构建生产版本

```bash
npm run build
```

构建完成后，静态文件会生成在 `build` 目录中。

### 2. 本地测试

在部署前，先在本地测试生产构建：

```bash
npm run serve
```

访问 [http://localhost:3000](http://localhost:3000) 确认一切正常。

## GitHub Actions 自动部署

推荐使用 GitHub Actions 实现自动化部署。

### 配置工作流

项目已经包含了 `.github/workflows/deploy.yml` 配置文件。

### 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下 secrets：
   - `SSH_PRIVATE_KEY`: 服务器 SSH 私钥
   - `REMOTE_HOST`: 服务器 IP 地址
   - `REMOTE_USER`: SSH 用户名

### 触发部署

只需将代码推送到 `main` 分支：

```bash
git add .
git commit -m "docs: 更新文档"
git push origin main
```

GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到服务器
5. 重启 Nginx

## 腾讯云服务器部署

### 服务器环境准备

#### 1. 安装 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

#### 2. 配置 Nginx

创建站点配置文件：

```bash
sudo nano /etc/nginx/sites-available/docs-web
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/docs-web;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. 配置 SSL 证书

使用 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

证书会自动配置到 Nginx 并定期续期。

### 创建部署目录

```bash
sudo mkdir -p /var/www/docs-web
sudo chown -R $USER:$USER /var/www/docs-web
```

### 配置 SSH 密钥

#### 在服务器上

```bash
# 生成密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions"

# 添加公钥到 authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 复制私钥内容
cat ~/.ssh/id_rsa
```

#### 在 GitHub 上

将私钥内容添加到 GitHub Secrets 的 `SSH_PRIVATE_KEY`。

## 手动部署

如果不使用自动部署，可以手动部署：

### 1. 本地构建

```bash
npm run build
```

### 2. 上传到服务器

使用 rsync 或 scp：

```bash
rsync -avz --delete build/ user@server:/var/www/docs-web/
```

或者：

```bash
scp -r build/* user@server:/var/www/docs-web/
```

### 3. 重启 Nginx

```bash
ssh user@server "sudo systemctl reload nginx"
```

## 其他部署选项

### GitHub Pages

```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 添加到 package.json
{
  "scripts": {
    "deploy": "docusaurus deploy"
  }
}

# 部署
GIT_USER=yourusername npm run deploy
```

### Vercel

1. 在 [Vercel](https://vercel.com) 注册账号
2. 导入 GitHub 仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`build`
5. 点击部署

### Netlify

1. 在 [Netlify](https://netlify.com) 注册账号
2. 连接 GitHub 仓库
3. 构建命令：`npm run build`
4. 发布目录：`build`
5. 部署

## 域名配置

### DNS 设置

在域名服务商处配置 DNS：

```
类型    主机记录    记录值
A       @          服务器IP地址
A       www        服务器IP地址
```

### 等待 DNS 生效

DNS 更改可能需要几分钟到48小时才能完全生效。

使用以下命令检查：

```bash
nslookup yourdomain.com
```

## 监控和维护

### 查看 Nginx 日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/access.log

# 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 检查服务状态

```bash
# Nginx 状态
sudo systemctl status nginx

# 重启 Nginx
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx
```

### 备份

定期备份文档和配置：

```bash
# 备份网站文件
tar -czf docs-backup-$(date +%Y%m%d).tar.gz /var/www/docs-web

# 备份 Nginx 配置
tar -czf nginx-config-$(date +%Y%m%d).tar.gz /etc/nginx
```

## 性能优化

### 1. 启用 Gzip 压缩

已在 Nginx 配置中启用。

### 2. CDN 加速

使用 CDN 加速静态资源访问。

### 3. 图片优化

- 使用 WebP 格式
- 压缩图片大小
- 使用适当的图片尺寸

### 4. 缓存策略

已在 Nginx 配置中设置静态资源缓存。

## 故障排查

### 部署失败

1. 检查 GitHub Actions 日志
2. 验证 Secrets 配置
3. 确认服务器 SSH 连接
4. 检查服务器磁盘空间

### 网站无法访问

1. 检查 Nginx 状态
2. 查看 Nginx 错误日志
3. 确认防火墙设置
4. 验证 DNS 配置

### SSL 证书问题

```bash
# 测试续期
sudo certbot renew --dry-run

# 强制续期
sudo certbot renew --force-renewal
```

## 安全建议

1. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. **配置防火墙**
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable
   ```

3. **限制 SSH 访问**
   - 禁用密码登录
   - 只允许特定 IP 访问

4. **定期备份**
   - 设置自动备份脚本
   - 保存多个备份版本

## 下一步

部署完成后：

- 📊 配置网站分析
- 🔍 提交网站到搜索引擎
- 📢 分享你的文档网站
- 🔄 持续更新和改进内容

