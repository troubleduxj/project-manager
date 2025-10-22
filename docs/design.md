# 🏗️ 项目管理系统 - 系统设计文档

## 📋 项目概述

**项目名称**: 企业级项目管理系统  
**项目类型**: Web 应用程序  
**技术架构**: 前后端分离  
**开发语言**: JavaScript/Node.js  
**目标用户**: 企业管理员、项目经理、客户  
**版本**: 1.0.0  
**更新日期**: 2025-10-22

---

## 🎯 系统定位与目标

### 核心定位
提供一个轻量级、易用的项目管理解决方案，支持项目生命周期管理、任务跟踪、文档管理、团队协作等功能。

### 设计目标
1. **简单易用** - 直观的用户界面，降低学习成本
2. **权限分明** - 清晰的角色权限体系
3. **功能完整** - 覆盖项目管理全流程
4. **响应迅速** - 优化的性能表现
5. **易于部署** - 简化的部署流程

---

## 🏛️ 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                    客户端层                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Web浏览器   │  │  移动浏览器  │  │  PWA应用   │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
└─────────┼──────────────────┼─────────────────┼───────┘
          │                  │                 │
          └──────────────────┴─────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Nginx/静态    │
                    │   资源服务器    │
                    └────────┬────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────┐              ┌──────────▼─────────┐
│   应用层（前端）    │              │   API层（后端）     │
│                    │              │                    │
│  React SPA         │◄────REST────►│  Express Server    │
│  - 路由管理        │              │  - 路由处理        │
│  - 状态管理        │              │  - 业务逻辑        │
│  - 组件库          │              │  - 权限验证        │
│  - 实时通信        │              │  - 数据验证        │
└────────────────────┘              └──────────┬─────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │   数据层          │
                                    │                   │
                                    │  SQLite Database  │
                                    │  - 用户数据       │
                                    │  - 项目数据       │
                                    │  - 文档数据       │
                                    └───────────────────┘
```

### 技术栈详解

#### 前端技术栈
```
├── 核心框架
│   ├── React 18.x - UI框架
│   ├── React Router - 路由管理
│   └── Context API - 状态管理
│
├── UI/样式
│   ├── CSS Modules - 组件样式隔离
│   ├── Inline Styles - 动态样式
│   └── 响应式设计 - 移动端适配
│
├── 工具库
│   ├── bcryptjs - 密码加密
│   ├── date-fns/dayjs - 日期处理
│   └── file-saver - 文件下载
│
└── 构建工具
    ├── Webpack/Vite - 打包工具
    ├── Babel - JS编译
    └── ESLint - 代码规范
```

#### 后端技术栈
```
├── 运行环境
│   └── Node.js 16+ - JavaScript运行时
│
├── Web框架
│   ├── Express 4.x - Web服务器框架
│   ├── CORS - 跨域处理
│   └── Body-parser - 请求解析
│
├── 数据库
│   ├── SQLite3 - 嵌入式数据库
│   └── 自定义DB封装 - 简化操作
│
├── 认证授权
│   ├── JWT - Token认证
│   ├── bcryptjs - 密码加密
│   └── 自定义中间件 - 权限控制
│
├── 文件处理
│   ├── Multer - 文件上传
│   ├── fs/path - 文件系统操作
│   └── 自定义存储策略
│
└── 其他服务
    ├── Nodemailer - 邮件发送
    └── Socket.io - 实时通信（预留）
```

---

## 🎨 功能模块设计

### 1. 用户认证与权限管理

#### 1.1 角色体系

| 角色 | 英文标识 | 权限范围 | 主要职责 |
|------|----------|----------|----------|
| **系统管理员** | admin | 全局管理 | 系统配置、用户管理、所有项目管理 |
| **项目经理** | project_manager | 项目范围 | 管理分配的项目、任务分配、进度跟踪 |
| **客户** | client | 自有项目 | 查看自己的项目、查看文档、发送消息 |

#### 1.2 权限矩阵

| 功能模块 | 管理员 | 项目经理 | 客户 |
|---------|--------|---------|------|
| **用户管理** |
| - 创建用户 | ✅ | ❌ | ❌ |
| - 编辑用户 | ✅ | ❌ | ❌ |
| - 删除用户 | ✅ | ❌ | ❌ |
| - 查看用户列表 | ✅ | ❌ | ❌ |
| **项目管理** |
| - 创建项目 | ✅ | ❌ | ❌ |
| - 编辑项目 | ✅ | ✅(自己的) | ❌ |
| - 删除项目 | ✅ | ❌ | ❌ |
| - 查看项目 | ✅(全部) | ✅(自己的) | ✅(自己的) |
| **任务管理** |
| - 创建任务 | ✅ | ✅(自己的项目) | ❌ |
| - 编辑任务 | ✅ | ✅(自己的项目) | ❌ |
| - 删除任务 | ✅ | ✅(自己的项目) | ❌ |
| - 查看任务 | ✅ | ✅ | ✅ |
| **文档管理** |
| - 上传文档 | ✅ | ✅(自己的项目) | ❌ |
| - 下载文档 | ✅ | ✅ | ✅ |
| - 删除文档 | ✅ | ✅(自己的项目) | ❌ |
| - 管理文件夹 | ✅ | ✅(自己的项目) | ❌ |
| **系统配置** |
| - 系统设置 | ✅ | ❌ | ❌ |
| - 邮件配置 | ✅ | ❌ | ❌ |
| - 项目配置 | ✅ | ❌ | ❌ |

#### 1.3 认证流程

```
┌──────────┐
│  登录请求 │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ 验证用户名/密码  │
└────┬────────────┘
     │
     ├─ 验证失败 → 返回错误
     │
     ├─ 验证成功
     ▼
┌─────────────────┐
│  生成JWT Token  │
│  - payload: {   │
│    userId       │
│    username     │
│    role         │
│    exp          │
│  }              │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  返回Token给客户端│
│  存储在localStorage│
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  后续请求携带    │
│  Authorization:  │
│  Bearer {token}  │
└─────────────────┘
```

#### 1.4 权限验证中间件

```javascript
// 基础认证
authenticateToken(req, res, next)

// 管理员权限
requireAdmin(req, res, next)

// 项目管理权限
requireProjectManagement(req, res, next)

// 资源所有者权限
requireOwnership(resourceType)(req, res, next)
```

---

### 2. 项目管理模块

#### 2.1 项目生命周期

```
规划中 (planning)
    ↓
进行中 (in_progress)
    ↓
    ├─→ 已暂停 (paused) ─→ 重新进行中
    │
    ├─→ 已完成 (completed)
    │
    └─→ 已取消 (cancelled)
```

#### 2.2 项目数据模型

```javascript
Project {
  // 基础信息
  id: Integer,
  name: String(100),          // 项目名称
  description: Text,          // 项目描述
  
  // 状态与优先级
  status: Enum,              // planning|in_progress|paused|completed|cancelled
  priority: Enum,            // low|medium|high|critical
  
  // 时间管理
  start_date: Date,          // 开始日期
  end_date: Date,            // 结束日期
  progress: Integer(0-100),  // 进度百分比
  
  // 人员关联
  client_id: Integer,        // 客户ID (FK)
  manager_id: Integer,       // 项目经理ID (FK)
  
  // 财务
  budget: Decimal(10,2),     // 预算金额
  
  // 审计字段
  created_at: DateTime,
  updated_at: DateTime
}
```

#### 2.3 项目卡片设计

**卡片布局**:
```
┌─────────────────────────────────────┐
│ 📋 项目名称          [状态] [优先级] │
│ ⭐ 默认标记（可选）                  │
├─────────────────────────────────────┤
│ 项目类型                             │
│ 项目描述（最多2行）                  │
├─────────────────────────────────────┤
│ 进度条 ████████░░ 65%               │
├─────────────────────────────────────┤
│ 项目经理: 张三                       │
│ 所属部门: 技术部                     │
│ 开始日期: 2025-01-01                │
│ 结束日期: 2025-12-31                │
│ 项目预算: ¥1,000,000                │
├─────────────────────────────────────┤
│ [✏️ 编辑]  [🗑️ 删除]               │
└─────────────────────────────────────┘
```

**默认项目机制**:
- 全局只能有一个默认项目
- 默认项目在选择器中自动选中
- 设置新默认项目时自动取消旧的

---

### 3. 任务管理模块

#### 3.1 任务状态流转

```
待办 (todo)
    ↓
进行中 (in_progress)
    ↓
    ├─→ 等待中 (pending) ─→ 继续进行中
    │
    ├─→ 已完成 (completed)
    │
    └─→ 已取消 (cancelled)
```

#### 3.2 任务数据模型

```javascript
Task {
  // 基础信息
  id: Integer,
  project_id: Integer(FK),   // 所属项目
  task_name: String(200),    // 任务名称
  description: Text,         // 任务描述
  
  // 状态与进度
  status: Enum,             // todo|in_progress|pending|completed|cancelled
  progress: Integer(0-100), // 进度百分比
  
  // 人员与层级
  assigned_to: Integer(FK), // 负责人ID
  parent_task_id: Integer(FK), // 父任务ID（支持子任务）
  
  // 时间管理
  start_date: Date,
  due_date: Date,
  completed_at: DateTime,
  
  // 审计字段
  created_at: DateTime,
  updated_at: DateTime
}
```

#### 3.3 甘特图设计

**时间轴布局**:
```
任务列表          │ 1月  │ 2月  │ 3月  │ 4月  │
─────────────────┼──────┼──────┼──────┼──────┤
需求分析         │ ████ │      │      │      │
系统设计         │   ██ │ ██   │      │      │
前端开发         │      │   ███│ ███  │      │
后端开发         │      │    ██│ ████ │      │
测试部署         │      │      │      │ ████ │
```

**交互功能**:
- 拖拽调整时间
- 点击查看详情
- 颜色标识状态
- 关键路径高亮

---

### 4. 文档管理模块

#### 4.1 文件夹树形结构

```
📁 项目A - 根目录
├── 📁 需求文档
│   ├── 📄 需求说明书.pdf
│   ├── 📄 原型设计.sketch
│   └── 📁 用户调研
│       ├── 📄 调研问卷.docx
│       └── 📄 访谈记录.txt
├── 📁 技术文档
│   ├── 📄 系统架构设计.pdf
│   ├── 📄 API接口文档.md
│   └── 📄 数据库设计.xlsx
├── 📁 交付物
│   ├── 📄 验收报告.pdf
│   └── 📄 用户手册.docx
└── 📄 项目计划.mpp
```

#### 4.2 文件夹数据模型

```javascript
DocumentFolder {
  id: Integer,
  project_id: Integer(FK),      // 所属项目
  name: String(255),            // 文件夹名称
  description: Text,            // 描述
  icon: String(50),             // 图标（emoji）
  color: String(50),            // 颜色标识
  parent_folder_id: Integer(FK), // 父文件夹ID
  created_by: Integer(FK),      // 创建者
  created_at: DateTime,
  updated_at: DateTime
}
```

#### 4.3 文档数据模型

```javascript
Document {
  id: Integer,
  project_id: Integer(FK),      // 所属项目
  folder_id: Integer(FK),       // 所属文件夹
  
  // 文件信息
  title: String(200),           // 文档标题
  file_path: String(500),       // 文件存储路径
  file_type: String(50),        // 文件类型（扩展名）
  file_size: Integer,           // 文件大小（字节）
  
  // 元数据
  version: String(20),          // 版本号
  category: String(50),         // 分类
  is_public: Boolean,           // 是否公开
  
  // 内容（文本型文档）
  content: Text,
  
  // 人员
  uploaded_by: Integer(FK),     // 上传者
  
  // 审计
  created_at: DateTime,
  updated_at: DateTime
}
```

#### 4.4 文档预览支持

| 文件类型 | 预览方式 | 支持操作 |
|---------|---------|---------|
| **PDF** | iframe嵌入 | 翻页、缩放、下载 |
| **Word** | Mammoth.js转换 | 文本渲染、下载 |
| **Excel** | SheetJS解析 | 表格展示、下载 |
| **图片** | img标签 | 查看、下载 |
| **文本** | 直接显示 | 查看、编辑、下载 |
| **Markdown** | marked.js渲染 | HTML展示、编辑 |
| **PPT** | 提示不支持 | 仅下载 |

#### 4.5 文件上传流程

```
┌────────────┐
│ 选择文件   │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ 验证文件   │
│ - 大小限制 │
│ - 类型限制 │
└─────┬──────┘
      │
      ├─ 验证失败 → 提示错误
      │
      ▼
┌────────────┐
│ 上传到服务器│
│ Multer处理 │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ 保存文件   │
│ /uploads/  │
│ project-{id}/│
└─────┬──────┘
      │
      ▼
┌────────────┐
│ 数据库记录 │
│ - 文件路径 │
│ - 元数据   │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ 返回成功   │
└────────────┘
```

---

### 5. 消息通讯模块

#### 5.1 消息类型

| 类型 | 标识 | 说明 | 示例 |
|------|------|------|------|
| 文本消息 | text | 普通文字消息 | "项目进度更新..." |
| 文件消息 | file | 附件消息 | 📎 设计稿.psd |
| 图片消息 | image | 图片分享 | 🖼️ 截图.png |
| 系统消息 | system | 系统通知 | "张三创建了新任务" |

#### 5.2 消息数据模型

```javascript
Message {
  id: Integer,
  project_id: Integer(FK),      // 所属项目
  sender_id: Integer(FK),       // 发送者
  message: Text,                // 消息内容
  message_type: Enum,           // text|file|image|system
  attachment_path: String(500), // 附件路径
  is_read: Boolean,             // 是否已读
  created_at: DateTime
}
```

#### 5.3 实时通信（预留）

**技术方案**: Socket.io  
**功能计划**:
- 实时消息推送
- 在线状态显示
- 输入状态提示
- 消息已读回执

---

### 6. 配置管理模块

#### 6.1 配置模块架构

```
配置管理
├── ⚙️ 系统配置
│   ├── 站点信息
│   ├── 邮件设置
│   └── 安全设置
├── 👥 用户管理
│   ├── 用户列表
│   ├── 角色管理
│   └── 权限分配
├── 🎯 项目配置（全局）
│   ├── 默认设置
│   ├── 工作时间
│   ├── 工作流程
│   ├── 通知规则
│   ├── 文档管理
│   ├── 显示偏好
│   └── 安全设置
├── 📧 邮件配置
│   ├── SMTP设置
│   ├── 发件人信息
│   └── 测试发送
└── 📝 邮件模板
    ├── 欢迎邮件
    ├── 通知邮件
    └── 报告邮件
```

#### 6.2 项目配置详解

**6.2.1 默认设置**
```javascript
{
  defaultPriority: 'medium',    // 默认优先级
  defaultStatus: 'planning',    // 默认状态
  defaultCurrency: 'CNY',       // 默认货币
  defaultTimeZone: 'Asia/Shanghai', // 默认时区
  autoAssignId: true,           // 自动分配编号
  enableVersionControl: true    // 启用版本控制
}
```

**6.2.2 工作时间**
```javascript
{
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workingHours: {
    start: '09:00',
    end: '18:00'
  },
  breakTime: {
    start: '12:00',
    end: '13:00'
  },
  overtimeEnabled: false
}
```

**6.2.3 文档管理（增强版）**
```javascript
{
  // 基础设置
  maxFileSize: 50,  // MB
  allowedFileTypes: ['pdf', 'doc', 'docx', ...],
  retentionDays: 365,
  
  // 预览设置
  previewableTypes: ['pdf', 'txt', 'md', 'doc', 'docx'],
  autoPreview: true,
  
  // 高级功能
  autoVersioning: true,
  requireApproval: false,
  compressionEnabled: true,
  downloadPermission: 'all'  // all|admin|none
}
```

**6.2.4 通知规则**
```javascript
{
  projectCreation: true,
  statusChange: true,
  milestoneReached: true,
  deadlineReminder: true,
  reminderDaysBefore: 3,
  emailNotifications: true,
  systemNotifications: true
}
```

---

### 7. 个人中心模块

#### 7.1 功能清单

| 功能 | 说明 | 实现状态 |
|------|------|---------|
| **个人信息** | 查看/编辑用户信息 | ✅ |
| **头像管理** | 上传/更换头像 | ✅ |
| **密码修改** | 修改登录密码 | ✅ |
| **通知设置** | 配置通知偏好 | ✅ |
| **安全设置** | 会话管理、登录历史 | 🔄 计划中 |

#### 7.2 通知设置

```javascript
NotificationSettings {
  user_id: Integer(FK),
  
  // 通知开关
  email_notifications: Boolean,      // 邮件通知
  task_notifications: Boolean,       // 任务通知
  project_notifications: Boolean,    // 项目通知
  document_notifications: Boolean,   // 文档通知
  system_notifications: Boolean,     // 系统通知
  comment_notifications: Boolean,    // 评论通知
  
  // 通知频率
  notification_frequency: Enum,      // immediate|hourly|daily|weekly
  
  // 免打扰时间
  quiet_hours_start: Time,
  quiet_hours_end: Time,
  
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## 🎨 UI/UX 设计规范

### 1. 设计原则

#### 1.1 视觉设计
- **配色方案**: 蓝紫渐变主题
  - 主色: `#667eea` → `#764ba2`
  - 辅助色: 状态色（成功、警告、错误、信息）
  - 背景: `#f5f5f5` / `#ffffff`
  
- **字体系统**:
  - 主字体: 系统默认字体栈
  - 字号: 12px - 28px（响应式）
  - 行高: 1.5 - 1.8

- **圆角**: 统一使用 8px/12px/16px
- **阴影**: 多层次阴影系统
  ```css
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);   /* 轻量 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* 标准 */
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);  /* 强调 */
  ```

#### 1.2 交互设计
- **响应速度**: 
  - 按钮点击: < 100ms 反馈
  - 页面加载: < 2s
  - API请求: < 500ms
  
- **动画过渡**: 
  - 标准过渡: 300ms ease
  - 快速过渡: 150ms ease
  - 慢速过渡: 500ms ease
  
- **反馈机制**:
  - 悬停效果（hover）
  - 点击效果（active）
  - 加载状态（loading）
  - 成功/错误提示（toast）

### 2. 组件设计规范

#### 2.1 按钮组件

**类型**:
```javascript
// 主要按钮
<button style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '12px 32px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600'
}}>
  保存
</button>

// 次要按钮
<button style={{
  background: 'white',
  color: '#667eea',
  border: '2px solid #667eea',
  padding: '12px 32px',
  borderRadius: '8px',
  cursor: 'pointer'
}}>
  取消
</button>

// 危险按钮
<button style={{
  background: '#e74c3c',
  color: 'white',
  padding: '12px 32px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer'
}}>
  删除
</button>
```

#### 2.2 卡片组件

**标准卡片**:
```javascript
<div style={{
  background: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease'
}}>
  {/* 内容 */}
</div>
```

#### 2.3 表单组件

**输入框**:
```javascript
<input style={{
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  transition: 'border-color 0.2s ease'
}} />
```

**下拉选择**:
```javascript
<select style={{
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  cursor: 'pointer'
}}>
  <option>选项1</option>
</select>
```

### 3. 响应式设计

#### 3.1 断点定义

```javascript
const breakpoints = {
  mobile: '768px',    // 移动端
  tablet: '1024px',   // 平板
  desktop: '1280px'   // 桌面端
};
```

#### 3.2 布局适配

**桌面端**:
- 侧边栏 + 主内容区
- 多列网格布局
- 悬浮操作栏

**移动端**:
- 全屏布局
- 底部导航栏
- 抽屉式菜单
- 单列布局

---

## 🔐 安全设计

### 1. 认证安全

#### 1.1 密码策略
```javascript
// 密码要求
const passwordPolicy = {
  minLength: 6,
  requireUppercase: false,  // 可选：要求大写
  requireLowercase: false,  // 可选：要求小写
  requireNumbers: false,    // 可选：要求数字
  requireSpecialChars: false // 可选：要求特殊字符
};

// 密码加密
bcrypt.hash(password, 10);  // 加密强度: 10
```

#### 1.2 Token 管理
```javascript
// JWT配置
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',        // 有效期
  algorithm: 'HS256'       // 加密算法
};

// Token刷新机制
if (tokenExpiresSoon) {
  refreshToken();
}
```

### 2. 数据安全

#### 2.1 SQL注入防护
```javascript
// ✅ 正确：使用参数化查询
db.get('SELECT * FROM users WHERE id = ?', [userId]);

// ❌ 错误：字符串拼接
db.get(`SELECT * FROM users WHERE id = ${userId}`);
```

#### 2.2 XSS防护
```javascript
// 输入验证
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// 输出转义
dangerouslySetInnerHTML={{__html: sanitizedContent}}
```

#### 2.3 文件上传安全
```javascript
// 文件类型白名单
const allowedTypes = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx',
  'ppt', 'pptx', 'txt', 'md',
  'jpg', 'jpeg', 'png', 'gif'
];

// 文件大小限制
const maxFileSize = 50 * 1024 * 1024; // 50MB

// 文件名安全处理
const safeName = filename
  .replace(/[<>:"/\\|?*]/g, '_')
  .replace(/\.\./g, '_');
```

### 3. API安全

#### 3.1 CORS配置
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:7076', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 3.2 请求限流
```javascript
// 使用 express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 最多100个请求
});

app.use('/api/', limiter);
```

---

## 📊 数据库设计

详见 [数据库设计文档](./database.md)

### 核心表概览

```
users (用户表)
  └─┬─ projects (项目表)
    ├─── project_progress (任务表)
    ├─┬─ document_folders (文件夹表)
    │ └─── documents (文档表)
    ├─── messages (消息表)
    └─── task_comments (评论表)

settings (系统设置表)
user_notification_settings (通知设置表)
```

---

## 🔄 开发流程

### 1. 分支管理

```
main (生产环境)
  └── develop (开发环境)
      ├── feature/user-management (功能分支)
      ├── feature/project-board (功能分支)
      ├── bugfix/login-issue (修复分支)
      └── hotfix/security-patch (紧急修复)
```

### 2. 开发规范

#### 2.1 代码风格
```javascript
// ✅ 使用ES6+语法
const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ✅ 使用有意义的变量名
const isUserAuthenticated = true;
const projectList = [];

// ❌ 避免使用无意义的变量名
const a = true;
const arr = [];
```

#### 2.2 注释规范
```javascript
/**
 * 获取项目列表
 * @param {number} userId - 用户ID
 * @param {string} status - 项目状态
 * @returns {Promise<Array>} 项目列表
 */
async function getProjects(userId, status) {
  // 实现代码
}
```

#### 2.3 错误处理
```javascript
// ✅ 统一错误处理
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error: error.message };
}

// API响应格式
{
  success: true,
  data: {...},
  message: 'Success'
}

// 错误响应
{
  success: false,
  error: 'Error message',
  code: 'ERROR_CODE'
}
```

### 3. 测试策略

#### 3.1 测试层次
```
单元测试 (Unit Tests)
  └── 组件测试 (Component Tests)
      └── 集成测试 (Integration Tests)
          └── E2E测试 (End-to-End Tests)
```

#### 3.2 测试工具
- **单元测试**: Jest
- **组件测试**: React Testing Library
- **E2E测试**: Cypress / Playwright
- **API测试**: Postman / Insomnia

---

## 🚀 部署方案

### 1. 服务器要求

**最低配置**:
- CPU: 2核
- 内存: 4GB
- 存储: 40GB SSD
- 带宽: 5Mbps
- 操作系统: Ubuntu 20.04+

**推荐配置**:
- CPU: 4核
- 内存: 8GB
- 存储: 100GB SSD
- 带宽: 10Mbps

### 2. 部署架构

```
┌─────────────────────────────────────┐
│          Nginx (反向代理)            │
│  - SSL/TLS 证书                      │
│  - 静态资源服务                      │
│  - 负载均衡 (可选)                   │
└──────────┬─────────────┬────────────┘
           │             │
    ┌──────▼──────┐  ┌──▼──────────┐
    │  前端应用   │  │  后端API    │
    │  (React)    │  │  (Express)  │
    │  Port: 7076 │  │  Port: 7080 │
    └─────────────┘  └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │   SQLite DB  │
                     │   (本地文件) │
                     └──────────────┘
```

### 3. Nginx 配置

```nginx
# /etc/nginx/sites-available/project-management

server {
    listen 80;
    server_name yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL 证书
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 前端静态资源
    location / {
        root /var/www/project-management/build;
        try_files $uri $uri/ /index.html;
        
        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:7080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 文件上传大小限制
    client_max_body_size 50M;
}
```

### 4. PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'project-management-api',
    script: './server/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 7080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

### 5. 部署步骤

```bash
# 1. 克隆代码
git clone https://github.com/your-repo/project-management.git
cd project-management

# 2. 安装依赖
npm install

# 3. 构建前端
npm run build

# 4. 初始化数据库
node server/init-db.js

# 5. 配置环境变量
cp .env.example .env
vim .env

# 6. 启动服务（使用PM2）
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 7. 配置Nginx
sudo cp nginx.conf /etc/nginx/sites-available/project-management
sudo ln -s /etc/nginx/sites-available/project-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. 配置SSL证书（Let's Encrypt）
sudo certbot --nginx -d yourdomain.com
```

### 6. 监控与维护

**监控指标**:
- 服务器资源（CPU、内存、磁盘）
- 应用性能（响应时间、错误率）
- 数据库性能（查询时间）
- 用户行为（访问量、活跃度）

**日志管理**:
```bash
# PM2 日志
pm2 logs project-management-api

# Nginx 访问日志
tail -f /var/log/nginx/access.log

# Nginx 错误日志
tail -f /var/log/nginx/error.log

# 应用日志
tail -f logs/app.log
```

**备份策略**:
```bash
# 数据库备份（每日定时）
0 2 * * * sqlite3 /path/to/project_management.db .dump > /backup/db_$(date +\%Y\%m\%d).sql

# 文件备份
0 3 * * * tar -czf /backup/uploads_$(date +\%Y\%m\%d).tar.gz /path/to/uploads/
```

---

## 📈 性能优化

### 1. 前端优化

#### 1.1 代码分割
```javascript
// 路由懒加载
const ProjectBoard = React.lazy(() => import('./ProjectBoard'));
const DocumentManager = React.lazy(() => import('./DocumentManager'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/projects" element={<ProjectBoard />} />
    <Route path="/documents" element={<DocumentManager />} />
  </Routes>
</Suspense>
```

#### 1.2 资源优化
- 图片压缩与懒加载
- CSS/JS 压缩
- Gzip 压缩
- CDN 加速（可选）

#### 1.3 缓存策略
```javascript
// Service Worker 缓存
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// LocalStorage 缓存
localStorage.setItem('cachedData', JSON.stringify(data));
```

### 2. 后端优化

#### 2.1 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_documents_project ON documents(project_id);

-- 查询优化
SELECT p.*, u.full_name as manager_name
FROM projects p
LEFT JOIN users u ON p.manager_id = u.id
WHERE p.status = 'in_progress'
LIMIT 20;
```

#### 2.2 API优化
- 分页查询
- 字段筛选
- 响应压缩
- 缓存策略

```javascript
// Redis 缓存（可选）
const cachedData = await redis.get(cacheKey);
if (cachedData) {
  return JSON.parse(cachedData);
}

const data = await fetchFromDatabase();
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5分钟过期
```

---

## 🔮 未来规划

### 短期计划 (1-3个月)

- [ ] **移动端优化**
  - 移动端专属界面
  - 触摸手势支持
  - 离线功能

- [ ] **实时协作**
  - WebSocket 实时通信
  - 在线状态显示
  - 协同编辑

- [ ] **高级报表**
  - 项目统计报表
  - 图表可视化
  - 数据导出

### 中期计划 (3-6个月)

- [ ] **工作流引擎**
  - 自定义工作流
  - 审批流程
  - 自动化规则

- [ ] **集成能力**
  - 第三方登录（OAuth）
  - 邮件系统集成
  - 云存储集成

- [ ] **多语言支持**
  - 国际化 (i18n)
  - 多时区支持

### 长期计划 (6-12个月)

- [ ] **微服务架构**
  - 服务拆分
  - API Gateway
  - 服务治理

- [ ] **AI 辅助**
  - 智能推荐
  - 自动分类
  - 风险预警

- [ ] **移动应用**
  - React Native App
  - Flutter App

---

## 📚 参考资源

### 技术文档
- [React 官方文档](https://react.dev/)
- [Express 官方文档](https://expressjs.com/)
- [SQLite 文档](https://www.sqlite.org/docs.html)
- [JWT 规范](https://jwt.io/)

### 设计资源
- [Material Design](https://material.io/)
- [Ant Design](https://ant.design/)
- [Color Hunt](https://colorhunt.co/)

### 最佳实践
- [JavaScript 代码规范](https://github.com/airbnb/javascript)
- [React 最佳实践](https://react.dev/learn)
- [RESTful API 设计](https://restfulapi.net/)

---

## 📝 附录

### A. 环境变量

```bash
# .env.example

# 服务器配置
NODE_ENV=production
PORT=7080
FRONTEND_PORT=7076

# JWT密钥
JWT_SECRET=your-secret-key-here

# 数据库
DB_PATH=./server/project_management.db

# 文件上传
UPLOAD_DIR=./server/uploads
MAX_FILE_SIZE=52428800

# 邮件配置
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
FROM_NAME=系统管理员
FROM_EMAIL=noreply@domain.com
```

### B. 常用命令

```bash
# 开发环境
npm run dev          # 启动开发服务器
npm run server       # 只启动后端
npm run client       # 只启动前端

# 生产环境
npm run build        # 构建前端
npm start            # 启动生产服务器

# 数据库
npm run init-db      # 初始化数据库
npm run migrate      # 运行迁移

# 测试
npm test             # 运行测试
npm run test:watch   # 监听模式测试

# 代码质量
npm run lint         # 代码检查
npm run format       # 代码格式化
```

### C. 故障排查

**常见问题**:

1. **端口占用**
```bash
# Windows
netstat -ano | findstr :7080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:7080 | xargs kill -9
```

2. **数据库锁定**
```bash
# 关闭所有连接
lsof | grep project_management.db
kill -9 [PID]
```

3. **前端无法连接后端**
- 检查 CORS 配置
- 检查 API 地址
- 检查防火墙设置

---

## 👥 团队协作

### 角色分工
- **项目经理**: 需求分析、进度管理
- **前端开发**: UI/UX 实现、交互优化
- **后端开发**: API 开发、数据库设计
- **测试工程师**: 功能测试、性能测试
- **运维工程师**: 服务器部署、监控维护

### 沟通机制
- **每日站会**: 15分钟同步进度
- **周会**: 回顾本周、计划下周
- **代码评审**: Pull Request Review
- **文档更新**: 及时同步到文档

---

**文档维护者**: 项目开发团队  
**创建日期**: 2025-10-22  
**最后更新**: 2025-10-22  
**文档版本**: 2.0.0

---

> 💡 **提示**: 本文档会持续更新，请定期查看最新版本。如有疑问或建议，请联系项目负责人。
