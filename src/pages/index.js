import React from 'react';
import Layout from '@theme/Layout';
import ProjectManagementApp from '../components/ProjectManagement/ProjectManagementApp';
import '../css/app.css';

export default function Home() {
  // 使用 Layout 包装，但隐藏导航栏和页脚
  return (
    <Layout 
      title="项目管理系统"
      description="高效的项目管理与团队协作平台"
      noFooter={true}
    >
      <ProjectManagementApp />
    </Layout>
  );
}