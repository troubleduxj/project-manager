---
sidebar_position: 1
---

# 安装

本文档介绍如何在本地搭建和运行文档系统。

## 前置要求

在开始之前，请确保你的系统已安装：

- **Node.js** 16.14 或更高版本
- **npm** 或 **yarn** 包管理器
- **Git** 版本控制工具

### 检查版本

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 Git 版本
git --version
```

## 克隆项目

首先，从 GitHub 克隆项目到本地：

```bash
git clone https://github.com/troubleduxj/DOCS-WEB.git
cd docs-web
```

## 安装依赖

使用 npm 安装项目依赖：

```bash
npm install
```

或者使用 yarn：

```bash
yarn install
```

:::tip 提示
首次安装可能需要几分钟时间，请耐心等待。
:::

## 启动开发服务器

安装完成后，启动本地开发服务器：

```bash
npm start
```

或者：

```bash
yarn start
```

这个命令会启动一个本地开发服务器并打开浏览器窗口。大多数更改都会实时反映，无需重启服务器。

默认访问地址：[http://localhost:3000](http://localhost:3000)

## 构建生产版本

当你准备部署到生产环境时，运行以下命令构建静态文件：

```bash
npm run build
```

生成的静态文件将保存在 `build` 目录中。

## 预览生产构建

构建完成后，你可以在本地预览生产版本：

```bash
npm run serve
```

这会启动一个本地静态文件服务器，让你可以预览生产构建的效果。

## 故障排除

### 端口被占用

如果 3000 端口已被占用，你可以指定其他端口：

```bash
npm start -- --port 3001
```

### 清除缓存

如果遇到构建问题，尝试清除缓存：

```bash
npm run clear
```

### 依赖问题

如果依赖安装失败，尝试删除 `node_modules` 目录和 `package-lock.json` 文件，然后重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

## 下一步

现在你已经成功安装并运行了文档系统，接下来：

- 📝 学习如何[配置文档系统](./configuration.md)
- ✍️ 了解如何[编写文档](../guides/writing-docs.md)
- 🚀 查看[部署指南](../guides/deployment.md)

