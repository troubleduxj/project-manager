import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    // 直接跳转到项目管理页面
    history.replace('/project-management');
  }, [history]);

  return null;
}