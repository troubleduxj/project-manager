# 🚀 快速启动指南

这是一份简明的快速启动指南，帮助你立即开始使用本文档系统。

## 📋 立即开始

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000)

### 2. 构建生产版本

```bash
# 构建
npm run build

# 预览
npm run serve
```

## 📝 编写文档

### 创建新文档

1. 在 `docs/` 目录下创建 `.md` 文件
2. 添加 Front Matter：

```markdown
---
sidebar_position: 1
title: 我的文档
---

# 文档内容
```

### 添加图片

将图片放在 `static/img/` 目录：

```markdown
![描述](/img/your-image.png)
```

## 🔧 配置

### 修改网站信息

编辑 `docusaurus.config.js`：

```javascript
title: '你的站点名称',
url: 'https://yourdomain.com',
```

### 修改侧边栏

编辑 `sidebars.js` 添加或删除文档链接。

## 🚢 部署到服务器

### 准备工作

1. **准备服务器**（Ubuntu 20.04+）
2. **配置域名** DNS 解析到服务器 IP
3. **准备 GitHub 仓库**

### 服务器配置

```bash
# 1. 上传并运行初始化脚本
scp server-config/setup-server.sh user@your-server:/root/
ssh user@your-server
sudo bash /root/setup-server.sh

# 2. 配置 Nginx
sudo cp /path/to/server-config/nginx-docs-web.conf /etc/nginx/sites-available/docs-web
sudo nano /etc/nginx/sites-available/docs-web  # 修改域名
sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 3. 配置 SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 4. 生成 SSH 密钥用于 GitHub Actions
ssh-keygen -t rsa -b 4096 -C "github-actions"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa  # 复制私钥
```

### GitHub 配置

1. 创建 GitHub 仓库
2. 在仓库 Settings → Secrets 添加：
   - `SSH_PRIVATE_KEY`: 服务器 SSH 私钥（完整内容）
   - `REMOTE_HOST`: 服务器 IP
   - `REMOTE_USER`: SSH 用户名（通常是 root）

### 推送代码

```bash
# 添加远程仓库（已完成）
# git remote add origin https://github.com/troubleduxj/DOCS-WEB.git

# 推送到 GitHub（已完成）
# git push -u origin main
```

推送后，GitHub Actions 会自动构建并部署到服务器！

## 📊 日常工作流

### 编写新文档

```bash
# 1. 创建分支
git checkout -b docs/new-feature

# 2. 编写文档
# 修改 docs/ 下的文件

# 3. 本地预览
npm start

# 4. 提交
git add .
git commit -m "docs: 添加新功能文档"

# 5. 合并到 main 分支（会自动部署）
git checkout main
git merge docs/new-feature
git push origin main
```

### 更新线上内容

只需推送到 `main` 分支，GitHub Actions 会自动部署：

```bash
git add .
git commit -m "docs: 更新文档"
git push origin main
```

## ⚙️ 常用命令

```bash
npm start              # 开发服务器
npm run build          # 构建
npm run serve          # 预览构建结果
npm run clear          # 清除缓存
```

## 🆘 常见问题

### 构建失败？

```bash
npm run clear
rm -rf node_modules package-lock.json
npm install
```

### 部署失败？

1. 检查 GitHub Actions 日志
2. 验证 GitHub Secrets 配置
3. 测试服务器 SSH 连接：`ssh user@server-ip`

### 网站访问不了？

```bash
# 在服务器上检查
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## 📚 更多文档

- 📖 [完整 README](./README.md)
- 📖 [设计方案](./design.md)
- 📖 [服务器配置说明](./server-config/README.md)

## 🎯 下一步

1. ✅ 修改 `docusaurus.config.js` 中的网站信息
2. ✅ 在 `docs/` 目录下编写文档
3. ✅ 配置服务器和域名
4. ✅ 设置 GitHub Actions 自动部署
5. ✅ 开始使用！

---

**💡 提示**：建议先在本地完整测试后再部署到服务器。

**❓ 需要帮助**：查看 [GitHub Issues](https://github.com/troubleduxj/DOCS-WEB/issues)

