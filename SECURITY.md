# 安全策略

## 🔒 安全机制

本项目采用多层安全保护：

### 1. 静态网站安全
- 网站为纯静态 HTML，访问者只能查看，无法修改
- 没有后端数据库，无注入攻击风险
- 没有用户上传功能，无文件上传漏洞

### 2. GitHub 权限控制
- 只有仓库 Owner 和 Collaborators 可以修改代码
- 所有修改都有 Git 历史记录可追溯
- Pull Request 需要审核才能合并

### 3. 服务器安全
- SSH 密钥认证，禁用密码登录
- 防火墙限制端口访问
- Nginx 只提供静态文件服务
- HTTPS 加密传输

### 4. 自动化部署安全
- GitHub Actions 使用加密 Secrets
- 只有推送到 main 分支才触发部署
- 部署日志完整记录

## 🛡️ 报告安全问题

如果你发现安全漏洞，请通过以下方式报告：

- **不要**公开提交 Issue
- 发送邮件到：your-email@example.com
- 使用 [GitHub Security Advisories](https://github.com/troubleduxj/DOCS-WEB/security/advisories)

## 📋 安全检查清单

### 服务器安全
- [ ] 启用防火墙（UFW）
- [ ] 禁用 SSH 密码登录
- [ ] 安装 fail2ban 防暴力破解
- [ ] 定期更新系统
- [ ] 配置 SSL 证书
- [ ] 限制 SSH 访问 IP

### GitHub 安全
- [ ] 启用两步验证（2FA）
- [ ] 配置分支保护规则
- [ ] 定期审查协作者权限
- [ ] 使用 Dependabot 检查依赖漏洞
- [ ] 保护 Secrets 不被泄露

### 应用安全
- [ ] 定期更新 Docusaurus 和依赖
- [ ] 审查所有 Pull Requests
- [ ] 使用 HTTPS
- [ ] 配置安全响应头
- [ ] 定期备份数据

## 🔄 更新日志

### 2025-10-12
- 初始安全策略文档
- 配置基础安全措施

## 📚 参考资源

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

