# 📊 项目管理系统 - 数据库设计文档

## 概述

**数据库类型**: SQLite  
**数据库文件**: `server/project_management.db`  
**字符编码**: UTF-8  
**创建日期**: 2025-10-22  
**版本**: 1.0.0

---

## 数据库架构

### 核心模块

```
项目管理系统数据库
├── 用户与权限管理
│   ├── users (用户表)
│   └── user_notification_settings (用户通知设置)
├── 项目管理
│   ├── projects (项目表)
│   └── project_progress (项目任务/进度表)
├── 文档管理
│   ├── documents (文档表)
│   └── document_folders (文档文件夹表)
├── 消息通讯
│   ├── messages (消息表)
│   └── task_comments (任务评论表)
└── 系统配置
    └── settings (系统设置表)
```

---

## 数据表详细设计

### 1. 👤 users (用户表)

**用途**: 存储系统所有用户信息，包括管理员、项目经理、客户等

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 用户ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | - | 用户名（登录用） |
| email | VARCHAR(100) | UNIQUE, NOT NULL | - | 邮箱地址 |
| password | VARCHAR(255) | NOT NULL | - | 密码（bcrypt加密） |
| role | VARCHAR(20) | - | 'client' | 角色：admin/project_manager/client |
| full_name | VARCHAR(100) | - | NULL | 用户全名 |
| avatar | VARCHAR(255) | - | NULL | 头像URL或路径 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- UNIQUE INDEX on `username`
- UNIQUE INDEX on `email`
- INDEX on `role`

**角色说明**:
- `admin`: 系统管理员，拥有所有权限
- `project_manager`: 项目经理，可管理分配给自己的项目
- `client`: 客户，只能查看自己的项目

**默认用户**:
```sql
-- 管理员
username: admin
password: admin123
email: admin@example.com
role: admin

-- 示例客户
username: client
password: client123
email: client@example.com
role: client
```

---

### 2. 📁 projects (项目表)

**用途**: 存储项目基本信息

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 项目ID |
| name | VARCHAR(100) | NOT NULL | - | 项目名称 |
| description | TEXT | - | NULL | 项目描述 |
| status | VARCHAR(20) | - | 'planning' | 项目状态 |
| priority | VARCHAR(10) | - | 'medium' | 优先级 |
| start_date | DATE | - | NULL | 开始日期 |
| end_date | DATE | - | NULL | 结束日期 |
| client_id | INTEGER | FOREIGN KEY | NULL | 客户ID |
| manager_id | INTEGER | FOREIGN KEY | NULL | 项目经理ID |
| progress | INTEGER | - | 0 | 项目进度(0-100) |
| budget | DECIMAL(10,2) | - | NULL | 项目预算 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**外键约束**:
- `client_id` → `users(id)`
- `manager_id` → `users(id)`

**项目状态枚举**:
- `planning`: 规划中
- `in_progress`: 进行中
- `paused`: 已暂停
- `completed`: 已完成
- `cancelled`: 已取消

**优先级枚举**:
- `low`: 低
- `medium`: 中
- `high`: 高
- `critical`: 紧急

**索引**:
- INDEX on `client_id`
- INDEX on `manager_id`
- INDEX on `status`
- INDEX on `priority`

---

### 3. 📋 project_progress (项目任务/进度表)

**用途**: 存储项目的任务和进度信息，支持任务层级结构

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 任务ID |
| project_id | INTEGER | NOT NULL, FOREIGN KEY | - | 所属项目ID |
| task_name | VARCHAR(200) | NOT NULL | - | 任务名称 |
| description | TEXT | - | NULL | 任务描述 |
| status | VARCHAR(20) | - | 'todo' | 任务状态 |
| progress | INTEGER | - | 0 | 任务进度(0-100) |
| assigned_to | INTEGER | FOREIGN KEY | NULL | 负责人ID |
| parent_task_id | INTEGER | FOREIGN KEY | NULL | 父任务ID（支持子任务） |
| start_date | DATE | - | NULL | 开始日期 |
| due_date | DATE | - | NULL | 截止日期 |
| completed_at | DATETIME | - | NULL | 完成时间 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**外键约束**:
- `project_id` → `projects(id)`
- `assigned_to` → `users(id)`
- `parent_task_id` → `project_progress(id)` (自引用)

**任务状态枚举**:
- `todo`: 待办
- `in_progress`: 进行中
- `pending`: 等待中
- `completed`: 已完成
- `cancelled`: 已取消

**索引**:
- INDEX on `project_id`
- INDEX on `assigned_to`
- INDEX on `parent_task_id`
- INDEX on `status`
- INDEX on `due_date`

---

### 4. 📂 document_folders (文档文件夹表)

**用途**: 存储文档的文件夹层级结构

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 文件夹ID |
| project_id | INTEGER | NOT NULL, FOREIGN KEY | - | 所属项目ID |
| name | VARCHAR(255) | NOT NULL | - | 文件夹名称 |
| description | TEXT | - | NULL | 文件夹描述 |
| icon | VARCHAR(50) | - | NULL | 文件夹图标（emoji） |
| color | VARCHAR(50) | - | NULL | 文件夹颜色 |
| parent_folder_id | INTEGER | FOREIGN KEY | NULL | 父文件夹ID |
| created_by | INTEGER | FOREIGN KEY | NULL | 创建者ID |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**外键约束**:
- `project_id` → `projects(id)` ON DELETE CASCADE
- `parent_folder_id` → `document_folders(id)` ON DELETE CASCADE
- `created_by` → `users(id)` ON DELETE SET NULL

**特殊说明**:
- 每个项目自动创建一个"根目录"文件夹
- 支持无限层级的文件夹嵌套
- 删除父文件夹会级联删除所有子文件夹

**索引**:
- INDEX on `project_id`
- INDEX on `parent_folder_id`

---

### 5. 📄 documents (文档表)

**用途**: 存储项目文档信息

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 文档ID |
| project_id | INTEGER | NOT NULL, FOREIGN KEY | - | 所属项目ID |
| title | VARCHAR(200) | NOT NULL | - | 文档标题 |
| content | TEXT | - | NULL | 文档内容（文本型） |
| file_path | VARCHAR(500) | - | NULL | 文件路径 |
| file_type | VARCHAR(50) | - | NULL | 文件类型（扩展名） |
| file_size | INTEGER | - | NULL | 文件大小（字节） |
| version | VARCHAR(20) | - | '1.0' | 文档版本号 |
| category | VARCHAR(50) | - | NULL | 文档分类 |
| is_public | BOOLEAN | - | 0 | 是否公开 |
| uploaded_by | INTEGER | FOREIGN KEY | NULL | 上传者ID |
| folder_id | INTEGER | FOREIGN KEY | NULL | 所属文件夹ID |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**外键约束**:
- `project_id` → `projects(id)`
- `uploaded_by` → `users(id)`
- `folder_id` → `document_folders(id)` ON DELETE SET NULL

**文件类型支持**:
- 文档: pdf, doc, docx, txt, md
- 表格: xls, xlsx
- 演示: ppt, pptx
- 图片: jpg, jpeg, png, gif
- 压缩: zip, rar

**索引**:
- INDEX on `project_id`
- INDEX on `folder_id`
- INDEX on `uploaded_by`
- INDEX on `file_type`
- INDEX on `category`

**统计查询**:
```sql
-- 获取文档总数
SELECT COUNT(*) FROM documents;

-- 获取总存储大小
SELECT SUM(file_size) FROM documents;

-- 获取本月上传数量
SELECT COUNT(*) FROM documents 
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
```

---

### 6. 💬 messages (消息表)

**用途**: 存储项目相关的消息通讯记录

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 消息ID |
| project_id | INTEGER | NOT NULL, FOREIGN KEY | - | 所属项目ID |
| sender_id | INTEGER | NOT NULL, FOREIGN KEY | - | 发送者ID |
| message | TEXT | NOT NULL | - | 消息内容 |
| message_type | VARCHAR(20) | - | 'text' | 消息类型 |
| attachment_path | VARCHAR(500) | - | NULL | 附件路径 |
| is_read | BOOLEAN | - | 0 | 是否已读 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 发送时间 |

**外键约束**:
- `project_id` → `projects(id)`
- `sender_id` → `users(id)`

**消息类型枚举**:
- `text`: 纯文本消息
- `file`: 文件附件
- `image`: 图片
- `system`: 系统通知

**索引**:
- INDEX on `project_id`
- INDEX on `sender_id`
- INDEX on `is_read`
- INDEX on `created_at`

---

### 7. 💭 task_comments (任务评论表)

**用途**: 存储任务的评论和讨论

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 评论ID |
| task_id | INTEGER | NOT NULL, FOREIGN KEY | - | 任务ID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | - | 评论者ID |
| content | TEXT | NOT NULL | - | 评论内容 |
| mentioned_users | TEXT | - | NULL | @提及的用户ID（JSON数组） |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 评论时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**外键约束**:
- `task_id` → `project_progress(id)`
- `user_id` → `users(id)`

**特殊字段说明**:
- `mentioned_users`: JSON格式存储，例如: `"[1, 3, 5]"`

**索引**:
- INDEX on `task_id`
- INDEX on `user_id`
- INDEX on `created_at`

---

### 8. 🔔 user_notification_settings (用户通知设置表)

**用途**: 存储每个用户的通知偏好设置

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 设置ID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | - | 用户ID |
| email_notifications | BOOLEAN | - | 1 | 启用邮件通知 |
| task_notifications | BOOLEAN | - | 1 | 任务通知 |
| project_notifications | BOOLEAN | - | 1 | 项目通知 |
| document_notifications | BOOLEAN | - | 1 | 文档通知 |
| system_notifications | BOOLEAN | - | 1 | 系统通知 |
| comment_notifications | BOOLEAN | - | 1 | 评论通知 |
| notification_frequency | VARCHAR(20) | - | 'immediate' | 通知频率 |
| quiet_hours_start | TIME | - | '22:00' | 免打扰开始时间 |
| quiet_hours_end | TIME | - | '08:00' | 免打扰结束时间 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**外键约束**:
- `user_id` → `users(id)` ON DELETE CASCADE

**通知频率枚举**:
- `immediate`: 立即通知
- `hourly`: 每小时汇总
- `daily`: 每日汇总
- `weekly`: 每周汇总

**索引**:
- UNIQUE INDEX on `user_id`

---

### 9. ⚙️ settings (系统设置表)

**用途**: 存储系统全局配置

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | 设置ID |
| key | VARCHAR(100) | UNIQUE, NOT NULL | - | 配置键 |
| value | TEXT | - | NULL | 配置值 |
| description | TEXT | - | NULL | 配置说明 |
| created_at | DATETIME | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | CURRENT_TIMESTAMP | 更新时间 |

**索引**:
- UNIQUE INDEX on `key`

**系统配置项**:

#### 基础配置
| Key | Value | 说明 |
|-----|-------|------|
| site_name | 项目管理系统 | 网站名称 |
| site_description | 专业的项目管理与文档查看系统 | 网站描述 |
| max_file_size | 10485760 | 最大文件上传大小（10MB） |
| allowed_file_types | pdf,doc,docx,txt,md,jpg,png,gif | 允许的文件类型 |

#### 邮件配置（SMTP）
| Key | Value | 说明 |
|-----|-------|------|
| smtp_host | smtp.exmail.qq.com | SMTP服务器地址 |
| smtp_port | 465 | SMTP端口 |
| smtp_user | xj.du@hanatech.com.cn | SMTP用户名 |
| smtp_pass | ******** | SMTP密码 |
| from_name | 杜晓军 | 发件人名称 |
| from_email | xj.du@hanatech.com.cn | 发件人邮箱 |
| test_email | duxiaojun1983@163.com | 测试邮箱 |
| enable_ssl | true | 启用SSL |
| enable_tls | false | 启用TLS |

---

## 数据库关系图

```
┌─────────────────┐
│     users       │
│  (用户表)       │
└────────┬────────┘
         │
         │ 1:N
         ├──────────────┬──────────────┬──────────────┐
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  projects   │  │  documents  │  │  messages   │  │task_comments│
│  (项目表)   │  │  (文档表)   │  │  (消息表)   │  │  (评论表)   │
└──────┬──────┘  └──────┬──────┘  └─────────────┘  └─────────────┘
       │                │
       │ 1:N            │ 1:N
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│project_     │  │document_    │
│progress     │  │folders      │
│(任务表)     │  │(文件夹表)   │
└─────────────┘  └──────┬──────┘
                        │
                        │ N:1
                        └──────→ (folder_id)
```

---

## 初始化脚本

### 运行初始化

```bash
# 初始化数据库和表结构
node server/init-db.js
```

### 运行迁移

```bash
# 添加文档文件夹功能
node server/migrations/add-document-folders.js
```

---

## 数据库操作类

### 连接数据库

```javascript
const database = require('./database/db');

// 连接
await database.connect();

// 查询单条
const user = await database.get('SELECT * FROM users WHERE id = ?', [userId]);

// 查询多条
const projects = await database.all('SELECT * FROM projects WHERE client_id = ?', [clientId]);

// 执行更新
await database.run('UPDATE projects SET status = ? WHERE id = ?', ['completed', projectId]);

// 关闭连接
await database.close();
```

---

## 常用查询示例

### 用户相关

```sql
-- 获取所有项目经理
SELECT * FROM users WHERE role = 'project_manager';

-- 获取用户及其项目数量
SELECT u.*, COUNT(p.id) as project_count
FROM users u
LEFT JOIN projects p ON u.id = p.manager_id
GROUP BY u.id;
```

### 项目相关

```sql
-- 获取进行中的项目
SELECT * FROM projects WHERE status = 'in_progress';

-- 获取项目及其负责人信息
SELECT p.*, u.full_name as manager_name
FROM projects p
LEFT JOIN users u ON p.manager_id = u.id;

-- 获取项目进度统计
SELECT 
  project_id,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  AVG(progress) as avg_progress
FROM project_progress
GROUP BY project_id;
```

### 文档相关

```sql
-- 获取项目文档及文件夹信息
SELECT d.*, f.name as folder_name
FROM documents d
LEFT JOIN document_folders f ON d.folder_id = f.id
WHERE d.project_id = ?;

-- 获取文件夹树形结构
WITH RECURSIVE folder_tree AS (
  SELECT id, name, parent_folder_id, 0 as level
  FROM document_folders
  WHERE parent_folder_id IS NULL AND project_id = ?
  
  UNION ALL
  
  SELECT f.id, f.name, f.parent_folder_id, ft.level + 1
  FROM document_folders f
  JOIN folder_tree ft ON f.parent_folder_id = ft.id
)
SELECT * FROM folder_tree ORDER BY level, name;
```

### 任务相关

```sql
-- 获取即将到期的任务
SELECT * FROM project_progress
WHERE due_date BETWEEN date('now') AND date('now', '+7 days')
  AND status != 'completed'
ORDER BY due_date;

-- 获取用户的任务统计
SELECT 
  assigned_to,
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
FROM project_progress
GROUP BY assigned_to;
```

---

## 性能优化建议

### 1. 索引优化

```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_manager ON projects(manager_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_tasks_assigned ON project_progress(assigned_to);
CREATE INDEX idx_tasks_due_date ON project_progress(due_date);
```

### 2. 查询优化

- 避免使用 `SELECT *`，只查询需要的字段
- 使用 JOIN 代替子查询
- 使用 LIMIT 限制返回记录数
- 为大表添加分页查询

### 3. 数据维护

```sql
-- 定期清理已删除项目的相关数据
DELETE FROM project_progress WHERE project_id NOT IN (SELECT id FROM projects);

-- 清理旧消息（保留3个月）
DELETE FROM messages WHERE created_at < date('now', '-3 months');

-- 分析表以优化查询性能
ANALYZE;
```

---

## 备份与恢复

### 备份数据库

```bash
# SQLite 备份
sqlite3 server/project_management.db .dump > backup.sql

# 或者直接复制数据库文件
cp server/project_management.db backup/project_management_$(date +%Y%m%d).db
```

### 恢复数据库

```bash
# 从 SQL 文件恢复
sqlite3 server/project_management.db < backup.sql

# 或者直接替换数据库文件
cp backup/project_management_20251022.db server/project_management.db
```

---

## 数据迁移

### 迁移历史

| 版本 | 日期 | 文件 | 说明 |
|------|------|------|------|
| 1.0.0 | 2025-10-22 | init-db.js | 初始数据库结构 |
| 1.1.0 | 2025-10-22 | add-document-folders.js | 添加文档文件夹功能 |

### 创建新迁移

1. 在 `server/migrations/` 目录创建新文件
2. 命名格式: `descriptive-name.js`
3. 参考现有迁移文件编写迁移逻辑
4. 在主文档更新迁移历史

---

## 安全注意事项

### 1. SQL注入防护

✅ **正确做法** - 使用参数化查询：
```javascript
await database.get('SELECT * FROM users WHERE username = ?', [username]);
```

❌ **错误做法** - 字符串拼接：
```javascript
await database.get(`SELECT * FROM users WHERE username = '${username}'`);
```

### 2. 密码安全

- 使用 bcrypt 加密密码（加密强度: 10）
- 永不存储明文密码
- 密码字段类型: VARCHAR(255)

### 3. 数据访问控制

- 项目经理只能访问自己管理的项目
- 客户只能访问自己的项目
- 管理员拥有所有权限

---

## 故障排查

### 常见问题

**1. 数据库文件锁定**
```bash
# 关闭所有连接
lsof | grep project_management.db
kill -9 [PID]
```

**2. 表不存在**
```bash
# 重新运行初始化脚本
node server/init-db.js
```

**3. 外键约束错误**
```sql
-- 检查外键约束
PRAGMA foreign_keys;

-- 启用外键约束
PRAGMA foreign_keys = ON;
```

---

## 未来扩展计划

### 计划功能

- [ ] 添加项目模板表
- [ ] 添加工时记录表
- [ ] 添加文档版本历史表
- [ ] 添加系统审计日志表
- [ ] 添加用户活动统计表
- [ ] 支持项目标签/标记
- [ ] 支持任务依赖关系

### 性能提升

- [ ] 考虑迁移到 PostgreSQL（支持更大规模）
- [ ] 实施数据库读写分离
- [ ] 添加 Redis 缓存层
- [ ] 实施分表策略（按时间分表）

---

## 参考资源

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [Node.js sqlite3 库](https://github.com/TryGhost/node-sqlite3)
- [数据库设计最佳实践](https://www.sqlitetutorial.net/)

---

**维护者**: 项目开发团队  
**最后更新**: 2025-10-22  
**文档版本**: 1.0.0

