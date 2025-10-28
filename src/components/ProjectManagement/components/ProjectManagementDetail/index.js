import React, { useState, useEffect } from 'react';
import ProjectInfo from './components/ProjectInfo';
import ProjectEditDialog from './components/ProjectEditDialog';
import MemberManagement from './components/MemberManagement';
import ServerManagement from './components/ServerManagement';
import ResourceManagement from './components/ResourceManagement';
import { getFilteredMembers, getFilteredServers, getFilteredResources } from './utils/filterUtils';

const ProjectManagementDetail = ({ user, selectedProject, isMobile }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [servers, setServers] = useState([]);
  const [resources, setResources] = useState([]);
  const [showDialog, setShowDialog] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(null);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectDetails();
    }
    fetchManagers();
  }, [selectedProject]);

  // 当projects加载完成后，自动选择默认项目
  useEffect(() => {
    if (projects.length > 0 && selectedProjectFilter === null) {
      const defaultProject = projects.find(p => p.isDefault);
      if (defaultProject) {
        setSelectedProjectFilter(defaultProject.id);
      } else {
        setSelectedProjectFilter(projects[0].id);
      }
    }
  }, [projects, selectedProjectFilter]);

  // 获取项目经理列表
  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // 筛选出项目经理和管理员
        const managerList = data.filter(u => 
          u.role === 'project_manager' || u.role === 'admin'
        );
        setManagers(managerList || []);
      }
    } catch (error) {
      console.error('获取项目经理列表失败:', error);
    }
  };

  const fetchProjectDetails = async () => {
    // 模拟数据，实际应从API获取
    setProjects([
      {
        id: 1,
        name: '项目管理系统',
        description: '企业级项目管理平台，支持任务管理、文档管理、进度跟踪等功能',
        status: '进行中',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        progress: 65,
        budget: '1000000',
        department: '技术部',
        priority: '高',
        type: '软件开发',
        customer: '某某公司',
        manager: '张三',
        team: '技术团队A组',
        isDefault: true
      },
      {
        id: 2,
        name: '数据分析平台',
        description: '大数据分析与可视化平台，支持实时数据处理和智能分析',
        status: '进行中',
        startDate: '2025-02-01',
        endDate: '2025-11-30',
        progress: 40,
        budget: '1500000',
        department: '数据部',
        priority: '高',
        type: '数据分析',
        customer: '某某集团',
        manager: '李四',
        team: '数据团队B组',
        isDefault: false
      },
      {
        id: 3,
        name: '移动应用开发',
        description: '跨平台移动应用，支持iOS和Android双平台',
        status: '进行中',
        startDate: '2025-03-01',
        endDate: '2025-10-31',
        progress: 30,
        budget: '800000',
        department: '移动部',
        priority: '中',
        type: '移动开发',
        customer: '某某科技',
        manager: '王五',
        team: '移动团队C组',
        isDefault: false
      },
      {
        id: 4,
        name: '云存储系统',
        description: '企业级云存储解决方案，支持海量数据存储和高速访问',
        status: '已完成',
        startDate: '2024-06-01',
        endDate: '2024-12-31',
        progress: 100,
        budget: '2000000',
        department: '云计算部',
        priority: '高',
        type: '云服务',
        customer: '某某企业',
        manager: '赵六',
        team: '云计算团队D组',
        isDefault: false
      },
      {
        id: 5,
        name: '智能客服系统',
        description: 'AI驱动的智能客服平台，支持自然语言处理和自动回复',
        status: '规划中',
        startDate: '2025-05-01',
        endDate: '2026-04-30',
        progress: 10,
        budget: '1200000',
        department: 'AI部',
        priority: '中',
        type: 'AI应用',
        customer: '某某集团',
        manager: '孙七',
        team: 'AI团队E组',
        isDefault: false
      },
      {
        id: 6,
        name: '电商平台',
        description: '全功能电商平台，支持商品管理、订单处理、支付集成等',
        status: '进行中',
        startDate: '2025-01-15',
        endDate: '2025-09-30',
        progress: 55,
        budget: '1800000',
        department: '电商部',
        priority: '高',
        type: '电商系统',
        customer: '某某商城',
        manager: '周八',
        team: '电商团队F组',
        isDefault: false
      }
    ]);

    setMembers([
      { id: 1, name: '张三', role: '项目经理', department: '技术部', phone: '13800138001', email: 'zhangsan@example.com', joinDate: '2025-01-01', status: '在职', projectId: 1 },
      { id: 2, name: '李四', role: '开发工程师', department: '技术部', phone: '13800138002', email: 'lisi@example.com', joinDate: '2025-01-05', status: '在职', projectId: 1 },
      { id: 3, name: '王五', role: '测试工程师', department: '质量部', phone: '13800138003', email: 'wangwu@example.com', joinDate: '2025-01-10', status: '在职', projectId: 2 },
      { id: 4, name: '赵六', role: '架构师', department: '技术部', phone: '13800138004', email: 'zhaoliu@example.com', joinDate: '2024-06-01', status: '在职', projectId: 4 },
      { id: 5, name: '孙七', role: 'AI工程师', department: 'AI部', phone: '13800138005', email: 'sunqi@example.com', joinDate: '2025-04-01', status: '在职', projectId: 5 }
    ]);

    setServers([
      { id: 1, name: '生产服务器', ip: '192.168.1.100', type: 'Linux', cpu: '16核', memory: '32GB', disk: '500GB SSD', status: '运行中', purpose: 'Web服务', projectId: 1 },
      { id: 2, name: '数据库服务器', ip: '192.168.1.101', type: 'Linux', cpu: '32核', memory: '64GB', disk: '1TB SSD', status: '运行中', purpose: '数据库', projectId: 1 },
      { id: 3, name: '测试服务器', ip: '192.168.1.102', type: 'Windows', cpu: '8核', memory: '16GB', disk: '250GB SSD', status: '运行中', purpose: '测试环境', projectId: 2 },
      { id: 4, name: '云存储服务器', ip: '192.168.1.103', type: 'Linux', cpu: '64核', memory: '128GB', disk: '2TB SSD', status: '运行中', purpose: '云存储', projectId: 4 }
    ]);

    setResources([
      { id: 1, name: 'Node.js', version: 'v18.17.0', type: '运行环境', license: 'MIT', updateDate: '2024-12-01', description: 'JavaScript运行环境', projectId: 1 },
      { id: 2, name: 'React', version: '18.2.0', type: '前端框架', license: 'MIT', updateDate: '2024-11-15', description: '用户界面库', projectId: 1 },
      { id: 3, name: 'Express', version: '4.18.2', type: '后端框架', license: 'MIT', updateDate: '2024-10-20', description: 'Node.js Web框架', projectId: 1 },
      { id: 4, name: 'SQLite', version: '3.43.0', type: '数据库', license: 'Public Domain', updateDate: '2024-09-10', description: '轻量级数据库', projectId: 1 },
      { id: 5, name: 'Python', version: '3.11', type: '运行环境', license: 'PSF', updateDate: '2024-10-01', description: 'Python解释器', projectId: 2 },
      { id: 6, name: 'TensorFlow', version: '2.14', type: 'AI框架', license: 'Apache 2.0', updateDate: '2024-09-01', description: '机器学习框架', projectId: 5 }
    ]);
  };

  const tabs = [
    { id: 'info', name: '项目信息', icon: '📋' },
    { id: 'members', name: '项目成员', icon: '👥' },
    { id: 'servers', name: '服务器信息', icon: '🖥️' },
    { id: 'resources', name: '软件资料', icon: '📦' }
  ];

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setEditForm({ ...project });
    setShowDialog('editProject');
  };

  const handleSaveProject = () => {
    if (editingProjectId) {
      setProjects(projects.map(p => {
        if (p.id === editingProjectId) {
          return { ...editForm };
        } else {
          if (editForm.isDefault) {
            return { ...p, isDefault: false };
          }
          return p;
        }
      }));
    } else {
      const newProjects = editForm.isDefault
        ? [...projects.map(p => ({ ...p, isDefault: false })), { ...editForm }]
        : [...projects, { ...editForm }];
      setProjects(newProjects);
    }
    setShowDialog(null);
    setEditingProjectId(null);
    alert('项目信息已保存！');
  };

  const handleAddProject = () => {
    console.log('🎯🎯🎯 handleAddProject 被调用! 准备打开 ProjectEditDialog 组件 🎯🎯🎯');
    console.log('🔔 如果看到这个日志,说明按钮点击成功,即将显示编辑对话框');
    setEditForm({
      id: Date.now(),
      name: '',
      description: '',
      status: '规划中',
      startDate: '',
      endDate: '',
      progress: 0,
      budget: '',
      department: '',
      priority: '中',
      type: '',
      customer: '',
      manager: '',
      team: '',
      isDefault: false
    });
    setEditingProjectId(null);
    setShowDialog('editProject');
  };

  const handleDeleteProject = (project) => {
                    if (window.confirm(`确定要删除项目"${project.name}"吗？`)) {
                      setProjects(projects.filter(p => p.id !== project.id));
                    }
  };

  // 筛选数据
  const filteredMembers = getFilteredMembers(members, selectedProjectFilter);
  const filteredServers = getFilteredServers(servers, selectedProjectFilter);
  const filteredResources = getFilteredResources(resources, selectedProjectFilter);

  if (!selectedProject) {
    return (
      <div style={{
        padding: isMobile ? '20px' : '40px',
        textAlign: 'center',
        color: '#95a5a6'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontSize: '18px' }}>请先选择一个项目</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: isMobile ? '12px' : '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* 顶部标题卡片 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '24px' : '32px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: isMobile ? '32px' : '48px' }}>🎯</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '20px' : '28px' }}>
              {selectedProject}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: isMobile ? '14px' : '16px' }}>
              项目综合管理中心
            </p>
          </div>
        </div>
      </div>

      {/* Tab导航 */}
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '12px' : '16px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'flex',
          gap: isMobile ? '8px' : '16px',
          minWidth: 'fit-content'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: isMobile ? '0 0 auto' : 1,
                padding: isMobile ? '12px 16px' : '16px 24px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#555',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div>
        {activeTab === 'info' && (
          <ProjectInfo
            projects={projects}
            user={user}
            isMobile={isMobile}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        )}
        {activeTab === 'members' && (
          <MemberManagement
            members={filteredMembers}
            projects={projects}
            selectedProjectFilter={selectedProjectFilter}
            onProjectFilterChange={setSelectedProjectFilter}
            user={user}
            isMobile={isMobile}
            onAddMember={() => setShowDialog('addMember')}
          />
        )}
        {activeTab === 'servers' && (
          <ServerManagement
            servers={filteredServers}
            projects={projects}
            selectedProjectFilter={selectedProjectFilter}
            onProjectFilterChange={setSelectedProjectFilter}
            user={user}
            isMobile={isMobile}
            onAddServer={() => setShowDialog('addServer')}
          />
        )}
        {activeTab === 'resources' && (
          <ResourceManagement
            resources={filteredResources}
            projects={projects}
            selectedProjectFilter={selectedProjectFilter}
            onProjectFilterChange={setSelectedProjectFilter}
            user={user}
            isMobile={isMobile}
            onAddResource={() => setShowDialog('addResource')}
          />
        )}
      </div>

      {/* 编辑对话框 */}
      <ProjectEditDialog
        show={showDialog === 'editProject'}
        editForm={editForm}
        editingProjectId={editingProjectId}
        isMobile={isMobile}
        managers={managers}
        onClose={() => setShowDialog(null)}
        onSave={handleSaveProject}
        onChange={setEditForm}
      />
    </div>
  );
};

export default ProjectManagementDetail;
