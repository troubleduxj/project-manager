import React from 'react';
import Layout from '@theme/Layout';
import ProjectManagementApp from '../components/ProjectManagement/ProjectManagementApp';
import '../css/app.css';

export default function ProjectManagement() {
  return (
    <Layout 
      title="项目管理"
      description="项目管理系统"
      noFooter={true}
    >
      <ProjectManagementApp />
    </Layout>
  );
}