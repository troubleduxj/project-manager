# 📚 文档管理系统

基于 Docusaurus 构建的现代化文档管理系统，支持自动部署、版本管理和全文搜索。

![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9-green)
![Node](https://img.shields.io/badge/Node.js-18+-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ 特性

- 📝 **Markdown 支持** - 使用简单的 Markdown 语法编写文档
- 🔍 **全文搜索** - 集成 Algolia DocSearch 或本地搜索
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🌙 **暗黑模式** - 自动切换明暗主题
- 📚 **版本管理** - 支持多版本文档并存
- 🌐 **多语言** - 内置中文和英文支持
- 🚀 **自动部署** - GitHub Actions 自动化部署
- ⚡ **快速加载** - 静态网站生成，性能优异

## 🏗️ 技术栈

- [Docusaurus](https://docusaurus.io/) - 静态站点生成器
- [React](https://reactjs.org/) - UI 框架
- [Markdown](https://www.markdownguide.org/) - 文档格式
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [Nginx](https://nginx.org/) - Web 服务器
- [Let's Encrypt](https://letsencrypt.org/) - SSL 证书

## 📋 前置要求

- Node.js 18+ 
- npm 或 yarn
- Git

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/troubleduxj/DOCS-WEB.git
cd DOCS-WEB
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 4. 构建生产版本

```bash
npm run build
```

生成的静态文件位于 `build` 目录。

### 5. 预览生产构建

```bash
npm run serve
```

## 📖 项目结构

```
docs-web/
├── .github/
│   └── workflows/          # GitHub Actions 工作流
│       ├── deploy.yml      # 生产环境部署
│       ├── deploy-dev.yml  # 开发环境部署
│       └── ci.yml          # CI 测试
├── docs/                   # 📚 文档目录
│   ├── intro.md           # 首页
│   ├── getting-started/   # 快速开始
│   └── guides/            # 使用指南
├── blog/                   # 📝 博客（可选）
├── src/
│   ├── components/         # 自定义 React 组件
│   ├── css/               # 样式文件
│   └── pages/             # 自定义页面
├── static/
│   └── img/               # 静态资源
├── server-config/          # 服务器配置文件
│   ├── nginx-*.conf       # Nginx 配置
│   ├── backup-docs.sh     # 备份脚本
│   ├── monitor.sh         # 监控脚本
│   └── setup-server.sh    # 服务器初始化脚本
├── docusaurus.config.js   # Docusaurus 配置
├── sidebars.js            # 侧边栏配置
├── package.json
└── README.md
```

## 📝 编写文档

### 创建新文档

在 `docs` 目录下创建 Markdown 文件：

```markdown
---
sidebar_position: 1
---

# 我的新文档

这是文档内容...
```

### 添加到侧边栏

编辑 `sidebars.js`：

```javascript
module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '新分类',
      items: ['my-new-doc'],
    },
  ],
};
```

### 添加图片

将图片放在 `static/img` 目录：

```markdown
![示例图片](/img/example.png)
```

## 🚢 部署

### GitHub Actions 自动部署

1. **在 GitHub 仓库设置中添加 Secrets**
   - `SSH_PRIVATE_KEY`: 服务器 SSH 私钥
   - `REMOTE_HOST`: 服务器 IP 地址
   - `REMOTE_USER`: SSH 用户名

2. **推送代码到主分支**
   ```bash
   git push origin main
   ```

GitHub Actions 会自动构建并部署到服务器。

### 服务器配置

详细的服务器配置说明请查看 [server-config/README.md](./server-config/README.md)。

快速配置步骤：

```bash
# 1. 运行服务器初始化脚本
sudo ./server-config/setup-server.sh

# 2. 配置 Nginx
sudo cp server-config/nginx-docs-web.conf /etc/nginx/sites-available/docs-web
sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 3. 配置 SSL 证书
sudo certbot --nginx -d yourdomain.com

# 4. 设置自动备份
sudo cp server-config/backup-docs.sh /root/scripts/
sudo chmod +x /root/scripts/backup-docs.sh
sudo crontab -e  # 添加定时任务
```

## 🔧 配置

### 修改网站信息

编辑 `docusaurus.config.js`：

```javascript
const config = {
  title: '我的文档中心',           // 网站标题
  tagline: '知识库与文档管理系统',   // 标语
  url: 'https://yourdomain.com',   // 域名
  organizationName: 'troubleduxj', // GitHub 用户名
  projectName: 'docs-web',         // 仓库名
};
```

### 配置搜索

#### Algolia DocSearch（推荐）

1. 访问 https://docsearch.algolia.com/apply/ 申请
2. 收到配置信息后，更新 `docusaurus.config.js`：

```javascript
algolia: {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_API_KEY',
  indexName: 'docs',
}
```

#### 本地搜索

```bash
npm install --save @easyops-cn/docusaurus-search-local
```

### 自定义样式

编辑 `src/css/custom.css` 修改主题颜色。

## 📚 文档版本管理

### 创建新版本

```bash
npm run docusaurus docs:version 1.0.0
```

这会创建版本快照，历史版本保存在 `versioned_docs` 目录。

### 版本结构

```
docs/                    # 最新版本
versioned_docs/
  └── version-1.0.0/    # v1.0.0 版本
versioned_sidebars/
  └── version-1.0.0-sidebars.json
versions.json           # 版本列表
```

## 🛠️ 常用命令

```bash
npm start              # 启动开发服务器
npm run build          # 构建生产版本
npm run serve          # 预览生产构建
npm run clear          # 清除缓存
npm run deploy         # 部署到 GitHub Pages（如果配置）
```

## 🌳 Git 工作流

### 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-doc

# 2. 编写文档
# 修改 docs/ 下的文件

# 3. 提交更改
git add .
git commit -m "docs: 添加新文档"

# 4. 合并到开发分支
git checkout dev
git merge feature/new-doc
git push origin dev  # 自动部署到开发环境

# 5. 发布到生产环境
git checkout main
git merge dev
git push origin main  # 自动部署到生产环境
```

### 分支策略

- `main` - 生产环境，稳定版本
- `dev` - 开发环境，最新功能
- `feature/*` - 功能分支，新功能开发

## 📊 监控和维护

### 查看日志

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/docs-web/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/docs-web/error.log

# 备份日志
sudo tail -f /var/log/backup-docs.log
```

### 备份和恢复

```bash
# 手动备份
sudo /root/scripts/backup-docs.sh

# 恢复备份
sudo tar -xzf /backup/docs-web/docs-web-20251012.tar.gz -C /var/www/
```

## 🔒 安全

- ✅ HTTPS 加密传输
- ✅ SSL 证书自动续期
- ✅ 安全头配置（X-Frame-Options, CSP 等）
- ✅ 防火墙配置
- ✅ SSH 密钥认证
- ✅ 定期备份

## 🆘 故障排查

### 构建失败

```bash
# 清除缓存
npm run clear

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 部署失败

1. 检查 GitHub Actions 日志
2. 验证 Secrets 配置
3. 测试 SSH 连接
4. 检查服务器磁盘空间

### 网站无法访问

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查 Nginx 配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

## 📞 支持

如有问题，请：

- 📖 查看[完整设计方案](./design.md)
- 📖 查看[服务器配置文档](./server-config/README.md)
- 🐛 [提交 Issue](https://github.com/troubleduxj/DOCS-WEB/issues)
- 💬 [参与讨论](https://github.com/troubleduxj/DOCS-WEB/discussions)

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

- [Docusaurus](https://docusaurus.io/) - 强大的文档框架
- [React](https://reactjs.org/) - UI 框架
- [Algolia](https://www.algolia.com/) - 搜索服务

---

**💙 用心打造，愉快使用！**

如果这个项目对你有帮助，欢迎 ⭐ Star 支持！

