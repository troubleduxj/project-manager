import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            📚 开始阅读 - 5分钟⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

const FeatureList = [
  {
    title: '📝 易于使用',
    description: (
      <>
        使用简单的 Markdown 语法编写文档，专注于内容创作。
        Docusaurus 会处理其他一切，让你的文档看起来专业美观。
      </>
    ),
  },
  {
    title: '🔍 强大搜索',
    description: (
      <>
        集成全文搜索功能，快速找到你需要的内容。
        支持 Algolia DocSearch 和本地搜索。
      </>
    ),
  },
  {
    title: '🚀 快速部署',
    description: (
      <>
        使用 GitHub Actions 自动化部署，推送代码即可发布。
        支持多种部署平台，包括腾讯云、Vercel、Netlify 等。
      </>
    ),
  },
  {
    title: '📱 响应式设计',
    description: (
      <>
        完美适配各种设备，从手机到桌面。
        提供亮色和暗色两种主题模式。
      </>
    ),
  },
  {
    title: '📚 版本管理',
    description: (
      <>
        支持多版本文档管理，轻松维护历史版本。
        用户可以在不同版本之间自由切换。
      </>
    ),
  },
  {
    title: '🌐 国际化',
    description: (
      <>
        内置多语言支持，轻松创建多语言文档。
        当前支持中文和英文。
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="现代化的文档管理系统">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

