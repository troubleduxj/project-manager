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
  baseUrl: '/', // 本地开发使用 /，部署时改为 /project-manager/

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
      
      // 隐藏导航栏
      navbar: {
        hideOnScroll: false,
        items: [],
      },
      
      // 隐藏页脚
      footer: undefined,
      
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'nginx', 'yaml', 'json', 'javascript', 'typescript', 'sql'],
      },
    }),
};

module.exports = config;
