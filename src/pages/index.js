import React from 'react';
import ProjectManagementApp from '../components/ProjectManagement/ProjectManagementApp';
import '../css/app.css';

export default function Home() {
  // 直接渲染项目管理系统，无需跳转
  return <ProjectManagementApp />;
}