# 项目管理系统 - 部署和使用指南

## 🎯 系统概述

这是一个基于 Docusaurus + Node.js + SQLite 的项目管理和文档查看系统，具有以下核心功能：

- **用户认证**: 支持管理员和客户角色
- **项目管理**: 创建、跟踪和管理项目进度
- **任务管理**: 详细的任务分配和进度跟踪
- **文档管理**: 在线上传、预览和下载项目文档
- **实时沟通**: 项目团队与客户的实时消息交流
- **权限控制**: 基于角色的访问控制

## 🏗️ 系统架构

```
前端 (React + Docusaurus)
├── 用户认证界面
├── 项目管理仪表板
├── 进度跟踪面板
├── 文档管理器
└── 实时消息中心

后端 (Node.js + Express)
├── RESTful API
├── Socket.IO 实时通信
├── JWT 身份验证
├── 文件上传处理
└── SQLite 数据库

数据库 (SQLite)
├── 用户表
├── 项目表
├── 任务进度表
├── 文档表
└── 消息表
```

## 🚀 快速开始

### 1. 环境要求

- Node.js 18.0+
- npm 或 yarn
- 现代浏览器

### 2. 安装依赖

```bash
# 安装项目依赖
npm install

# 初始化数据库
npm run init-db
```

### 3. 启动系统

```bash
# 开发模式 (同时启动前端和后端)
npm run dev

# 或者分别启动
npm run server  # 启动后端服务 (端口 3001)
npm start       # 启动前端服务 (端口 3000)
```

### 4. 访问系统

- 前端地址: http://localhost:3000
- 项目管理系统: http://localhost:3000/project-management
- 后端API: http://localhost:3001/api

### 5. 默认账户

系统初始化后会创建以下默认账户：

**管理员账户**
- 用户名: `admin`
- 密码: `admin123`
- 权限: 创建项目、管理所有项目、上传文档

**客户账户**
- 用户名: `client`
- 密码: `client123`
- 权限: 查看分配的项目、下载文档、参与沟通

## 📋 功能详解

### 用户认证系统

- **登录/注册**: 支持用户名和邮箱登录
- **角色管理**: 管理员和客户两种角色
- **JWT认证**: 安全的token认证机制
- **权限控制**: 基于角色的功能访问控制

### 项目管理

- **项目创建**: 管理员可创建新项目并分配给客户
- **项目概览**: 显示项目基本信息、进度和状态
- **状态管理**: 规划中、进行中、已完成、暂停、已取消
- **优先级设置**: 低、中、高、紧急四个级别

### 进度跟踪

- **任务管理**: 创建、编辑和删除项目任务
- **进度更新**: 实时更新任务和项目进度
- **状态跟踪**: 待开始、进行中、已完成、暂停
- **负责人分配**: 为任务分配负责人
- **时间管理**: 设置开始时间和截止时间

### 文档管理

- **文件上传**: 支持多种文件格式 (PDF, DOC, DOCX, TXT, MD, 图片等)
- **在线预览**: 文本文件可直接在线预览
- **分类管理**: 需求文档、设计文档、技术文档等分类
- **权限控制**: 公开/私有文档权限设置
- **版本管理**: 文档版本跟踪

### 实时沟通

- **即时消息**: 基于Socket.IO的实时消息系统
- **项目群聊**: 项目相关人员的群组沟通
- **消息历史**: 完整的消息记录和搜索
- **在线状态**: 显示用户在线状态
- **消息通知**: 未读消息提醒

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```env
# 服务器配置
PORT=3001
NODE_ENV=production

# JWT密钥 (生产环境请修改)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 数据库配置
DB_PATH=./server/database/project_management.db

# 文件上传配置
UPLOAD_DIR=./server/uploads
MAX_FILE_SIZE=10485760  # 10MB

# 前端地址
FRONTEND_URL=http://localhost:3000
```

### 数据库配置

系统使用SQLite数据库，数据库文件位于 `server/database/project_management.db`。

初始化数据库：
```bash
npm run init-db
```

### 文件上传配置

- 上传目录: `server/uploads/`
- 最大文件大小: 10MB
- 支持的文件类型: PDF, DOC, DOCX, TXT, MD, JPG, PNG, GIF, ZIP, RAR

## 🌐 生产环境部署

### 1. 构建前端

```bash
npm run build
```

### 2. 服务器配置

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/your/project/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO支持
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### PM2 配置

创建 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'project-management-api',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

启动服务：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. 系统服务配置

创建 systemd 服务文件 `/etc/systemd/system/project-management.service`:

```ini
[Unit]
Description=Project Management System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl enable project-management
sudo systemctl start project-management
sudo systemctl status project-management
```

## 🔒 安全配置

### 1. 环境变量安全

- 修改默认的JWT密钥
- 设置强密码策略
- 配置HTTPS证书

### 2. 数据库安全

- 定期备份数据库
- 设置文件权限
- 启用数据库加密（如需要）

### 3. 文件上传安全

- 限制文件类型和大小
- 扫描上传的文件
- 设置上传目录权限

### 4. 网络安全

- 配置防火墙规则
- 启用HTTPS
- 设置CORS策略

## 📊 监控和维护

### 1. 日志管理

```bash
# 查看应用日志
pm2 logs project-management-api

# 查看系统日志
sudo journalctl -u project-management -f
```

### 2. 数据库备份

```bash
# 创建备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp server/database/project_management.db backup/project_management_$DATE.db
```

### 3. 性能监控

- 使用PM2监控应用状态
- 配置Nginx访问日志分析
- 监控服务器资源使用情况

## 🛠️ 开发指南

### 1. 项目结构

```
project/
├── server/                 # 后端代码
│   ├── database/          # 数据库相关
│   ├── routes/            # API路由
│   ├── uploads/           # 文件上传目录
│   └── index.js           # 服务器入口
├── src/                   # 前端代码
│   ├── components/        # React组件
│   ├── pages/             # 页面组件
│   └── css/               # 样式文件
├── docs/                  # 文档目录
├── blog/                  # 博客目录
└── static/                # 静态资源
```

### 2. API接口

#### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

#### 项目接口
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建项目
- `GET /api/projects/:id` - 获取项目详情
- `PUT /api/projects/:id` - 更新项目

#### 任务接口
- `GET /api/projects/:id/progress` - 获取项目任务
- `POST /api/projects/:id/tasks` - 添加任务
- `PUT /api/projects/:id/tasks/:taskId` - 更新任务

#### 文档接口
- `GET /api/documents/project/:id` - 获取项目文档
- `POST /api/documents/project/:id/upload` - 上传文档
- `GET /api/documents/:id/download` - 下载文档

#### 消息接口
- `GET /api/messages/project/:id` - 获取项目消息
- `POST /api/messages/project/:id` - 发送消息

### 3. 数据库Schema

详细的数据库表结构请参考 `server/init-db.js` 文件。

### 4. 前端组件

- `LoginForm` - 登录表单
- `ProjectDashboard` - 项目仪表板
- `ProjectList` - 项目列表
- `ProjectDetail` - 项目详情
- `ProjectProgress` - 进度管理
- `DocumentManager` - 文档管理
- `MessageCenter` - 消息中心

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库文件权限
   - 确认数据库文件路径正确

2. **文件上传失败**
   - 检查上传目录权限
   - 确认文件大小限制
   - 验证文件类型是否支持

3. **Socket.IO连接问题**
   - 检查防火墙设置
   - 确认端口是否开放
   - 验证CORS配置

4. **权限访问错误**
   - 检查JWT token是否有效
   - 确认用户角色权限
   - 验证API路由权限

### 调试模式

```bash
# 启用调试模式
DEBUG=* npm run server

# 查看详细日志
NODE_ENV=development npm run server
```

## 📞 技术支持

如果您在部署或使用过程中遇到问题，请：

1. 查看系统日志文件
2. 检查网络连接和端口配置
3. 确认环境变量设置
4. 验证数据库和文件权限

## 📄 许可证

本项目采用 MIT 许可证。

---

**最后更新**: 2025-10-14
**版本**: v1.0.0
