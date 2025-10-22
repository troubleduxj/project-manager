import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../config/api';
import { getUserAvatar } from '../../utils/avatarGenerator';
import HomePage from './components/HomePage';
import ProjectBoard from './components/ProjectBoard';
import ProjectManagementDetail from './components/ProjectManagementDetail';
import ProjectDocumentation from './components/ProjectDocumentation';
import TaskManagement from './components/TaskManagement';
import DocumentManagement from './components/DocumentManagement';
import ConfigManagement from './components/ConfigManagement';
import PersonalCenter from './components/PersonalCenter';
import '../../styles/hide-browser-password-icon.css';

const ProjectManagementApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 控制登录密码显示/隐藏
  const [showRegisterPassword, setShowRegisterPassword] = useState(false); // 控制注册密码显示/隐藏
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 控制确认密码显示/隐藏
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [systemSettings, setSystemSettings] = useState({ site_name: '项目管理系统' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskEditForm, setShowTaskEditForm] = useState(false);
  const [taskCommentCounts, setTaskCommentCounts] = useState({}); // 存储每个任务的评论数量
  const [selectedTaskForComments, setSelectedTaskForComments] = useState(null); // 选中查看评论的任务
  const [taskComments, setTaskComments] = useState([]); // 当前任务的评论列表
  const [showCommentPanel, setShowCommentPanel] = useState(false); // 显示评论面板
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('home'); // home, board, project-docs, tasks, file-management, profile
  const [activeDocTab, setActiveDocTab] = useState('project'); // project, system
  const [configInitialTab, setConfigInitialTab] = useState('system'); // 配置页面的初始标签
  const [editingDocCard, setEditingDocCard] = useState(null);
  const [showDocCardForm, setShowDocCardForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // 检测是否为移动端
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false); // 移动端用户菜单
  const [systemDocs, setSystemDocs] = useState([
    {
      id: 'quick-start',
      title: '快速开始',
      subtitle: '5分钟上手指南',
      description: '了解如何快速部署和使用项目管理系统，包含环境配置、数据库初始化等关键步骤。',
      icon: '🚀',
      color: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      hoverColor: 'rgba(40, 167, 69, 0.15)',
      borderColor: '#28a745',
      url: '/docs/intro',
      category: 'getting-started',
      featured: true,
      visible: true,
      sortOrder: 1
    },
    {
      id: 'installation',
      title: '安装与配置',
      subtitle: '系统配置指南',
      description: '详细的安装步骤和系统配置说明，包含依赖安装、环境变量配置等。',
      icon: '⚙️',
      color: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
      hoverColor: 'rgba(0, 123, 255, 0.15)',
      borderColor: '#007bff',
      url: '/docs/getting-started/installation',
      category: 'configuration',
      featured: false,
      visible: true,
      sortOrder: 2
    },
    {
      id: 'deployment',
      title: '部署指南',
      subtitle: '生产环境部署',
      description: '生产环境部署和本地开发环境搭建，包含Nginx配置、SSL证书等。',
      icon: '🌐',
      color: 'linear-gradient(135deg, #fd7e14 0%, #e55a4e 100%)',
      hoverColor: 'rgba(253, 126, 20, 0.15)',
      borderColor: '#fd7e14',
      url: '/docs/guides/deployment',
      category: 'deployment',
      featured: false,
      visible: true,
      sortOrder: 3
    },
    {
      id: 'usage-guide',
      title: '使用指南',
      subtitle: '功能使用说明',
      description: '如何编写文档和使用系统各项功能，包含项目管理、任务分配等操作指南。',
      icon: '📝',
      color: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
      hoverColor: 'rgba(111, 66, 193, 0.15)',
      borderColor: '#6f42c1',
      url: '/docs/guides/writing-docs',
      category: 'usage',
      featured: false,
      visible: true,
      sortOrder: 4
    },
    {
      id: 'blog',
      title: '博客文章',
      subtitle: '更新日志 & 分享',
      description: '最新的系统更新日志、技术分享和最佳实践案例。',
      icon: '📰',
      color: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
      hoverColor: 'rgba(23, 162, 184, 0.15)',
      borderColor: '#17a2b8',
      url: '/blog',
      category: 'blog',
      featured: false,
      visible: true,
      sortOrder: 5
    },
    {
      id: 'full-docs',
      title: '完整文档站',
      subtitle: '推荐 ⭐',
      description: '访问完整的Docusaurus文档站点，包含所有文档、博客和API参考。',
      icon: '🏠',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverColor: 'rgba(102, 126, 234, 0.25)',
      borderColor: '#667eea',
      url: '/docs',
      category: 'main',
      featured: true,
      visible: true,
      sortOrder: 6
    }
  ]);
  
  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // 新任务表单状态
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    startDate: '',
    dueDate: ''
  });

  // 新子任务表单状态
  const [newSubTask, setNewSubTask] = useState({
    taskName: '',
    description: '',
    startDate: '',
    dueDate: ''
  });

  // 注册表单状态
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      console.log('🔍 设备检测:', {
        windowWidth: window.innerWidth,
        isMobile: isMobileDevice,
        threshold: 768
      });
    };
    
    // 初始检测
    checkMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // 检查本地存储的登录状态
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // 根据用户角色设置默认TAB
        setActiveTab('home');
        fetchProjects();
        fetchSystemSettings();
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  // 监听系统设置变化，当配置管理页面更新设置后重新获取
  useEffect(() => {
    const handleSystemSettingsUpdate = () => {
      fetchSystemSettings();
    };
    
    // 监听认证失败事件
    const handleAuthenticationFailed = () => {
      console.log('🔐 收到认证失败事件，重置用户状态');
      setUser(null);
      setProjects([]);
      setSelectedProject(null);
      setProjectTasks([]);
      setProjectDocuments([]);
      setError('登录已过期，请重新登录');
    };
    
    // 监听自定义事件（同一页面内的更新）
    window.addEventListener('systemSettingsUpdated', handleSystemSettingsUpdate);
    window.addEventListener('authenticationFailed', handleAuthenticationFailed);
    
    return () => {
      window.removeEventListener('systemSettingsUpdated', handleSystemSettingsUpdate);
      window.removeEventListener('authenticationFailed', handleAuthenticationFailed);
    };
  }, []);

  // 自动选择第一个项目
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      handleProjectSelect(projects[0]);
    }
  }, [projects, selectedProject]);

  // 切换到看板页面时，确保加载任务数据
  useEffect(() => {
    if (activeTab === 'board' && selectedProject && projectTasks.length === 0) {
      console.log('🔄 看板页面加载，自动获取任务数据');
      fetchProjectTasks(selectedProject.id);
    }
  }, [activeTab, selectedProject]);

  const fetchProjects = async () => {
    try {
      const data = await apiRequest('http://localhost:7080/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('获取项目列表失败:', error);
    }
  };

  // 获取项目文档
  const fetchProjectDocuments = async (projectId) => {
    if (!projectId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/documents/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjectDocuments(data);
      } else {
        console.error('获取项目文档失败:', response.status);
        setProjectDocuments([]);
      }
    } catch (error) {
      console.error('获取项目文档失败:', error);
      setProjectDocuments([]);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const data = await apiRequest('http://localhost:7080/api/settings');
      setSystemSettings(data);
    } catch (error) {
      console.error('获取系统设置失败:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:7080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        // 根据用户角色设置默认TAB
        setActiveTab('home');
        fetchProjects();
        fetchSystemSettings();
      } else {
        setError(data.error || '登录失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:7080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          fullName: registerForm.fullName
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowRegister(false);
        setError('');
        setRegisterForm({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        });
        alert('注册成功！请使用新账户登录。');
      } else {
        setError(data.error || '注册失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setProjects([]);
    setSelectedProject(null);
    setProjectTasks([]);
    setSelectedTask(null);
    setSubTasks([]);
    setProjectDocuments([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoginForm({ username: '', password: '' });
  };

  const fetchProjectTasks = async (projectId) => {
    console.log('🔍 开始获取项目任务，项目ID:', projectId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${projectId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 API响应状态:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 获取到的任务数据:', {
          任务总数: data.length,
          任务列表: data.map(t => ({
            id: t.id,
            title: t.title,
            parent_task_id: t.parent_task_id,
            status: t.status
          }))
        });
        setProjectTasks(data);
        
        // 获取每个任务的评论数量
        const commentCounts = {};
        for (const task of data) {
          try {
            const countResponse = await fetch(`http://localhost:7080/api/comments/task/${task.id}/count`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (countResponse.ok) {
              const { count } = await countResponse.json();
              commentCounts[task.id] = count;
            }
          } catch (error) {
            console.error('获取任务评论数量失败:', error);
            commentCounts[task.id] = 0;
          }
        }
        setTaskCommentCounts(commentCounts);
      } else {
        console.error('❌ API请求失败:', response.status);
      }
    } catch (error) {
      console.error('❌ 获取任务列表失败:', error);
    }
  };

  const handleProjectSelect = async (project) => {
    setSelectedProject(project);
    setSelectedTask(null);
    setSubTasks([]);
    await fetchProjectTasks(project.id);
    await fetchProjectDocuments(project.id);
  };

  const handleTaskSelect = async (task) => {
    setSelectedTask(task);
    await fetchSubTasks(selectedProject.id, task.id);
  };

  const fetchSubTasks = async (projectId, taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${projectId}/tasks/${taskId}/subtasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubTasks(data);
      }
    } catch (error) {
      console.error('获取子任务列表失败:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: newTask.taskName,
          description: newTask.description,
          startDate: newTask.startDate,
          dueDate: newTask.dueDate
        })
      });

      if (response.ok) {
        setNewTask({
          taskName: '',
          description: '',
          startDate: '',
          dueDate: ''
        });
        setShowTaskForm(false);
        await fetchProjectTasks(selectedProject.id);
      } else {
        const data = await response.json();
        setError(data.error || '添加任务失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    }
  };

  const handleUpdateTaskProgress = async (taskId, progress, status) => {
    try {
      const token = localStorage.getItem('token');
      const task = projectTasks.find(t => t.id === taskId);
      
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: task.task_name,
          description: task.description,
          progress: progress,
          status: status,
          startDate: task.start_date,
          dueDate: task.due_date
        })
      });

      if (response.ok) {
        await fetchProjectTasks(selectedProject.id);
        if (selectedTask?.id === taskId) {
          const updatedTask = projectTasks.find(t => t.id === taskId);
          setSelectedTask(updatedTask);
        }
      }
    } catch (error) {
      console.error('更新任务进度失败:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('确定要删除这个任务吗？删除后将无法恢复！')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProjectTasks(selectedProject.id);
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
          setSubTasks([]);
        }
      } else {
        const data = await response.json();
        setError(data.error || '删除任务失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskEditForm(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    if (!editingTask.task_name.trim()) {
      setError('任务名称不能为空');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: editingTask.task_name,
          description: editingTask.description,
          status: editingTask.status,
          progress: editingTask.progress,
          assignedTo: editingTask.assigned_to,
          startDate: editingTask.start_date,
          dueDate: editingTask.due_date
        })
      });

      if (response.ok) {
        await fetchProjectTasks(selectedProject.id);
        setShowTaskEditForm(false);
        setEditingTask(null);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || '更新任务失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    }
  };

  // 处理任务评论相关功能
  const handleShowTaskComments = async (task) => {
    setSelectedTaskForComments(task);
    setShowCommentPanel(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/comments/task/${task.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const comments = await response.json();
        setTaskComments(comments);
      }
    } catch (error) {
      console.error('获取任务评论失败:', error);
    }
    
    // 延迟滚动到评论面板，等待DOM更新
    setTimeout(() => {
      const commentPanel = document.getElementById('comment-panel');
      if (commentPanel) {
        commentPanel.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // 添加高亮效果
        commentPanel.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
        setTimeout(() => {
          commentPanel.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        }, 1000);
      }
    }, 100);
  };

  const handleAddTaskComment = async (content, mentionedUsers = []) => {
    if (!selectedTaskForComments) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/comments/task/${selectedTaskForComments.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, mentionedUsers })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setTaskComments(prev => [...prev, newComment]);
        
        // 更新评论数量
        setTaskCommentCounts(prev => ({
          ...prev,
          [selectedTaskForComments.id]: (prev[selectedTaskForComments.id] || 0) + 1
        }));
      }
    } catch (error) {
      console.error('添加评论失败:', error);
    }
  };

  const handleEditDocCard = (docCard) => {
    console.log('编辑文档卡片:', docCard); // 调试日志
    setEditingDocCard({...docCard});
    setShowDocCardForm(true);
  };

  const handleUpdateDocCard = (e) => {
    e.preventDefault();
    console.log('更新文档卡片:', editingDocCard); // 调试日志
    const updatedDocs = systemDocs.map(doc => 
      doc.id === editingDocCard.id ? editingDocCard : doc
    );
    setSystemDocs(updatedDocs);
    setShowDocCardForm(false);
    setEditingDocCard(null);
  };

  const handleDeleteDocCard = (docId) => {
    if (!confirm('确定要删除这个文档卡片吗？')) {
      return;
    }
    console.log('删除文档卡片:', docId); // 调试日志
    setSystemDocs(systemDocs.filter(doc => doc.id !== docId));
  };

  const handleAddDocCard = () => {
    const maxSortOrder = Math.max(...systemDocs.map(doc => doc.sortOrder || 0));
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: '新文档',
      subtitle: '描述',
      description: '文档描述',
      icon: '📄',
      color: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
      hoverColor: 'rgba(108, 117, 125, 0.15)',
      borderColor: '#6c757d',
      url: '/docs',
      category: 'custom',
      featured: false,
      visible: true,
      sortOrder: maxSortOrder + 1
    };
    console.log('添加新文档卡片:', newDoc); // 调试日志
    setEditingDocCard(newDoc);
    setShowDocCardForm(true);
  };

  const handleCreateDocCard = (e) => {
    e.preventDefault();
    console.log('创建文档卡片:', editingDocCard); // 调试日志
    
    // 确保新卡片有sortOrder
    const cardWithSortOrder = {
      ...editingDocCard,
      sortOrder: editingDocCard.sortOrder || (Math.max(...systemDocs.map(doc => doc.sortOrder || 0)) + 1)
    };
    
    setSystemDocs([...systemDocs, cardWithSortOrder]);
    setShowDocCardForm(false);
    setEditingDocCard(null);
  };

  const handleAddSubTask = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${selectedTask.id}/subtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: newSubTask.taskName,
          description: newSubTask.description,
          startDate: newSubTask.startDate,
          dueDate: newSubTask.dueDate
        })
      });

      if (response.ok) {
        setNewSubTask({
          taskName: '',
          description: '',
          startDate: '',
          dueDate: ''
        });
        setShowSubTaskForm(false);
        await fetchSubTasks(selectedProject.id, selectedTask.id);
      } else {
        const data = await response.json();
        setError(data.error || '添加子任务失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    }
  };

  const handleUpdateSubTask = async (subtaskId, progress, status) => {
    try {
      const token = localStorage.getItem('token');
      const subtask = subTasks.find(t => t.id === subtaskId);
      
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${selectedTask.id}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: subtask.task_name,
          description: subtask.description,
          progress: progress,
          status: status,
          startDate: subtask.start_date,
          dueDate: subtask.due_date
        })
      });

      if (response.ok) {
        await fetchSubTasks(selectedProject.id, selectedTask.id);
      }
    } catch (error) {
      console.error('更新子任务失败:', error);
    }
  };

  const handleDeleteSubTask = async (subtaskId) => {
    if (!confirm('确定要删除这个子任务吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${selectedTask.id}/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchSubTasks(selectedProject.id, selectedTask.id);
      } else {
        const data = await response.json();
        setError(data.error || '删除子任务失败');
      }
    } catch (error) {
      setError('网络错误，请检查后端服务');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#495057', fontSize: '16px' }}>系统初始化中...</p>
      </div>
    );
  }

  // 样式对象
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    formContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    },
    form: {
      background: 'white',
      borderRadius: '12px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }
  };

  if (user) {
    return (
      <div style={styles.container}>
        {/* 顶部导航 */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: isMobile ? '15px 0' : '20px 0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          ...(isMobile ? {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
          } : {})
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: isMobile ? '0 15px' : '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
              <img 
                src="/img/logo.svg" 
                alt="Logo" 
                style={{ 
                  width: isMobile ? '36px' : '48px', 
                  height: isMobile ? '36px' : '48px',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
                }} 
              />
              <h1 style={{ 
                margin: 0, 
                fontSize: isMobile ? '18px' : '32px', 
                fontWeight: '700', 
                letterSpacing: '0.5px' 
              }}>
                {isMobile ? '项目管理' : (systemSettings.site_name || '项目管理系统')}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '20px', position: 'relative' }}>
              {!isMobile && (
                <span style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {user.role === 'admin' ? '👑 管理员' : '👤 用户'}
                </span>
              )}
              
              {/* PC端：退出按钮 */}
              {!isMobile && (
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  退出登录
                </button>
              )}

              {/* 移动端：用户头像 + 下拉菜单 */}
              {isMobile && (
                <div style={{ position: 'relative' }}>
                  {/* 用户头像按钮 */}
                  <div
                    onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `url(${getUserAvatar(user, 40)}) center/cover`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      cursor: 'pointer',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden'
                    }}
                  >
                  </div>

                  {/* 下拉菜单 */}
                  {showMobileUserMenu && (
                    <>
                      {/* 点击遮罩关闭菜单 */}
                      <div
                        onClick={() => setShowMobileUserMenu(false)}
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999
                        }}
                      />
                      
                      {/* 菜单内容 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50px',
                          right: 0,
                          background: 'white',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                          overflow: 'hidden',
                          minWidth: '160px',
                          zIndex: 1000,
                          border: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {/* 用户信息 */}
                        <div style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          {/* 头像 */}
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: `url(${getUserAvatar(user, 40)}) center/cover`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            border: '2px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}>
                          </div>
                          
                          {/* 用户信息文字 */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#2c3e50',
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {user.username}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#6c757d'
                            }}>
                              {user.role === 'admin' ? '👑 管理员' : '👤 用户'}
                            </div>
                          </div>
                        </div>

                        {/* 菜单项：个人中心 */}
                        <div
                          onClick={() => {
                            setActiveTab('profile');
                            setShowMobileUserMenu(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background 0.2s',
                            fontSize: '14px',
                            color: '#495057'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: '18px' }}>👤</span>
                          <span style={{ fontWeight: '500' }}>个人中心</span>
                        </div>

                        {/* 菜单项：退出登录 */}
                        <div
                          onClick={() => {
                            setShowMobileUserMenu(false);
                            handleLogout();
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'background 0.2s',
                            fontSize: '14px',
                            color: '#dc3545'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: '18px' }}>🚪</span>
                          <span style={{ fontWeight: '500' }}>退出登录</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>


        {/* 主要内容 */}
        <main style={{
          maxWidth: isMobile ? '100%' : '1400px',
          margin: '0 auto',
          marginTop: isMobile ? '70px' : '0', // 移动端为固定header留出空间
          padding: isMobile ? '12px 12px 80px 12px' : '30px 20px' // 移动端左右保留12px边距
        }}>
          <div style={{ minHeight: 'calc(100vh - 300px)' }}>
            {/* 主工作区 */}
            {selectedProject ? (
              <div style={{
                background: isMobile ? 'transparent' : 'white',
                borderRadius: isMobile ? '0' : '12px',
                padding: isMobile ? '0' : '30px',
                boxShadow: isMobile ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                {/* 标签页导航 - PC端 */}
                {!isMobile && (
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    borderBottom: '2px solid #f1f3f4',
                    paddingBottom: '0',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                  }}>
                    {/* 1. 首页 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'home' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'home' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('home')}
                    >
                      🏠 首页
                    </button>
                    {/* 2. 项目看板 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'board' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'board' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('board')}
                    >
                      📊 项目看板
                    </button>
                    {/* 3. 项目管理 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'project-management' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'project-management' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('project-management')}
                    >
                      🎯 项目管理
                    </button>
                    {/* 4. 项目文档 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'project-docs' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'project-docs' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('project-docs')}
                    >
                      📚 项目文档
                    </button>
                    {/* 4. 任务管理 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'tasks' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'tasks' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('tasks')}
                    >
                      📋 任务管理
                    </button>
                    {/* 5. 文档管理 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'file-management' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'file-management' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('file-management')}
                    >
                      📁 文档管理 ({projectDocuments.length})
                    </button>
                    {/* 6. 配置管理 (仅管理员) */}
                    {user.role === 'admin' && (
                      <button
                        style={{
                          padding: '12px 24px',
                          background: activeTab === 'config' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          color: activeTab === 'config' ? 'white' : '#495057',
                          border: 'none',
                          borderRadius: '8px 8px 0 0',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '-2px'
                        }}
                        onClick={() => setActiveTab('config')}
                      >
                        ⚙️ 配置管理
                      </button>
                    )}
                    {/* 7. 个人中心 */}
                    <button
                      style={{
                        padding: '12px 24px',
                        background: activeTab === 'profile' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'profile' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '-2px'
                      }}
                      onClick={() => setActiveTab('profile')}
                    >
                      👤 个人中心
                    </button>
                  </div>
                )}

                {/* 标签页内容 */}
                {/* 1. 首页 */}
                {activeTab === 'home' && (
                  <HomePage
                    projects={projects}
                    user={user}
                    systemSettings={systemSettings}
                    onProjectSelect={async (project) => {
                      await handleProjectSelect(project);
                      setActiveTab('board');
                    }}
                    isMobile={isMobile}
                  />
                )}

                {/* 2. 项目看板 */}
                {activeTab === 'board' && (() => {
                  console.log('🎯 渲染看板页面:', {
                    selectedProject: selectedProject?.name,
                    projectTasksLength: projectTasks.length,
                    projectTasksSample: projectTasks.slice(0, 3).map(t => ({
                      id: t.id,
                      title: t.title,
                      parent_task_id: t.parent_task_id
                    }))
                  });
                  return (
                    <ProjectBoard
                      selectedProject={selectedProject}
                      projectTasks={projectTasks}
                      user={user}
                      isMobile={isMobile}
                      systemSettings={systemSettings}
                    />
                  );
                })()}

                {/* 3. 项目管理 */}
                {activeTab === 'project-management' && (
                  <ProjectManagementDetail
                    user={user}
                    selectedProject={selectedProject?.name}
                    isMobile={isMobile}
                  />
                )}

                {/* 4. 项目文档 */}
                {activeTab === 'project-docs' && (
                  <ProjectDocumentation
                    selectedProject={selectedProject}
                    user={user}
                    isMobile={isMobile}
                  />
                )}

                {/* 4. 任务管理 */}
                {activeTab === 'tasks' && (
                  <TaskManagement
                    selectedProject={selectedProject}
                    projectTasks={projectTasks}
                    selectedTask={selectedTask}
                    subTasks={subTasks}
                    user={user}
                    showTaskForm={showTaskForm}
                    showSubTaskForm={showSubTaskForm}
                    editingTask={editingTask}
                    showTaskEditForm={showTaskEditForm}
                    newTask={newTask}
                    newSubTask={newSubTask}
                    error={error}
                    loading={loading}
                    setShowTaskForm={setShowTaskForm}
                    setShowSubTaskForm={setShowSubTaskForm}
                    setEditingTask={setEditingTask}
                    setShowTaskEditForm={setShowTaskEditForm}
                    setNewTask={setNewTask}
                    setNewSubTask={setNewSubTask}
                    handleTaskSelect={handleTaskSelect}
                    handleAddTask={handleAddTask}
                    handleUpdateTaskProgress={handleUpdateTaskProgress}
                    handleDeleteTask={handleDeleteTask}
                    handleEditTask={handleEditTask}
                    handleUpdateTask={handleUpdateTask}
                    handleAddSubTask={handleAddSubTask}
                    handleUpdateSubTask={handleUpdateSubTask}
                    handleDeleteSubTask={handleDeleteSubTask}
                    taskCommentCounts={taskCommentCounts}
                    selectedTaskForComments={selectedTaskForComments}
                    taskComments={taskComments}
                    showCommentPanel={showCommentPanel}
                    setShowCommentPanel={setShowCommentPanel}
                    handleShowTaskComments={handleShowTaskComments}
                    handleAddTaskComment={handleAddTaskComment}
                  />
                )}

                {/* 5. 文档管理 */}
                {activeTab === 'file-management' && (
                  <DocumentManagement
                    selectedProject={selectedProject}
                    projectDocuments={projectDocuments}
                    user={user}
                    onDocumentUploaded={() => fetchProjectDocuments(selectedProject?.id)}
                    onDocumentDeleted={() => fetchProjectDocuments(selectedProject?.id)}
                  />
                )}

                {/* 6. 配置管理 (仅管理员) */}
                {activeTab === 'config' && user.role === 'admin' && (
                  <ConfigManagement 
                    user={user} 
                    initialTab={configInitialTab}
                    key={configInitialTab} // 使用key强制重新渲染以更新tab
                  />
                )}

                {/* 7. 个人中心 */}
                {activeTab === 'profile' && (
                  <PersonalCenter 
                    user={user} 
                    systemSettings={systemSettings}
                    isMobile={isMobile}
                    onLogout={handleLogout}
                    onUserUpdate={(updatedUser) => {
                      setUser(updatedUser);
                      // 同时刷新页面以更新所有显示的头像
                      window.location.reload();
                    }}
                  />
                )}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '60px 30px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '30px' }}>📊</div>
                <h2 style={{ margin: '0 0 15px 0', color: '#495057' }}>欢迎使用项目管理系统</h2>
                <p style={{ margin: '0 0 30px 0', fontSize: '16px', color: '#6c757d' }}>
                  系统正在加载项目数据...
                </p>
              </div>
            )}
          </div>
        </main>

        {/* 移动端底部导航栏 */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
            padding: '8px 0',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            {/* 首页 */}
            <button
              onClick={() => setActiveTab('home')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'home' ? '#667eea' : '#6c757d',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>🏠</span>
              <span style={{ fontSize: '11px', fontWeight: activeTab === 'home' ? '600' : '400' }}>首页</span>
            </button>

            {/* 项目看板 */}
            <button
              onClick={() => setActiveTab('board')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'board' ? '#667eea' : '#6c757d',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>📊</span>
              <span style={{ fontSize: '11px', fontWeight: activeTab === 'board' ? '600' : '400' }}>看板</span>
            </button>

            {/* 项目文档 */}
            <button
              onClick={() => setActiveTab('project-docs')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'project-docs' ? '#667eea' : '#6c757d',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>📚</span>
              <span style={{ fontSize: '11px', fontWeight: activeTab === 'project-docs' ? '600' : '400' }}>文档</span>
            </button>

            {/* 个人中心 */}
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'profile' ? '#667eea' : '#6c757d',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>👤</span>
              <span style={{ fontSize: '11px', fontWeight: activeTab === 'profile' ? '600' : '400' }}>我的</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 登录/注册界面
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {showRegister ? (
          <div style={styles.form}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
              📊 注册账户
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #fcc',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  用户名 *
                </label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="请输入用户名"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  邮箱
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="请输入邮箱"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  姓名
                </label>
                <input
                  type="text"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="请输入姓名"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  密码 *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                    autoComplete="new-password"
                    data-password-toggle="false"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      WebkitTextSecurity: showRegisterPassword ? 'none' : 'disc'
                    }}
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '18px',
                      zIndex: 10
                    }}
                    title={showRegisterPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showRegisterPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  确认密码 *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                    autoComplete="new-password"
                    data-password-toggle="false"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc'
                    }}
                    placeholder="请再次输入密码"
                  />
                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '18px',
                      zIndex: 10
                    }}
                    title={showConfirmPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                {loading ? '注册中...' : '注册'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  已有账户？
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegister(false);
                      setError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginLeft: '5px'
                    }}
                  >
                    立即登录
                  </button>
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div style={styles.form}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
              📊 项目管理系统
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #fcc',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  用户名
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="请输入用户名"
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  密码
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                    autoComplete="current-password"
                    data-password-toggle="false"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      WebkitTextSecurity: showPassword ? 'none' : 'disc'
                    }}
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '18px',
                      zIndex: 10
                    }}
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                {loading ? '登录中...' : '登录'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  还没有账户？
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegister(true);
                      setError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginLeft: '5px'
                    }}
                  >
                    立即注册
                  </button>
                </span>
              </div>
            </form>

            <div style={{
              marginTop: '30px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6c757d'
            }}>
              <strong>测试账户：</strong><br />
              管理员：admin / admin123<br />
              客户：client / client123
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProjectManagementApp;
