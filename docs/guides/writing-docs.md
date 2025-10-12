---
sidebar_position: 1
---

# 编写文档

本指南将教你如何使用 Markdown 和 MDX 编写高质量的文档。

## Markdown 基础

Docusaurus 使用 Markdown 作为主要的文档格式。

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

### 文本格式

```markdown
**粗体文本**
*斜体文本*
***粗斜体文本***
~~删除线~~
`行内代码`
```

### 列表

**无序列表**
```markdown
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
```

**有序列表**
```markdown
1. 第一项
2. 第二项
3. 第三项
```

### 链接和图片

```markdown
[链接文本](https://example.com)
![图片描述](./image.png)
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 值1 | 值2 | 值3 |
| 值4 | 值5 | 值6 |
```

## 代码块

### 基本代码块

````markdown
```javascript
function hello() {
  console.log('Hello, World!');
}
```
````

### 带标题的代码块

````markdown
```javascript title="hello.js"
function hello() {
  console.log('Hello, World!');
}
```
````

### 高亮行

````markdown
```javascript {2,4-6}
function hello() {
  // 这行会被高亮
  console.log('Hello, World!');
  // 这些行会被高亮
  const name = 'Docusaurus';
  return name;
}
```
````

## 告示框

Docusaurus 提供了五种告示框样式：

```markdown
:::note 注意
这是一个注意事项。
:::

:::tip 提示
这是一个提示。
:::

:::info 信息
这是一个信息提示。
:::

:::warning 警告
这是一个警告。
:::

:::danger 危险
这是一个危险警告。
:::
```

效果如下：

:::note 注意
这是一个注意事项。
:::

:::tip 提示
这是一个提示。
:::

:::info 信息
这是一个信息提示。
:::

:::warning 警告
这是一个警告。
:::

:::danger 危险
这是一个危险警告。
:::

## Front Matter

每个文档开头可以添加 Front Matter 来配置元数据：

```markdown
---
id: my-doc-id
title: 文档标题
sidebar_label: 侧边栏标题
sidebar_position: 1
tags: [demo, getting-started]
---

# 文档内容开始
```

### 常用字段

- `id`: 文档的唯一标识符
- `title`: 文档标题
- `sidebar_label`: 侧边栏显示的标题
- `sidebar_position`: 侧边栏中的位置
- `tags`: 文档标签
- `description`: 文档描述
- `keywords`: SEO 关键词

## 文档结构

### 创建文档

在 `docs` 目录下创建 `.md` 或 `.mdx` 文件：

```
docs/
├── intro.md
├── getting-started/
│   ├── installation.md
│   └── configuration.md
└── guides/
    ├── writing-docs.md
    └── deployment.md
```

### 文档导航

使用相对路径链接到其他文档：

```markdown
查看[安装指南](../getting-started/installation.md)
或[部署文档](./deployment.md)
```

## MDX 高级功能

MDX 允许你在 Markdown 中使用 React 组件。

### 导入组件

```mdx
import CustomComponent from '@site/src/components/CustomComponent';

<CustomComponent />
```

### 使用变量

```mdx
export const name = 'Docusaurus';

你好，{name}！
```

### 交互式组件

使用 Tabs 组件：

```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="npm" label="npm">
    npm install
  </TabItem>
  <TabItem value="yarn" label="Yarn">
    yarn install
  </TabItem>
</Tabs>
```

## 图片管理

### 静态图片

将图片放在 `static/img` 目录下：

```markdown
![Logo](/img/logo.png)
```

### 相对路径

或者使用相对路径：

```markdown
![示例图片](./images/example.png)
```

## 文档版本控制

### 创建版本

```bash
npm run docusaurus docs:version 1.0.0
```

这会：
1. 复制 `docs` 目录到 `versioned_docs/version-1.0.0`
2. 创建 `versions.json` 文件

### 版本管理

```
docs/                    # 最新版本（next）
versioned_docs/
  └── version-1.0.0/    # 历史版本
versioned_sidebars/
  └── version-1.0.0-sidebars.json
versions.json           # 版本列表
```

## 最佳实践

### 1. 使用清晰的标题层级

保持标题层级的逻辑性，不要跳级。

### 2. 添加目录

长文档建议添加目录：

```markdown
## 目录

- [安装](#安装)
- [配置](#配置)
- [使用](#使用)
```

### 3. 使用告示框

重要信息使用告示框突出显示。

### 4. 提供代码示例

每个功能都应该有清晰的代码示例。

### 5. 保持更新

定期检查和更新文档内容。

## 本地预览

编写时随时预览效果：

```bash
npm start
```

保存文件后，浏览器会自动刷新显示最新内容。

## 下一步

- 🚀 学习如何[部署文档](./deployment.md)
- 📖 查看 [Docusaurus 官方文档](https://docusaurus.io/docs/markdown-features)

