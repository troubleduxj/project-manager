---
sidebar_position: 2
---

# 配置

本文档介绍如何配置和自定义你的文档系统。

## 配置文件

主要的配置文件位于项目根目录：

### docusaurus.config.js

这是 Docusaurus 的主配置文件，包含了网站的基本信息和功能配置。

```javascript
module.exports = {
  title: '我的文档中心',
  tagline: '知识库与文档管理系统',
  url: 'https://yourdomain.com',
  baseUrl: '/',
  // ... 更多配置
};
```

#### 重要配置项

**基本信息**
- `title`: 网站标题
- `tagline`: 网站标语
- `url`: 生产环境 URL
- `favicon`: 网站图标

**GitHub 配置**
```javascript
organizationName: 'yourusername', // GitHub 用户名
projectName: 'docs-web',          // 仓库名
```

**国际化**
```javascript
i18n: {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en'],
}
```

### sidebars.js

侧边栏配置文件，定义文档的导航结构：

```javascript
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '快速开始',
      items: ['getting-started/installation'],
    },
  ],
};
```

## 自定义样式

### 修改主题颜色

编辑 `src/css/custom.css`：

```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
}
```

### 暗黑模式颜色

```css
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: #21af90;
  --ifm-color-primary-darker: #1fa588;
  --ifm-color-primary-darkest: #1a8870;
  --ifm-color-primary-light: #29d5b0;
  --ifm-color-primary-lighter: #32d8b4;
  --ifm-color-primary-lightest: #4fddbf;
}
```

## 搜索配置

### Algolia DocSearch

Algolia 提供免费的文档搜索服务：

1. 访问 [Algolia DocSearch](https://docsearch.algolia.com/apply/)
2. 提交你的网站申请
3. 收到配置信息后，更新 `docusaurus.config.js`：

```javascript
themeConfig: {
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_API_KEY',
    indexName: 'docs',
    contextualSearch: true,
  },
}
```

### 本地搜索

或者使用本地搜索插件：

```bash
npm install --save @easyops-cn/docusaurus-search-local
```

在 `docusaurus.config.js` 中配置：

```javascript
themes: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["zh", "en"],
      highlightSearchTermsOnTargetPage: true,
    },
  ],
],
```

## 导航栏配置

在 `docusaurus.config.js` 的 `themeConfig.navbar` 中配置：

```javascript
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
    {
      to: '/blog',
      label: '博客',
      position: 'left'
    },
    {
      href: 'https://github.com/yourusername/docs-web',
      label: 'GitHub',
      position: 'right',
    },
  ],
}
```

## 页脚配置

自定义页脚链接和版权信息：

```javascript
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
  ],
  copyright: `Copyright © ${new Date().getFullYear()} My Project.`,
}
```

## 插件配置

### Google Analytics

```javascript
presets: [
  [
    'classic',
    {
      gtag: {
        trackingID: 'G-XXXXXXXXXX',
      },
    },
  ],
],
```

### 百度统计

在 `docusaurus.config.js` 中添加：

```javascript
scripts: [
  {
    src: 'https://hm.baidu.com/hm.js?YOUR_KEY',
    async: true,
  },
],
```

## 环境变量

创建 `.env` 文件来存储敏感配置：

```bash
# .env
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
```

:::warning 注意
不要将 `.env` 文件提交到 Git 仓库！
:::

## 下一步

配置完成后，你可以：

- ✍️ 开始[编写文档](../guides/writing-docs.md)
- 🚀 了解如何[部署到生产环境](../guides/deployment.md)

