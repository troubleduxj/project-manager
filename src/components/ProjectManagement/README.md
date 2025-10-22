# 项目管理组件结构

## 组件架构

```
src/components/ProjectManagement/
├── ProjectManagementApp.js          # 主应用组件
├── components/
│   ├── TaskManagement.js           # 任务管理组件
│   ├── DocumentManagement.js       # 文档管理组件
│   └── ConfigManagement.js         # 配置管理组件
└── README.md                       # 本文档
```

## 组件说明

### ProjectManagementApp.js
- **功能**: 主应用入口，负责状态管理和路由
- **职责**: 
  - 用户认证和登录/注册
  - 项目数据获取和管理
  - 全局状态管理
  - 标签页切换逻辑

### TaskManagement.js
- **功能**: 任务管理界面
- **职责**:
  - 主任务列表展示
  - 子任务管理
  - 任务进度更新
  - 任务创建/编辑/删除

### DocumentManagement.js
- **功能**: 文档管理界面
- **职责**:
  - 项目文档展示和管理
  - 系统文档卡片管理
  - 文档上传/下载/预览
  - 文档卡片编辑功能

### ConfigManagement.js
- **功能**: 系统配置管理
- **职责**:
  - 系统设置配置
  - 用户个人偏好设置
  - 项目默认配置
  - 权限控制（仅管理员可访问）

## 数据流

1. **ProjectManagementApp** 作为主容器，管理所有全局状态
2. 子组件通过 props 接收数据和回调函数
3. 所有 API 调用都在主组件中处理
4. 子组件只负责 UI 展示和用户交互

## 优势

- **模块化**: 每个功能独立成组件，便于维护
- **可复用**: 组件可以在其他地方复用
- **可测试**: 每个组件可以独立测试
- **可扩展**: 新功能可以轻松添加新组件

## 使用方式

```javascript
// 在页面中使用
import ProjectManagementApp from '../components/ProjectManagement/ProjectManagementApp';

export default function ProjectManagement() {
  return <ProjectManagementApp />;
}
```
