import React, { useState, useEffect, useCallback } from 'react';
import ProjectInfo from './ProjectManagementDetail/components/ProjectInfo';
import ProjectEditDialog from './ProjectManagementDetail/components/ProjectEditDialog';
import ProjectSelector from './ProjectManagementDetail/components/ProjectSelector';
import MemberManagement from './ProjectManagementDetail/components/MemberManagement';
import ServerManagement from './ProjectManagementDetail/components/ServerManagement';
import ResourceManagement from './ProjectManagementDetail/components/ResourceManagement';
import MemberDialog from './ProjectManagementDetail/components/MemberDialog';
import ServerDialog from './ProjectManagementDetail/components/ServerDialog';
import ResourceDialog from './ProjectManagementDetail/components/ResourceDialog';

import * as api from './ProjectManagementDetail/api/projectDetailsApi';
import { getFilteredMembers, getFilteredServers, getFilteredResources } from './ProjectManagementDetail/utils/filterUtils';

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
  const [allUsers, setAllUsers] = useState([]);

  // Tab 定义
  const tabs = [
    { id: 'info', name: '项目信息', icon: '📋' },
    { id: 'members', name: '项目成员', icon: '👥' },
    { id: 'servers', name: '服务器信息', icon: '🖥️' },
    { id: 'resources', name: '软件资料', icon: '📦' }
  ];

  // 初始化数据
  useEffect(() => {
    if (selectedProject) {
      loadProjectDetails();
      loadAllUsers();
    }
  }, [selectedProject]);

  // 当 projects 加载完成后，自动选择默认项目
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

  // 加载所有用户列表
  const loadAllUsers = async () => {
    try {
      const users = await api.fetchAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  // 加载项目详情
  const loadProjectDetails = async () => {
    try {
      const [projectsData, membersData, serversData, resourcesData] = await Promise.all([
        api.fetchProjects(),
        api.fetchMembers(),
        api.fetchServers(),
        api.fetchResources()
      ]);

      setProjects(projectsData);
      setMembers(membersData);
      setServers(serversData);
      setResources(resourcesData);
    } catch (error) {
      console.error('获取项目详情失败:', error);
    }
  };

  // ==================== 项目相关操作 ====================
  const handleAddProject = () => {
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

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setEditForm({ ...project });
    setShowDialog('editProject');
  };

  const handleSaveProject = async () => {
    try {
      // 从项目经理选择文本中提取用户信息
      let managerId = editForm.managerId;
      if (editForm.manager && allUsers.length > 0) {
        const managerText = editForm.manager;
        const matchedUser = allUsers.find(u => 
          managerText.includes(u.full_name || u.username)
        );
        if (matchedUser) {
          managerId = matchedUser.id;
        }
      }

      // 准备提交的数据
      const projectData = {
        name: editForm.name,
        description: editForm.description,
        status: editForm.status,
        priority: editForm.priority,
        type: editForm.type,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        progress: editForm.progress || 0,
        budget: editForm.budget || 0,
        department: editForm.department,
        team: editForm.team,
        customer: editForm.customer,
        clientId: editForm.clientId,
        managerId: managerId,
        isDefault: editForm.isDefault || false
      };

      await api.saveProject(projectData, editingProjectId);

      alert(`✅ 项目${editingProjectId ? '更新' : '创建'}成功!`);
      setShowDialog(null);
      setEditingProjectId(null);
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 保存失败: ' + error.message);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`确定要删除项目"${project.name}"吗？`)) return;
    
    try {
      await api.deleteProject(project.id);
      alert('✅ 项目已删除');
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 删除失败: ' + error.message);
    }
  };

  // ==================== 成员相关操作 ====================
  const handleAddMember = () => {
    setEditForm({
      id: null,
      name: '',
      role: '',
      department: '',
      phone: '',
      email: '',
      joinDate: '',
      status: '在职',
      projectId: selectedProjectFilter || projects[0]?.id
    });
    setShowDialog('addMember');
  };

  const handleEditMember = (member) => {
    setEditForm(member);
    setShowDialog('editMember');
  };

  const handleSaveMember = async () => {
    try {
      const memberData = {
        project_id: editForm.projectId || selectedProjectFilter || projects[0]?.id,
        name: editForm.name,
        role: editForm.role,
        department: editForm.department,
        phone: editForm.phone,
        email: editForm.email,
        join_date: editForm.joinDate,
        status: editForm.status || '在职'
      };
      
      await api.saveMember(memberData, editForm.id);
        alert(`✅ 成员${editForm.id ? '更新' : '添加'}成功!`);
        setShowDialog(null);
        setEditForm({});
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 操作失败: ' + error.message);
    }
  };
  
  const handleDeleteMember = async (id) => {
    if (!window.confirm('确定要删除这个成员吗?')) return;
    
    try {
      await api.deleteMember(id);
        alert('✅ 成员已删除');
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 删除失败: ' + error.message);
    }
  };

  // ==================== 服务器相关操作 ====================
  const handleAddServer = () => {
    setEditForm({
      id: null,
      name: '',
      ip: '',
      type: '',
      cpu: '',
      memory: '',
      disk: '',
      status: '运行中',
      purpose: '',
      remark: '',
      projectId: selectedProjectFilter || projects[0]?.id
    });
    setShowDialog('addServer');
  };

  const handleEditServer = (server) => {
    setEditForm(server);
    setShowDialog('editServer');
  };

  const handleSaveServer = async () => {
    try {
      const serverData = {
        project_id: editForm.projectId || selectedProjectFilter || projects[0]?.id,
        name: editForm.name,
        ip: editForm.ip,
        type: editForm.type,
        cpu: editForm.cpu,
        memory: editForm.memory,
        disk: editForm.disk,
        status: editForm.status || '运行中',
        purpose: editForm.purpose,
        remark: editForm.remark
      };
      
      await api.saveServer(serverData, editForm.id);
        alert(`✅ 服务器${editForm.id ? '更新' : '添加'}成功!`);
        setShowDialog(null);
        setEditForm({});
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 操作失败: ' + error.message);
    }
  };
  
  const handleDeleteServer = async (id) => {
    if (!window.confirm('确定要删除这个服务器吗?')) return;
    
    try {
      await api.deleteServer(id);
        alert('✅ 服务器已删除');
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 删除失败: ' + error.message);
    }
  };

  // ==================== 软件资料相关操作 ====================
  const handleAddResource = () => {
    setEditForm({
      id: null,
      name: '',
      version: '',
      type: '',
      license: '',
      updateDate: '',
      description: '',
      downloadUrl: '',
      projectId: selectedProjectFilter || projects[0]?.id
    });
    setShowDialog('addResource');
  };

  const handleEditResource = (resource) => {
    setEditForm(resource);
    setShowDialog('editResource');
  };

  const handleSaveResource = async () => {
    try {
      const resourceData = {
        project_id: editForm.projectId || selectedProjectFilter || projects[0]?.id,
        name: editForm.name,
        version: editForm.version,
        type: editForm.type,
        license: editForm.license,
        update_date: editForm.updateDate,
        description: editForm.description,
        download_url: editForm.downloadUrl
      };
      
      await api.saveResource(resourceData, editForm.id);
        alert(`✅ 软件资料${editForm.id ? '更新' : '添加'}成功!`);
        setShowDialog(null);
        setEditForm({});
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 操作失败: ' + error.message);
    }
  };
  
  const handleDeleteResource = async (id) => {
    if (!window.confirm('确定要删除这个软件资料吗?')) return;
    
    try {
      await api.deleteResource(id);
        alert('✅ 软件资料已删除');
      await loadProjectDetails();
    } catch (error) {
      alert('❌ 删除失败: ' + error.message);
    }
  };

  // 使用 useCallback 包装表单字段更新函数
  const updateFormField = useCallback((field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // 筛选数据
  const filteredMembers = getFilteredMembers(members, selectedProjectFilter);
  const filteredServers = getFilteredServers(servers, selectedProjectFilter);
  const filteredResources = getFilteredResources(resources, selectedProjectFilter);

  // 如果没有选择项目，显示提示
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
              项目管理
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: isMobile ? '14px' : '16px' }}>
              所有项目的综合管理与维护
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
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
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
            onAddServer={handleAddServer}
            onEditServer={handleEditServer}
            onDeleteServer={handleDeleteServer}
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
            onAddResource={handleAddResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        )}
      </div>

      {/* 编辑对话框 */}
      <ProjectEditDialog
        show={showDialog === 'editProject'}
        editForm={editForm}
        editingProjectId={editingProjectId}
        isMobile={isMobile}
        managers={allUsers}
        onClose={() => setShowDialog(null)}
        onSave={handleSaveProject}
        onChange={setEditForm}
      />

      <MemberDialog
        show={showDialog === 'addMember' || showDialog === 'editMember'}
        editForm={editForm}
        projects={projects}
        allUsers={allUsers}
        isMobile={isMobile}
        onClose={() => setShowDialog(null)}
        onSave={handleSaveMember}
        onChange={setEditForm}
      />

      <ServerDialog
        show={showDialog === 'addServer' || showDialog === 'editServer'}
        editForm={editForm}
        projects={projects}
        isMobile={isMobile}
        onClose={() => setShowDialog(null)}
        onSave={handleSaveServer}
        onChange={setEditForm}
      />

      <ResourceDialog
        show={showDialog === 'addResource' || showDialog === 'editResource'}
        editForm={editForm}
        projects={projects}
        isMobile={isMobile}
        onClose={() => setShowDialog(null)}
        onSave={handleSaveResource}
        onChange={setEditForm}
      />

      {/* CSS动画 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectManagementDetail;

