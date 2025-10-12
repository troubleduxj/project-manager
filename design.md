# Docusaurus + GitHub + 腾讯云服务器 文档系统设计方案

## 📋 整体架构设计

### 系统架构图
```
本地开发环境
    ↓ (git push)
GitHub仓库 (版本管理)
    ↓ (GitHub Actions触发)
腾讯云服务器 (自动部署)
    ↓
Nginx + Docusaurus (静态网站服务)
    ↓
用户访问 (公网/内网)
```

### 技术栈

**前端文档系统**
- Docusaurus 3.x - 静态站点生成器
- Markdown/MDX - 文档编写格式
- React - 自定义组件
- Algolia DocSearch - 全文搜索

**版本控制**
- Git - 版本管理
- GitHub - 代码托管与协作
- 分支策略：
  - `main` - 生产环境
  - `dev` - 开发环境
  - `feature/*` - 功能分支

**CI/CD 自动化部署**
- GitHub Actions - 自动化工作流
- SSH Deploy - 远程部署

**服务器部署**
- 腾讯云服务器 - Ubuntu 20.04/22.04
- Nginx - Web服务器
- Let's Encrypt - SSL证书
- PM2 - 进程管理（可选）

---

## 🏗️ 详细实施方案

### 阶段一：本地项目初始化

#### 1.1 安装Docusaurus
```bash
# 确保安装 Node.js 16+
node --version

# 初始化项目（如果已有目录，使用当前目录）
npx create-docusaurus@latest . classic --typescript

# 或创建新目录
npx create-docusaurus@latest docs-web classic --typescript
cd docs-web
```

#### 1.2 项目结构
```
docs-web/
├── .github/
│   └── workflows/          # GitHub Actions工作流
├── docs/                   # 📚 文档目录
│   ├── intro.md
│   ├── tutorial/
│   └── api/
├── blog/                   # 📝 博客（可选）
├── src/
│   ├── components/         # 自定义React组件
│   ├── css/               # 样式文件
│   └── pages/             # 自定义页面
├── static/
│   ├── img/               # 图片资源
│   └── files/             # 下载文件
├── docusaurus.config.js   # 配置文件
├── package.json
├── sidebars.js            # 侧边栏配置
└── README.md
```

#### 1.3 配置 docusaurus.config.js
```javascript
// @ts-check
const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '我的文档中心',
  tagline: '知识库与文档管理系统',
  favicon: 'img/favicon.ico',

  // 生产环境URL
  url: 'https://yourdomain.com',
  baseUrl: '/',

  // GitHub Pages配置（如需要）
  organizationName: 'yourusername',
  projectName: 'docs-web',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // 国际化配置
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    localeConfigs: {
      'zh-CN': {
        label: '简体中文',
      },
      en: {
        label: 'English',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/yourusername/docs-web/tree/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // 版本管理
          versions: {
            current: {
              label: '开发版',
            },
          },
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/yourusername/docs-web/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '文档中心',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          {to: '/blog', label: '博客', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/yourusername/docs-web',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '快速开始',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '博客',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/yourusername/docs-web',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ['bash', 'nginx', 'yaml'],
      },
      
      // 搜索配置 - Algolia
      algolia: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'docs',
        contextualSearch: true,
      },
      
      // 或使用本地搜索插件
      // 需要安装: npm install --save @easyops-cn/docusaurus-search-local
    }),
};

module.exports = config;
```

#### 1.4 安装依赖并测试
```bash
# 安装依赖
npm install

# 本地开发模式
npm start
# 访问 http://localhost:3000

# 构建生产版本
npm run build

# 预览生产版本
npm run serve
```

---

### 阶段二：Git版本管理配置

#### 2.1 创建 .gitignore
```
# 依赖
node_modules/

# 生产构建
build/
.docusaurus/
.cache-loader/

# 环境变量
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# 系统文件
.DS_Store
Thumbs.db

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

#### 2.2 初始化Git仓库
```bash
# 初始化Git
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "feat: 初始化Docusaurus项目"

# 设置主分支
git branch -M main

# 添加远程仓库
git remote add origin https://github.com/yourusername/docs-web.git

# 推送到GitHub
git push -u origin main

# 创建开发分支
git checkout -b dev
git push -u origin dev
```

#### 2.3 分支管理策略
```bash
# 功能开发流程
git checkout -b feature/new-feature
# 开发...
git add .
git commit -m "feat: 添加新功能"
git checkout dev
git merge feature/new-feature
git push origin dev

# 发布到生产
git checkout main
git merge dev
git tag v1.0.0
git push origin main --tags
```

---

### 阶段三：GitHub Actions自动化部署

#### 3.1 创建部署工作流
创建文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to Tencent Cloud

on:
  push:
    branches:
      - main  # 主分支推送时触发部署

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 获取完整历史，用于显示最后更新时间
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 构建项目
        run: npm run build
        
      - name: 部署到腾讯云服务器
        uses: easingthemes/ssh-deploy@main
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          REMOTE_PORT: 22
          SOURCE: "build/"
          TARGET: "/var/www/docs-web"
          EXCLUDE: "/node_modules/, /.git/"
          SCRIPT_BEFORE: |
            whoami
            ls -al
          SCRIPT_AFTER: |
            cd /var/www/docs-web
            ls -al
            sudo systemctl reload nginx
            echo "部署完成！"
```

#### 3.2 开发环境部署工作流
创建文件：`.github/workflows/deploy-dev.yml`

```yaml
name: Deploy Dev to Tencent Cloud

on:
  push:
    branches:
      - dev  # 开发分支推送时触发

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 构建项目
        run: npm run build
        
      - name: 部署到开发服务器
        uses: easingthemes/ssh-deploy@main
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "build/"
          TARGET: "/var/www/docs-web-dev"
```

#### 3.3 配置GitHub Secrets
在 GitHub 仓库 → Settings → Secrets and variables → Actions 中添加：

- `SSH_PRIVATE_KEY`: 服务器SSH私钥（整个私钥文件内容）
- `REMOTE_HOST`: 腾讯云服务器IP地址
- `REMOTE_USER`: SSH用户名（通常是 root 或 ubuntu）

---

### 阶段四：腾讯云服务器配置

#### 4.1 服务器基础环境安装
```bash
# SSH连接到服务器
ssh root@your-server-ip

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y nginx git curl wget ufw

# 安装 Node.js（可选，用于SSR或本地构建）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
nginx -v
git --version
node --version
npm --version
```

#### 4.2 创建网站目录
```bash
# 创建生产环境目录
sudo mkdir -p /var/www/docs-web
sudo chown -R $USER:$USER /var/www/docs-web
sudo chmod -R 755 /var/www/docs-web

# 创建开发环境目录（可选）
sudo mkdir -p /var/www/docs-web-dev
sudo chown -R $USER:$USER /var/www/docs-web-dev
sudo chmod -R 755 /var/www/docs-web-dev

# 创建日志目录
sudo mkdir -p /var/log/nginx/docs-web
```

#### 4.3 配置SSH密钥认证
```bash
# 在服务器上生成密钥对（或使用现有的）
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"

# 将公钥添加到 authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 复制私钥内容，添加到GitHub Secrets
cat ~/.ssh/id_rsa
# 复制全部内容，包括 -----BEGIN RSA PRIVATE KEY----- 和 -----END RSA PRIVATE KEY-----
```

#### 4.4 配置Nginx

**生产环境配置**
创建文件：`/etc/nginx/sites-available/docs-web`

```nginx
# HTTP - 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Let's Encrypt验证
    location /.well-known/acme-challenge/ {
        root /var/www/docs-web;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - 生产环境
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 网站根目录
    root /var/www/docs-web;
    index index.html;
    
    # 日志
    access_log /var/log/nginx/docs-web/access.log;
    error_log /var/log/nginx/docs-web/error.log;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/x-javascript application/xml;
    
    # 主路由
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

# 内网访问（可选）
server {
    listen 8080;
    server_name 192.168.x.x;  # 内网IP
    
    root /var/www/docs-web;
    index index.html;
    
    access_log /var/log/nginx/docs-web/internal-access.log;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**开发环境配置（可选）**
创建文件：`/etc/nginx/sites-available/docs-web-dev`

```nginx
server {
    listen 80;
    server_name dev.yourdomain.com;
    
    root /var/www/docs-web-dev;
    index index.html;
    
    access_log /var/log/nginx/docs-web/dev-access.log;
    error_log /var/log/nginx/docs-web/dev-error.log;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 基本认证（可选）
    auth_basic "Development Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

**启用站点配置**
```bash
# 测试配置
sudo nginx -t

# 启用站点
sudo ln -s /etc/nginx/sites-available/docs-web /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/docs-web-dev /etc/nginx/sites-enabled/

# 重启Nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
```

#### 4.5 配置SSL证书
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 测试自动续期
sudo certbot renew --dry-run

# 查看证书信息
sudo certbot certificates
```

#### 4.6 配置防火墙
```bash
# 启用UFW防火墙
sudo ufw status

# 允许SSH（重要！先设置这个）
sudo ufw allow 22/tcp

# 允许HTTP和HTTPS
sudo ufw allow 'Nginx Full'

# 允许内网端口（可选）
sudo ufw allow 8080/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status verbose
```

**腾讯云安全组配置**
在腾讯云控制台配置安全组规则：
- 入站规则：
  - TCP 22 (SSH) - 限制源IP
  - TCP 80 (HTTP)
  - TCP 443 (HTTPS)
  - TCP 8080 (内网，可选)
- 出站规则：
  - 全部允许

---

### 阶段五：本地开发工作流

#### 5.1 日常文档编写流程
```bash
# 1. 拉取最新代码
git pull origin dev

# 2. 创建功能分支
git checkout -b docs/new-tutorial

# 3. 创建新文档
cd docs
mkdir -p tutorial
touch tutorial/getting-started.md

# 4. 编写文档内容
---
id: getting-started
title: 快速开始
sidebar_label: 快速开始
sidebar_position: 1
---

# 快速开始

这是一个新的教程文档...

## 安装

\`\`\`bash
npm install
\`\`\`

## 使用

\`\`\`javascript
console.log('Hello World');
\`\`\`

# 5. 本地预览
npm start  # 访问 http://localhost:3000

# 6. 提交更改
git add .
git commit -m "docs: 添加快速开始教程"

# 7. 推送到开发分支
git checkout dev
git merge docs/new-tutorial
git push origin dev  # 自动部署到开发环境

# 8. 发布到生产环境
git checkout main
git merge dev
git push origin main  # 自动部署到生产环境
```

#### 5.2 配置侧边栏
编辑 `sidebars.js`:
```javascript
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '开始使用',
      items: ['intro', 'tutorial/getting-started'],
    },
    {
      type: 'category',
      label: 'API文档',
      items: ['api/overview', 'api/authentication'],
    },
  ],
};

module.exports = sidebars;
```

#### 5.3 文档版本管理
```bash
# 创建新版本快照
npm run docusaurus docs:version 1.0.0

# 项目结构
docs-web/
├── docs/                           # 最新版本（next）
├── versioned_docs/
│   ├── version-1.0.0/             # v1.0.0版本
│   └── version-0.9.0/             # v0.9.0版本
├── versioned_sidebars/
│   ├── version-1.0.0-sidebars.json
│   └── version-0.9.0-sidebars.json
└── versions.json                   # 版本列表

# 编辑历史版本
# 直接修改 versioned_docs/version-1.0.0/ 下的文件

# 删除版本
# 删除对应的 versioned_docs/version-x.x.x/ 目录
# 从 versions.json 中删除对应版本号
```

---

## 🚀 可选增强功能

### 1. 搜索功能配置

#### 方案A：Algolia DocSearch（推荐）
```bash
# 1. 申请免费的 DocSearch
# 访问：https://docsearch.algolia.com/apply/
# 提交你的网站信息

# 2. 收到邮件后，获取配置信息
# appId, apiKey, indexName

# 3. 在 docusaurus.config.js 中配置
algolia: {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
  indexName: 'YOUR_INDEX_NAME',
  contextualSearch: true,
  searchParameters: {},
}
```

#### 方案B：本地搜索插件
```bash
# 安装插件
npm install --save @easyops-cn/docusaurus-search-local

# 在 docusaurus.config.js 中配置
themes: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["zh", "en"],
      highlightSearchTermsOnTargetPage: true,
      indexDocs: true,
      indexBlog: true,
    },
  ],
],
```

### 2. 自动化备份脚本

创建服务器备份脚本：`/root/scripts/backup-docs.sh`
```bash
#!/bin/bash

# 配置
BACKUP_DIR="/backup/docs-web"
SOURCE_DIR="/var/www/docs-web"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份网站文件
echo "开始备份: $DATE"
tar -czf $BACKUP_DIR/docs-web-$DATE.tar.gz -C /var/www docs-web

# 备份Nginx配置
tar -czf $BACKUP_DIR/nginx-config-$DATE.tar.gz -C /etc/nginx sites-available sites-enabled

# 删除旧备份
echo "清理旧备份..."
find $BACKUP_DIR -name "docs-web-*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "nginx-config-*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "备份完成！"
ls -lh $BACKUP_DIR | tail -n 5
```

设置定时任务：
```bash
# 添加执行权限
chmod +x /root/scripts/backup-docs.sh

# 编辑crontab
crontab -e

# 添加定时任务（每天凌晨2点执行）
0 2 * * * /root/scripts/backup-docs.sh >> /var/log/backup-docs.log 2>&1
```

### 3. 监控和日志分析

#### 安装监控工具
```bash
# 系统监控
sudo apt install htop iotop nethogs -y

# 日志分析工具
sudo apt install goaccess -y
```

#### Nginx日志分析
```bash
# 实时查看访问日志
sudo tail -f /var/log/nginx/docs-web/access.log

# 使用GoAccess生成报告
sudo goaccess /var/log/nginx/docs-web/access.log -o /var/www/docs-web/report.html --log-format=COMBINED
```

#### 创建监控脚本：`/root/scripts/monitor.sh`
```bash
#!/bin/bash

# 检查Nginx状态
if ! systemctl is-active --quiet nginx; then
    echo "Nginx 已停止，尝试重启..."
    systemctl restart nginx
    # 发送告警邮件或webhook
fi

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "警告：磁盘使用率超过80%: $DISK_USAGE%"
fi

# 检查网站可访问性
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com)
if [ $HTTP_CODE -ne 200 ]; then
    echo "警告：网站返回状态码 $HTTP_CODE"
fi
```

### 4. 多环境部署

#### 环境配置文件
```javascript
// docusaurus.config.js
const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  url: isProduction ? 'https://yourdomain.com' : 'https://dev.yourdomain.com',
  // 其他环境相关配置...
};
```

### 5. 评论系统集成

#### 使用 Giscus（基于GitHub Discussions）
```bash
# 安装
npm install @giscus/react

# 在文档底部添加评论组件
# src/theme/DocItem/Footer/index.js
```

### 6. 站点统计分析

#### 添加百度统计或Google Analytics
```javascript
// docusaurus.config.js
module.exports = {
  scripts: [
    {
      src: 'https://hm.baidu.com/hm.js?YOUR_KEY',
      async: true,
    },
  ],
};
```

---

## 🔒 安全最佳实践

### 1. 服务器安全加固
```bash
# 1. 修改SSH端口（可选）
sudo nano /etc/ssh/sshd_config
# Port 22 → Port 2222
sudo systemctl restart sshd

# 2. 禁用密码登录，只允许密钥认证
# PasswordAuthentication no
# PubkeyAuthentication yes

# 3. 安装 fail2ban 防止暴力破解
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 4. 配置 fail2ban
sudo nano /etc/fail2ban/jail.local
```

### 2. Git安全
```bash
# 1. 创建 .env.example 模板
# .env.example
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key

# 2. .gitignore 中忽略敏感文件
.env
.env.local
*.key
*.pem
```

### 3. Nginx安全头配置
已在上面的Nginx配置中包含：
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

---

## 📊 性能优化

### 1. 构建优化
```javascript
// docusaurus.config.js
module.exports = {
  future: {
    experimental_faster: true,
  },
};
```

### 2. Nginx缓存配置
已在上面的Nginx配置中包含Gzip压缩和静态资源缓存。

### 3. CDN加速（可选）
- 使用腾讯云CDN加速静态资源
- 或使用 Cloudflare 作为CDN和DNS

---

## 📝 快速开始检查清单

### 本地环境
- [ ] 安装 Node.js 16+
- [ ] 初始化 Docusaurus 项目
- [ ] 配置 docusaurus.config.js
- [ ] 创建示例文档并测试

### Git和GitHub
- [ ] 初始化Git仓库
- [ ] 创建GitHub仓库
- [ ] 推送代码到GitHub
- [ ] 创建 dev 分支
- [ ] 创建 .github/workflows 部署脚本

### 腾讯云服务器
- [ ] 购买云服务器
- [ ] 配置安全组（开放22, 80, 443端口）
- [ ] 安装 Nginx
- [ ] 配置SSH密钥认证
- [ ] 创建网站目录
- [ ] 配置Nginx站点
- [ ] 安装SSL证书
- [ ] 配置防火墙

### GitHub Actions
- [ ] 配置 SSH_PRIVATE_KEY
- [ ] 配置 REMOTE_HOST
- [ ] 配置 REMOTE_USER
- [ ] 测试自动部署

### 域名和DNS
- [ ] 购买域名
- [ ] 配置DNS解析
- [ ] 等待DNS生效（最多48小时）
- [ ] 验证域名可访问

### 搜索功能
- [ ] 申请 Algolia DocSearch 或安装本地搜索插件
- [ ] 配置搜索功能
- [ ] 测试搜索

### 监控和维护
- [ ] 设置自动备份
- [ ] 配置监控脚本
- [ ] 测试恢复流程

---

## 🎯 项目命令速查

### 本地开发
```bash
npm start              # 启动开发服务器
npm run build          # 构建生产版本
npm run serve          # 预览生产版本
npm run clear          # 清除缓存
npm run swizzle        # 自定义主题组件
```

### Git操作
```bash
git status             # 查看状态
git add .              # 添加所有更改
git commit -m "msg"    # 提交
git push origin main   # 推送到主分支
git pull origin dev    # 拉取开发分支
```

### 服务器操作
```bash
# Nginx
sudo nginx -t                    # 测试配置
sudo systemctl restart nginx     # 重启
sudo systemctl status nginx      # 查看状态
sudo tail -f /var/log/nginx/...  # 查看日志

# 部署
cd /var/www/docs-web
ls -la

# 查看进程
ps aux | grep nginx
```

---

## 📚 参考资源

- [Docusaurus官方文档](https://docusaurus.io/)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Nginx官方文档](https://nginx.org/en/docs/)
- [Let's Encrypt文档](https://letsencrypt.org/docs/)
- [腾讯云文档](https://cloud.tencent.com/document)

---

## 🆘 常见问题排查

### 1. GitHub Actions部署失败
```bash
# 检查Secrets配置
# 检查服务器SSH连接
ssh -i ~/.ssh/id_rsa user@host

# 查看GitHub Actions日志
```

### 2. Nginx 403错误
```bash
# 检查文件权限
ls -la /var/www/docs-web
sudo chown -R www-data:www-data /var/www/docs-web
sudo chmod -R 755 /var/www/docs-web
```

### 3. SSL证书问题
```bash
# 续期证书
sudo certbot renew

# 查看证书状态
sudo certbot certificates
```

### 4. 网站访问慢
- 检查CDN配置
- 优化图片大小
- 启用Gzip压缩
- 使用浏览器开发者工具分析

---

## 📞 维护联系人

- 项目负责人：[您的名字]
- 技术支持：[邮箱]
- GitHub仓库：https://github.com/yourusername/docs-web

---

**最后更新时间：** 2025-10-12
**版本：** v1.0.0

