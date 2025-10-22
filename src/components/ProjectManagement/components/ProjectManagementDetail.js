import React, { useState, useEffect } from 'react';

const ProjectManagementDetail = ({ user, selectedProject, isMobile }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [servers, setServers] = useState([]);
  const [resources, setResources] = useState([]);
  const [showDialog, setShowDialog] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(null); // 'all' or project id, null means auto-select default

  useEffect(() => {
    if (selectedProject) {
      fetchProjectDetails();
    }
  }, [selectedProject]);

  // 当projects加载完成后，自动选择默认项目
  useEffect(() => {
    if (projects.length > 0 && selectedProjectFilter === null) {
      const defaultProject = projects.find(p => p.isDefault);
      if (defaultProject) {
        setSelectedProjectFilter(defaultProject.id);
      } else {
        // 如果没有默认项目，选择第一个
        setSelectedProjectFilter(projects[0].id);
      }
    }
  }, [projects, selectedProjectFilter]);

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

  // 获取默认项目
  const getDefaultProject = () => {
    return projects.find(p => p.isDefault);
  };

  // 根据选择的项目筛选数据
  const getFilteredMembers = () => {
    if (selectedProjectFilter === 'all') return members;
    if (!selectedProjectFilter) return members;
    return members.filter(m => m.projectId === Number(selectedProjectFilter));
  };

  const getFilteredServers = () => {
    if (selectedProjectFilter === 'all') return servers;
    if (!selectedProjectFilter) return servers;
    return servers.filter(s => s.projectId === Number(selectedProjectFilter));
  };

  const getFilteredResources = () => {
    if (selectedProjectFilter === 'all') return resources;
    if (!selectedProjectFilter) return resources;
    return resources.filter(r => r.projectId === Number(selectedProjectFilter));
  };

  // 项目选择器组件
  const ProjectSelector = () => {
    return (
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <label style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          选择项目：
        </label>
        <select
          value={selectedProjectFilter}
          onChange={(e) => setSelectedProjectFilter(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#2c3e50',
            background: 'white',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        >
          <option value="all">全部项目</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}{project.isDefault ? ' ⭐ (默认)' : ''}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setEditForm({ ...project });
    setShowDialog('editProject');
  };

  const handleSaveProject = () => {
    // 这里应该调用API保存数据
    if (editingProjectId) {
      // 更新现有项目
      setProjects(projects.map(p => {
        if (p.id === editingProjectId) {
          return { ...editForm };
        } else {
          // 如果当前编辑的项目被设置为默认，其他项目的默认状态需要取消
          if (editForm.isDefault) {
            return { ...p, isDefault: false };
          }
          return p;
        }
      }));
    } else {
      // 添加新项目
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

  const getStatusColor = (status) => {
    switch(status) {
      case '进行中': return '#3498db';
      case '已完成': return '#27ae60';
      case '已暂停': return '#f39c12';
      case '已取消': return '#e74c3c';
      case '规划中': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case '高': return '#e74c3c';
      case '中': return '#f39c12';
      case '低': return '#3498db';
      default: return '#95a5a6';
    }
  };

  // 项目信息卡片式展示（类似服务器卡片）
  const renderProjectInfo = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', color: '#2c3e50' }}>
          项目列表 ({projects.length}个)
        </h3>
        {user.role === 'admin' && (
          <button
            onClick={handleAddProject}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ 添加项目
          </button>
        )}
      </div>

      {/* 项目卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {projects.map(project => (
          <div key={project.id} style={{
            border: '2px solid #e1e5e9',
            borderRadius: '12px',
            padding: '20px',
            background: '#f8f9fa',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e1e5e9';
          }}>
            {/* 卡片头部 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋 {project.name}</span>
                  {project.isDefault && (
                    <span style={{
                      padding: '2px 8px',
                      background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(243, 156, 18, 0.3)'
                    }}>
                      ⭐ 默认
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>{project.type}</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px'
              }}>
                <span style={{
                  padding: '4px 12px',
                  background: getStatusColor(project.status),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  {project.status}
                </span>
                <span style={{
                  padding: '4px 12px',
                  background: getPriorityColor(project.priority),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  {project.priority}
                </span>
              </div>
            </div>

            {/* 项目描述 */}
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '16px',
              lineHeight: '1.6',
              height: '48px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {project.description}
            </div>

            {/* 进度条 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#666'
              }}>
                <span>进度</span>
                <span style={{ fontWeight: '600', color: '#667eea' }}>{project.progress}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#ecf0f1',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${project.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* 项目详细信息 */}
            <div style={{ fontSize: '14px', color: '#555', lineHeight: '2', marginBottom: '16px' }}>
              <div><strong>项目经理：</strong>{project.manager}</div>
              <div><strong>所属部门：</strong>{project.department}</div>
              <div><strong>开始日期：</strong>{project.startDate}</div>
              <div><strong>结束日期：</strong>{project.endDate}</div>
              <div><strong>项目预算：</strong>¥{project.budget}</div>
            </div>

            {/* 操作按钮 */}
            {user.role === 'admin' && (
              <div style={{
                display: 'flex',
                gap: '8px',
                paddingTop: '16px',
                borderTop: '1px solid #e1e5e9'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProject(project);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2980b9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3498db'}
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`确定要删除项目"${project.name}"吗？`)) {
                      setProjects(projects.filter(p => p.id !== project.id));
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
                >
                  🗑️ 删除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 全屏编辑对话框
  const renderEditDialog = () => {
    if (showDialog !== 'editProject') return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease'
      }}>
        <div style={{
          background: 'white',
          width: '95%',
          height: '95%',
          maxWidth: '1200px',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease'
        }}>
          {/* 对话框头部 */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                {editingProjectId ? '编辑项目信息' : '添加新项目'}
              </h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                {editingProjectId ? '修改项目的详细信息' : '创建一个新的项目'}
              </p>
            </div>
            <button
              onClick={() => setShowDialog(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ✕
            </button>
          </div>

          {/* 对话框内容 */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: isMobile ? '24px' : '40px'
          }}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <FormField
                  label="项目名称"
                  value={editForm.name}
                  onChange={(value) => setEditForm({ ...editForm, name: value })}
                  required
                />
                <FormField
                  label="项目状态"
                  value={editForm.status}
                  onChange={(value) => setEditForm({ ...editForm, status: value })}
                  type="select"
                  options={['进行中', '已完成', '已暂停', '已取消', '规划中']}
                />
                <FormField
                  label="优先级"
                  value={editForm.priority}
                  onChange={(value) => setEditForm({ ...editForm, priority: value })}
                  type="select"
                  options={['高', '中', '低']}
                />
                <FormField
                  label="项目类型"
                  value={editForm.type}
                  onChange={(value) => setEditForm({ ...editForm, type: value })}
                />
                <FormField
                  label="开始日期"
                  value={editForm.startDate}
                  onChange={(value) => setEditForm({ ...editForm, startDate: value })}
                  type="date"
                />
                <FormField
                  label="结束日期"
                  value={editForm.endDate}
                  onChange={(value) => setEditForm({ ...editForm, endDate: value })}
                  type="date"
                />
                <FormField
                  label="项目进度 (%)"
                  value={editForm.progress}
                  onChange={(value) => setEditForm({ ...editForm, progress: value })}
                  type="number"
                  min="0"
                  max="100"
                />
                <FormField
                  label="项目预算"
                  value={editForm.budget}
                  onChange={(value) => setEditForm({ ...editForm, budget: value })}
                  type="number"
                />
                <FormField
                  label="所属部门"
                  value={editForm.department}
                  onChange={(value) => setEditForm({ ...editForm, department: value })}
                />
                <FormField
                  label="项目经理"
                  value={editForm.manager}
                  onChange={(value) => setEditForm({ ...editForm, manager: value })}
                />
                <FormField
                  label="项目团队"
                  value={editForm.team}
                  onChange={(value) => setEditForm({ ...editForm, team: value })}
                />
                <FormField
                  label="客户名称"
                  value={editForm.customer}
                  onChange={(value) => setEditForm({ ...editForm, customer: value })}
                />
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <FormField
                  label="项目描述"
                  value={editForm.description}
                  onChange={(value) => setEditForm({ ...editForm, description: value })}
                  type="textarea"
                  rows={4}
                />
              </div>

              {/* 设置为默认项目 */}
              <div style={{ marginTop: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e1e5e9' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  <input
                    type="checkbox"
                    checked={editForm.isDefault || false}
                    onChange={(e) => setEditForm({ ...editForm, isDefault: e.target.checked })}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '12px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⭐</span>
                    <span>设置为默认项目</span>
                  </span>
                </label>
                <div style={{
                  marginTop: '8px',
                  marginLeft: '32px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  默认项目将在其他模块的项目选择器中默认选中（全局只能有一个默认项目）
                </div>
              </div>
            </div>
          </div>

          {/* 对话框底部 */}
          <div style={{
            background: '#f8f9fa',
            padding: '24px 32px',
            borderTop: '1px solid #e1e5e9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px'
          }}>
            <button
              onClick={() => setShowDialog(null)}
              style={{
                padding: '12px 32px',
                background: 'white',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                color: '#555',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e1e5e9';
                e.currentTarget.style.color = '#555';
              }}
            >
              取消
            </button>
            <button
              onClick={handleSaveProject}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              💾 保存{editingProjectId ? '更改' : '项目'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 表单字段组件
  const FormField = ({ label, value, onChange, type = 'text', required, options, fullWidth, rows, min, max }) => {
    const inputStyle = {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    };

    return (
      <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          {label} {required && <span style={{ color: '#e74c3c' }}>*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '100px',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        ) : type === 'select' ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          >
            <option value="">请选择</option>
            {options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        )}
      </div>
    );
  };

  const renderMembers = () => {
    const filteredMembers = getFilteredMembers();
    
    return (
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 项目选择器 */}
        <ProjectSelector />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', color: '#2c3e50' }}>
            项目成员 ({filteredMembers.length}人)
          </h3>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowDialog('addMember')}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ 添加成员
          </button>
        )}
      </div>

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredMembers.map(member => (
            <div key={member.id} style={{
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              padding: '16px',
              background: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{member.role}</div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: '#27ae60',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {member.status}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div>📞 {member.phone}</div>
                <div>📧 {member.email}</div>
                <div>🏢 {member.department}</div>
                <div>📅 入职：{member.joinDate}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>姓名</th>
                <th style={tableHeaderStyle}>角色</th>
                <th style={tableHeaderStyle}>部门</th>
                <th style={tableHeaderStyle}>联系电话</th>
                <th style={tableHeaderStyle}>邮箱</th>
                <th style={tableHeaderStyle}>入职日期</th>
                <th style={tableHeaderStyle}>状态</th>
                {user.role === 'admin' && <th style={tableHeaderStyle}>操作</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={tableCellStyle}>{member.name}</td>
                  <td style={tableCellStyle}>{member.role}</td>
                  <td style={tableCellStyle}>{member.department}</td>
                  <td style={tableCellStyle}>{member.phone}</td>
                  <td style={tableCellStyle}>{member.email}</td>
                  <td style={tableCellStyle}>{member.joinDate}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 12px',
                      background: '#27ae60',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {member.status}
                    </span>
                  </td>
                  {user.role === 'admin' && (
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>编辑</button>
                      <button style={{...actionButtonStyle, background: '#e74c3c', marginLeft: '8px'}}>移除</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

  const renderServers = () => {
    const filteredServers = getFilteredServers();
    
    return (
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 项目选择器 */}
        <ProjectSelector />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', color: '#2c3e50' }}>
            服务器信息 ({filteredServers.length}台)
          </h3>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowDialog('addServer')}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ 添加服务器
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredServers.map(server => (
          <div key={server.id} style={{
            border: '2px solid #e1e5e9',
            borderRadius: '12px',
            padding: '20px',
            background: '#f8f9fa',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e1e5e9';
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                  🖥️ {server.name}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>{server.purpose}</div>
              </div>
              <span style={{
                padding: '4px 12px',
                background: server.status === '运行中' ? '#27ae60' : '#e74c3c',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {server.status}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#555', lineHeight: '2' }}>
              <div><strong>IP地址：</strong>{server.ip}</div>
              <div><strong>操作系统：</strong>{server.type}</div>
              <div><strong>CPU：</strong>{server.cpu}</div>
              <div><strong>内存：</strong>{server.memory}</div>
              <div><strong>硬盘：</strong>{server.disk}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  const renderResources = () => {
    const filteredResources = getFilteredResources();
    
    return (
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 项目选择器 */}
        <ProjectSelector />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', color: '#2c3e50' }}>
            软件资料 ({filteredResources.length}项)
          </h3>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowDialog('addResource')}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ 添加资料
          </button>
        )}
      </div>

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredResources.map(resource => (
            <div key={resource.id} style={{
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              padding: '16px',
              background: '#f8f9fa'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                📦 {resource.name} <span style={{ color: '#667eea' }}>v{resource.version}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div><strong>类型：</strong>{resource.type}</div>
                <div><strong>许可证：</strong>{resource.license}</div>
                <div><strong>更新日期：</strong>{resource.updateDate}</div>
                <div><strong>说明：</strong>{resource.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>软件名称</th>
                <th style={tableHeaderStyle}>版本</th>
                <th style={tableHeaderStyle}>类型</th>
                <th style={tableHeaderStyle}>许可证</th>
                <th style={tableHeaderStyle}>更新日期</th>
                <th style={tableHeaderStyle}>说明</th>
                {user.role === 'admin' && <th style={tableHeaderStyle}>操作</th>}
              </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr key={resource.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={tableCellStyle}><strong>{resource.name}</strong></td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      v{resource.version}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{resource.type}</td>
                  <td style={tableCellStyle}>{resource.license}</td>
                  <td style={tableCellStyle}>{resource.updateDate}</td>
                  <td style={tableCellStyle}>{resource.description}</td>
                  {user.role === 'admin' && (
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>编辑</button>
                      <button style={{...actionButtonStyle, background: '#e74c3c', marginLeft: '8px'}}>删除</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

  const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    borderBottom: '2px solid #e1e5e9'
  };

  const tableCellStyle = {
    padding: '12px',
    fontSize: '14px',
    color: '#555'
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

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
        {activeTab === 'info' && renderProjectInfo()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'servers' && renderServers()}
        {activeTab === 'resources' && renderResources()}
      </div>

      {/* 编辑对话框 */}
      {renderEditDialog()}

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
