// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '项目管理系统',
  tagline: '高效的项目管理与团队协作平台',
  favicon: 'img/favicon.svg',

  // 生产环境 URL
  url: 'https://troubleduxj.github.io',
  baseUrl: '/project-manager/',

  // GitHub pages 部署配置
  organizationName: 'troubleduxj',
  projectName: 'project-manager',
  
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // 国际化配置
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, // 禁用文档功能
        blog: false, // 禁用博客功能
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/app.css'),
          ],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      
      navbar: {
        title: '项目管理系统',
        logo: {
          alt: 'Project Manager Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/project-management',
            label: '📊 项目管理',
            position: 'left',
          },
          {
            href: 'https://github.com/troubleduxj/project-manager',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      
      footer: {
        style: 'dark',
        links: [
          {
            title: '功能模块',
            items: [
              {
                label: '项目管理',
                to: '/project-management',
              },
            ],
          },
          {
            title: '文档',
            items: [
              {
                label: '快速开始',
                href: 'https://github.com/troubleduxj/project-manager#-快速开始',
              },
              {
                label: '系统设计',
                href: 'https://github.com/troubleduxj/project-manager/blob/main/docs/design.md',
              },
              {
                label: '数据库设计',
                href: 'https://github.com/troubleduxj/project-manager/blob/main/docs/database.md',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/troubleduxj/project-manager',
              },
              {
                label: '问题反馈',
                href: 'https://github.com/troubleduxj/project-manager/issues',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Project Manager. Built with ❤️`,
      },
      
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'nginx', 'yaml', 'json', 'javascript', 'typescript', 'sql'],
      },
    }),
};

module.exports = config;
