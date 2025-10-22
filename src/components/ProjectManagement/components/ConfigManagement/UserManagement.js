import React, { useState, useEffect } from 'react';
import { generateAvatar } from '../../../../utils/avatarGenerator';

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // 搜索和筛选
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'client',
    password: '',
    confirmPassword: '',
    status: 'active',
    notification_settings: {
      email_notifications: true,
      task_updates: true,
      project_updates: true,
      comment_mentions: true,
      weekly_reports: false
    }
  });

  // 响应式监听
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
        setFilteredUsers(data || []);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  // 搜索和筛选用户
  useEffect(() => {
    let result = [...users];
    
    // 按搜索词筛选
    if (searchTerm) {
      result = result.filter(u => 
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按角色筛选
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }
    
    // 按状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // 保存用户
  const handleSaveUser = async () => {
    if (!userForm.username || !userForm.email) {
      alert('请填写用户名和邮箱');
      return;
    }

    if (!editingUser && (!userForm.password || userForm.password !== userForm.confirmPassword)) {
      alert('请输入密码并确认密码一致');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingUser 
        ? `http://localhost:7080/api/auth/users/${editingUser.id}`
        : 'http://localhost:7080/api/auth/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const userData = {
        username: userForm.username,
        email: userForm.email,
        role: userForm.role,
        full_name: userForm.full_name || userForm.username,
        status: userForm.status || 'active'
      };

      if (!editingUser) {
        userData.password = userForm.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert(editingUser ? '✅ 用户更新成功！' : '✅ 用户创建成功！');
        setShowUserForm(false);
        setEditingUser(null);
        resetForm();
        fetchUsers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '操作失败');
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId) => {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ 用户删除成功！');
        fetchUsers();
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('❌ 删除失败，请重试');
    }
  };

  // 切换用户状态
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? '启用' : '禁用';
    
    if (!confirm(`确定要${action}该用户吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`✅ 用户已${action}！`);
        fetchUsers();
      } else {
        throw new Error(`${action}失败`);
      }
    } catch (error) {
      console.error('切换用户状态失败:', error);
      alert(`❌ ${action}失败，请重试`);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/auth/users/${resetPasswordUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        alert(`✅ 用户 ${resetPasswordUser.username} 的密码已重置！`);
        setShowResetPasswordDialog(false);
        setResetPasswordUser(null);
        setNewPassword('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '重置失败');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      alert(`❌ ${error.message}`);
    }
  };

  // 编辑用户
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      full_name: user.full_name || user.username,
      role: user.role,
      status: user.status || 'active',
      password: '',
      confirmPassword: '',
      notification_settings: user.notification_settings || {
        email_notifications: true,
        task_updates: true,
        project_updates: true,
        comment_mentions: true,
        weekly_reports: false
      }
    });
    setShowUserForm(true);
  };

  // 重置表单
  const resetForm = () => {
    setUserForm({
      username: '',
      email: '',
      full_name: '',
      role: 'client',
      password: '',
      confirmPassword: '',
      status: 'active',
      notification_settings: {
        email_notifications: true,
        task_updates: true,
        project_updates: true,
        comment_mentions: true,
        weekly_reports: false
      }
    });
  };

  // 获取用户统计
  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const projectManagers = users.filter(u => u.role === 'project_manager').length;
    const clients = users.filter(u => u.role === 'client').length;
    const active = users.filter(u => u.status === 'active' || !u.status).length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    
    return { total, admins, projectManagers, clients, active, inactive };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '从未登录';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getRoleName = (role) => {
    const roleMap = {
      'admin': '管理员',
      'project_manager': '项目经理',
      'client': '普通用户'
    };
    return roleMap[role] || '普通用户';
  };

  const getRoleColor = (role) => {
    const colorMap = {
      'admin': { bg: '#d4edda', color: '#155724' },          // 绿色 - 管理员
      'project_manager': { bg: '#fff3cd', color: '#856404' }, // 黄色 - 项目经理
      'client': { bg: '#e2e3e5', color: '#495057' }          // 灰色 - 普通用户
    };
    return colorMap[role] || colorMap['client'];
  };

  const getStatusName = (status) => {
    return status === 'inactive' ? '已禁用' : '正常';
  };

  const stats = getUserStats();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#1a73e8', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          👥 用户管理
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#666', 
          fontSize: '14px' 
        }}>
          管理系统用户账户、角色和权限
        </p>
      </div>

      {/* 用户统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(6, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>用户总数</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 2px 8px rgba(240, 147, 251, 0.3)'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {stats.admins}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>管理员</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 2px 8px rgba(255, 154, 86, 0.3)'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {stats.projectManagers}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>项目经理</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 2px 8px rgba(79, 172, 254, 0.3)'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {stats.clients}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>普通用户</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 2px 8px rgba(67, 233, 123, 0.3)'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {stats.active}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>启用中</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 2px 8px rgba(250, 112, 154, 0.3)'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {stats.inactive}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>已禁用</div>
        </div>
      </div>

      {/* 主内容区 */}
      <div style={{ 
        background: 'white', 
        padding: isMobile ? '16px' : '24px', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 搜索和筛选区域 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="🔍 搜索用户名、邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: isMobile ? 'none' : 1,
              padding: '10px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: isMobile ? '100%' : '150px'
            }}
          >
            <option value="all">全部角色</option>
            <option value="admin">管理员</option>
            <option value="project_manager">项目经理</option>
            <option value="client">普通用户</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: isMobile ? '100%' : '150px'
            }}
          >
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">已禁用</option>
          </select>
          
          <button
            onClick={() => {
              setEditingUser(null);
              resetForm();
              setShowUserForm(true);
            }}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
            }}
          >
            ➕ 新增用户
          </button>
        </div>
        
        {/* 用户列表 */}
        {isMobile ? (
          // 移动端：卡片视图
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map(u => (
              <div key={u.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '16px',
                background: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img 
                    src={u.avatar || generateAvatar(u.username)} 
                    alt={u.username}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '2px solid #667eea'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                      {u.full_name || u.username}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{u.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: getRoleColor(u.role).bg,
                    color: getRoleColor(u.role).color
                  }}>
                    {getRoleName(u.role)}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: u.status === 'inactive' ? '#f8d7da' : '#d1ecf1',
                    color: u.status === 'inactive' ? '#721c24' : '#0c5460'
                  }}>
                    {getStatusName(u.status)}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                  最后登录：{formatDate(u.last_login)}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleEditUser(u)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✏️ 编辑
                  </button>
                  <button
                    onClick={() => {
                      setResetPasswordUser(u);
                      setShowResetPasswordDialog(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#ffc107',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🔑 重置
                  </button>
                  <button
                    onClick={() => handleToggleUserStatus(u.id, u.status)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: u.status === 'inactive' ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {u.status === 'inactive' ? '✅ 启用' : '🚫 禁用'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // PC端：表格视图
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>用户</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>邮箱</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>角色</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>状态</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>最后登录</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>操作</th>
              </tr>
            </thead>
            <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={u.avatar || generateAvatar(u.username)} 
                          alt={u.username}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '2px solid #667eea'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '500', color: '#2c3e50' }}>
                            {u.full_name || u.username}
                          </div>
                          {u.full_name && (
                            <div style={{ fontSize: '12px', color: '#999' }}>@{u.username}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getRoleColor(u.role).bg,
                        color: getRoleColor(u.role).color
                      }}>
                        {getRoleName(u.role)}
                      </span>
                    </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                        padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                        background: u.status === 'inactive' ? '#f8d7da' : '#d1ecf1',
                        color: u.status === 'inactive' ? '#721c24' : '#0c5460'
                    }}>
                        {getStatusName(u.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6c757d' }}>
                      {formatDate(u.last_login)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                        onClick={() => handleEditUser(u)}
                      style={{
                        padding: '6px 12px',
                        background: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                          marginRight: '4px'
                        }}
                        title="编辑用户"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setResetPasswordUser(u);
                          setShowResetPasswordDialog(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#ffc107',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '4px'
                        }}
                        title="重置密码"
                      >
                        🔑
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        style={{
                          padding: '6px 12px',
                          background: u.status === 'inactive' ? '#28a745' : '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '4px'
                        }}
                        title={u.status === 'inactive' ? '启用用户' : '禁用用户'}
                      >
                        {u.status === 'inactive' ? '✅' : '🚫'}
                    </button>
                    <button
                        onClick={() => handleDeleteUser(u.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                        title="删除用户"
                    >
                        🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {filteredUsers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <div style={{ fontSize: '16px' }}>
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? '未找到符合条件的用户'
                : '暂无用户数据'
              }
            </div>
          </div>
        )}
      </div>

      {/* 用户表单模态框 */}
      {showUserForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: isMobile ? '20px' : '0'
        }}>
          <div style={{
            background: 'white',
            padding: isMobile ? '20px' : '32px',
            borderRadius: '16px',
            width: isMobile ? '100%' : '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h4 style={{ 
              margin: '0 0 24px 0',
              fontSize: '20px',
              color: '#2c3e50',
              borderBottom: '2px solid #667eea',
              paddingBottom: '12px'
            }}>
              {editingUser ? '✏️ 编辑用户' : '➕ 新增用户'}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                  用户名 <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="输入用户名"
                  disabled={editingUser} // 编辑时不允许修改用户名
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: editingUser ? '#f8f9fa' : 'white'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                  邮箱 <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="输入邮箱地址"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                  全名
                </label>
                <input
                  type="text"
                  value={userForm.full_name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="输入全名（可选）"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                  角色
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="client">普通用户</option>
                  <option value="project_manager">项目经理</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                  账户状态
                </label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="active">正常</option>
                  <option value="inactive">已禁用</option>
                </select>
              </div>
              
              {!editingUser && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                      密码 <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="输入密码（至少6位）"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                      确认密码 <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="再次输入密码"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
              <button
                onClick={() => {
                  setShowUserForm(false);
                  setEditingUser(null);
                }}
                style={{
                  padding: '10px 24px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                取消
              </button>
              
              <button
                onClick={handleSaveUser}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: loading ? 'none' : '0 2px 8px rgba(40, 167, 69, 0.3)'
                }}
              >
                {loading ? '保存中...' : '💾 保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重置密码对话框 */}
      {showResetPasswordDialog && resetPasswordUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: isMobile ? '20px' : '0'
        }}>
          <div style={{
            background: 'white',
            padding: isMobile ? '20px' : '32px',
            borderRadius: '16px',
            width: isMobile ? '100%' : '90%',
            maxWidth: '500px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h4 style={{ 
              margin: '0 0 20px 0',
              fontSize: '18px',
              color: '#2c3e50'
            }}>
              🔑 重置用户密码
            </h4>
            
            <div style={{
              padding: '16px',
              background: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', color: '#856404' }}>
                正在为用户 <strong>{resetPasswordUser.username}</strong> 重置密码
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' }}>
                新密码 <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="输入新密码（至少6位）"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowResetPasswordDialog(false);
                  setResetPasswordUser(null);
                  setNewPassword('');
                }}
                style={{
                  padding: '10px 24px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                取消
              </button>
              
              <button
                onClick={handleResetPassword}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
                }}
              >
                🔑 确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
