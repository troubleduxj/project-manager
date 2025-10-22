# 📊 项目管理系统

基于 React 和 Node.js 构建的现代化项目管理系统，提供完整的任务管理、进度跟踪和团队协作功能。

![Node](https://img.shields.io/badge/Node.js-18+-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Express](https://img.shields.io/badge/Express-4.18-red)
![SQLite](https://img.shields.io/badge/SQLite-5.1-yellow)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ 核心功能

### 📋 任务管理
- **任务创建与分配** - 创建任务并分配给团队成员
- **子任务支持** - 支持多层级子任务管理
- **任务状态跟踪** - 实时跟踪任务状态（未开始、进行中、已完成）
- **优先级管理** - 设置任务优先级和截止日期

### 📊 项目看板
- **可视化看板** - 直观的看板视图展示项目进度
- **拖拽操作** - 支持拖拽调整任务顺序和状态
- **进度统计** - 实时计算项目完成度和任务统计
- **任务展开/收起** - 灵活查看任务详情

### 📄 文档管理
- **文档上传** - 支持 PDF、Markdown、Excel 等多种格式
- **在线预览** - 内置文档查看器，支持在线查看
- **版本控制** - 文档版本管理和历史记录
- **权限控制** - 基于角色的文档访问权限

### 👥 用户管理
- **用户注册与登录** - 安全的用户认证系统
- **角色权限** - 管理员和普通用户角色控制
- **通知设置** - 个性化通知偏好配置
- **用户管理** - 管理员可管理系统用户

### 💬 协作功能
- **任务评论** - 任务级别的评论讨论
- **消息通知** - 实时消息提醒
- **邮件通知** - 可配置的邮件提醒功能

## 🏗️ 技术栈

### 前端
- **React 18.3** - 现代化 UI 框架
- **Docusaurus 3.9** - 提供应用基础框架
- **Axios** - HTTP 客户端
- **React Hooks** - 状态管理

### 后端
- **Node.js 18+** - 运行时环境
- **Express 4.18** - Web 框架
- **SQLite 5.1** - 轻量级数据库
- **JWT** - 身份认证
- **Bcrypt** - 密码加密

### 部署
- **PM2** - 进程管理
- **Nginx** - 反向代理
- **GitHub Actions** - CI/CD 自动化

## 📋 前置要求

- Node.js 18+ 
- npm 或 yarn
- Git（可选，用于版本控制）

## 🚀 快速开始

### 方法一：使用启动脚本（推荐）✨

启动脚本已集成**智能端口清理**功能，会自动检测并清理端口占用。

#### Windows
```bash
# 双击运行或在命令行执行
start.bat
```

#### Linux/macOS
```bash
# 给脚本执行权限
chmod +x start.sh
# 运行脚本
./start.sh
```

**脚本功能：**
- ✅ 自动检查 Node.js 环境
- ✅ 自动清理端口占用（7076、8080）
- ✅ 自动安装依赖
- ✅ 自动初始化数据库
- ✅ 一键启动所有服务

### 方法二：手动启动

#### 1. 克隆项目
```bash
git clone https://github.com/troubleduxj/project-management.git
cd project-management
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 初始化数据库
```bash
npm run setup
```

#### 4. 启动服务

**开发模式（推荐）**
```bash
npm run dev
```

**生产模式**
```bash
npm run dev:production
```

**分别启动**
```bash
# 启动后端服务器
npm run server

# 启动前端服务器（新终端）
npm start
```

## 🌐 访问地址

启动成功后，打开浏览器访问：

- **主页面**: http://localhost:7076 （自动跳转到项目管理）
- **项目管理**: http://localhost:7076/project-management
- **后端API**: http://localhost:8080/api

## 👥 默认账户

系统初始化后会创建以下测试账户：

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 管理员 | admin | admin123 | 完整管理权限 |
| 用户 | client | client123 | 只读权限 |

## 📜 可用脚本

### 开发相关
```bash
npm run dev              # 同时启动前后端（开发模式）
npm run dev:production   # 同时启动前后端（生产模式）
npm start               # 启动前端服务器（端口：7076）
npm run start:dev       # 启动前端服务器（开发模式，监听所有接口）
npm run server          # 启动后端服务器（端口：7080）
npm run server:dev      # 启动后端服务器（开发模式，自动重启）
```

### 数据库相关
```bash
npm run init-db         # 初始化数据库
npm run seed-data       # 添加示例数据
npm run setup           # 初始化数据库并添加示例数据
```

### 构建和部署
```bash
npm run build           # 构建生产版本
npm run serve           # 预览构建结果（端口：7077）
npm run deploy          # 部署到 GitHub Pages
```

### 维护相关
```bash
npm run clear           # 清理构建缓存
npm run clean           # 清理所有文件（node_modules, 缓存等）
npm run reinstall       # 重新安装依赖
npm run kill-ports      # 清理端口占用（7076、8080）
```

## 🔧 端口配置

系统使用以下端口配置：

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端开发服务器 | 7076 | React 开发服务器 |
| 后端API服务器 | 7080 | Express 服务器 |
| 生产预览服务器 | 7077 | 构建结果预览 |

### 端口冲突解决

**启动脚本已自动处理端口占用问题！** 如果仍遇到问题：

1. **使用端口清理工具**（推荐）：
   ```bash
   npm run kill-ports
   ```

2. **手动查看端口占用**：
   ```bash
   # Windows
   netstat -ano | findstr :7076
   netstat -ano | findstr :8080
   
   # Linux/macOS
   lsof -i :7076
   lsof -i :8080
   ```

3. **手动终止进程**：
   ```bash
   # Windows
   taskkill /F /PID <进程ID>
   
   # Linux/macOS
   kill -9 <进程ID>
   ```

4. **修改端口**（不推荐）：
   - 前端端口：修改 `package.json` 中的 `--port` 参数
   - 后端端口：修改 `server/index.js` 中的 `PORT` 变量

📝 详细说明请查看 [PORT_ISSUE_SOLUTION.md](./PORT_ISSUE_SOLUTION.md)

## 📁 项目结构

```
project-management/
├── 📁 server/                     # 后端服务器
│   ├── 📁 database/              # 数据库文件
│   │   ├── db.js                # 数据库连接
│   │   └── project_management.db # SQLite 数据库
│   ├── 📁 middleware/            # 中间件
│   │   └── auth.js              # 身份验证中间件
│   ├── 📁 routes/                # API 路由
│   │   ├── auth.js              # 认证路由
│   │   ├── projects.js          # 项目路由
│   │   ├── documents.js         # 文档路由
│   │   ├── messages.js          # 消息路由
│   │   ├── comments.js          # 评论路由
│   │   ├── settings.js          # 设置路由
│   │   └── email.js             # 邮件路由
│   ├── 📁 uploads/               # 文件上传目录
│   ├── 📄 index.js               # 服务器入口
│   ├── 📄 init-db.js             # 数据库初始化
│   └── 📄 seed-data.js           # 示例数据
├── 📁 src/                        # 前端源码
│   ├── 📁 components/            # React 组件
│   │   ├── 📁 Auth/             # 认证组件
│   │   │   ├── LoginForm.js    # 登录表单
│   │   │   └── RegisterForm.js # 注册表单
│   │   └── 📁 ProjectManagement/ # 项目管理组件
│   │       ├── ProjectManagementApp.js # 主应用
│   │       ├── ProjectDashboard.js     # 项目仪表板
│   │       ├── ProjectBoard.js         # 项目看板
│   │       ├── ProjectDetail.js        # 项目详情
│   │       ├── TaskManagement.js       # 任务管理
│   │       ├── DocumentManager.js      # 文档管理
│   │       ├── MessageCenter.js        # 消息中心
│   │       └── components/             # 子组件
│   │           ├── ConfigManagement.js # 配置管理
│   │           ├── DocumentManagement.js # 文档列表
│   │           └── ConfigManagement/   # 配置子组件
│   ├── 📁 config/                # 配置文件
│   │   └── api.js               # API 配置
│   ├── 📁 css/                   # 样式文件
│   │   ├── custom.css           # 自定义样式
│   │   └── app.css              # 应用样式
│   ├── 📁 pages/                 # 页面组件
│   │   ├── index.js             # 首页（自动跳转）
│   │   └── project-management.js # 项目管理页面
│   ├── 📁 theme/                 # 主题配置
│   │   └── Root.js              # 根组件
│   └── 📁 utils/                 # 工具函数
│       └── markdownParser.js    # Markdown 解析器
├── 📁 static/                     # 静态资源
│   └── 📁 img/                   # 图片资源
├── 📄 docusaurus.config.js       # Docusaurus 配置
├── 📄 package.json               # 项目配置
├── 📄 start.bat                  # Windows 启动脚本
├── 📄 start.sh                   # Linux/macOS 启动脚本
└── 📄 README.md                  # 项目说明
```

## 🔐 环境变量

创建 `.env` 文件配置环境变量：

```env
# 后端配置
PORT=8080
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development

# 前端配置
REACT_APP_API_URL=http://localhost:8080

# 数据库配置
DB_PATH=./server/database/project_management.db

# 邮件配置（可选）
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

## 🚀 部署指南

### 使用 PM2 部署

1. **安装 PM2**：
   ```bash
   npm install -g pm2
   ```

2. **构建项目**：
   ```bash
   npm run build
   ```

3. **启动服务**：
   ```bash
   pm2 start ecosystem.config.js
   ```

4. **查看状态**：
   ```bash
   pm2 status
   pm2 logs
   ```

### 使用 Nginx 反向代理

参考 `nginx.conf.example` 配置文件，设置反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:7076;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

更多部署详情请参考 [部署文档](./README_PROJECT_MANAGEMENT.md)。

## 🔒 安全性

- **密码加密** - 使用 bcrypt 加密存储密码
- **JWT 认证** - 基于 Token 的无状态认证
- **SQL 注入防护** - 使用参数化查询防止 SQL 注入
- **XSS 防护** - 输入验证和输出转义
- **CORS 配置** - 合理的跨域资源共享配置

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.2.0 (2024-01-15)
- ✨ 新增项目看板功能，支持任务展开/收起
- ✨ 新增用户管理功能，支持用户增删改查
- ✨ 新增系统概览页面，针对单项目优化
- ✨ 简化项目结构，移除文档和博客功能
- 🔧 修复端口冲突问题，固定使用7076端口
- 🔧 优化启动脚本，支持自动环境检查
- 📚 重写 README，专注于项目管理功能

### v1.1.0 (2024-01-10)
- ✨ 新增项目管理功能
- ✨ 新增任务管理和子任务支持
- ✨ 新增文档上传和管理
- ✨ 新增用户认证和权限控制
- 🎨 重新设计UI界面

### v1.0.0 (2024-01-01)
- 🎉 初始版本发布

## ❓ 常见问题

### 1. 端口被占用怎么办？
参考上面的"端口冲突解决"部分。

### 2. 数据库初始化失败？
删除 `server/database/project_management.db` 文件后重新运行 `npm run setup`。

### 3. 上传的文件在哪里？
文件保存在 `server/uploads/` 目录下，按项目ID分组。

### 4. 如何修改管理员密码？
登录后在用户管理界面可以修改密码。

### 5. 支持多项目吗？
当前版本已针对单项目优化，但数据库结构支持多项目扩展。

## 📞 支持与反馈

如果您遇到问题或有建议，请通过以下方式联系：

- 📧 邮件：your-email@example.com
- 🐛 问题反馈：[GitHub Issues](https://github.com/troubleduxj/project-management/issues)
- 💬 讨论：[GitHub Discussions](https://github.com/troubleduxj/project-management/discussions)

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

Made with ❤️ by [troubleduxj](https://github.com/troubleduxj)

</div>
