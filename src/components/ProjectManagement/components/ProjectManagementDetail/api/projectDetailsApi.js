// 项目详情相关API调用

const API_BASE_URL = 'http://localhost:7080/api';

// 获取所有用户列表
export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('获取用户列表失败');
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 获取项目列表
export const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const projectsData = await response.json();
      // 转换后端数据格式为前端需要的格式
      return projectsData.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        status: p.status || '规划中',
        startDate: p.start_date || '',
        endDate: p.end_date || '',
        progress: p.progress || 0,
        budget: p.budget || '',
        department: p.department || '',
        priority: p.priority || '中',
        type: p.type || '',
        customer: p.client_name || p.customer || '',
        manager: p.manager_name || p.manager || '',
        team: p.team || '',
        isDefault: p.is_default || false,
        clientId: p.client_id,
        managerId: p.manager_id
      }));
    }
    throw new Error('获取项目列表失败');
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return [];
  }
};

// 获取项目成员
export const fetchMembers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/project-details/members`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // 转换后端字段名为前端格式
      return data.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        department: m.department,
        phone: m.phone,
        email: m.email,
        joinDate: m.join_date,
        status: m.status,
        projectId: m.project_id,
        userId: m.user_id
      }));
    }
    throw new Error('获取项目成员失败');
  } catch (error) {
    console.error('获取项目成员失败:', error);
    return [];
  }
};

// 保存成员（新增或更新）
export const saveMember = async (memberData, memberId = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = memberId 
      ? `${API_BASE_URL}/project-details/members/${memberId}`
      : `${API_BASE_URL}/project-details/members`;
    const method = memberId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(memberData)
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('保存成员失败:', error);
    throw error;
  }
};

// 删除成员
export const deleteMember = async (memberId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/project-details/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('删除成员失败:', error);
    throw error;
  }
};

// 获取服务器列表
export const fetchServers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/project-details/servers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // 转换后端字段名为前端格式
      return data.map(s => ({
        id: s.id,
        name: s.name,
        ip: s.ip,
        type: s.type,
        cpu: s.cpu,
        memory: s.memory,
        disk: s.disk,
        status: s.status,
        purpose: s.purpose,
        remark: s.remark,
        projectId: s.project_id
      }));
    }
    throw new Error('获取服务器列表失败');
  } catch (error) {
    console.error('获取服务器列表失败:', error);
    return [];
  }
};

// 保存服务器（新增或更新）
export const saveServer = async (serverData, serverId = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = serverId 
      ? `${API_BASE_URL}/project-details/servers/${serverId}`
      : `${API_BASE_URL}/project-details/servers`;
    const method = serverId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serverData)
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('保存服务器失败:', error);
    throw error;
  }
};

// 删除服务器
export const deleteServer = async (serverId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/project-details/servers/${serverId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('删除服务器失败:', error);
    throw error;
  }
};

// 获取软件资料列表
export const fetchResources = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/project-details/resources`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // 转换后端字段名为前端格式
      return data.map(r => ({
        id: r.id,
        name: r.name,
        version: r.version,
        type: r.type,
        license: r.license,
        updateDate: r.update_date,
        description: r.description,
        downloadUrl: r.download_url,
        projectId: r.project_id
      }));
    }
    throw new Error('获取软件资料失败');
  } catch (error) {
    console.error('获取软件资料失败:', error);
    return [];
  }
};

// 保存软件资料（新增或更新）
export const saveResource = async (resourceData, resourceId = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = resourceId 
      ? `${API_BASE_URL}/project-details/resources/${resourceId}`
      : `${API_BASE_URL}/project-details/resources`;
    const method = resourceId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resourceData)
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('保存软件资料失败:', error);
    throw error;
  }
};

// 删除软件资料
export const deleteResource = async (resourceId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/project-details/resources/${resourceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('删除软件资料失败:', error);
    throw error;
  }
};

// 保存项目（新增或更新）
export const saveProject = async (projectData, projectId = null) => {
  try {
    const token = localStorage.getItem('token');
    const url = projectId 
      ? `${API_BASE_URL}/projects/${projectId}`
      : `${API_BASE_URL}/projects`;
    const method = projectId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || '保存项目失败');
    }

    return await response.json();
  } catch (error) {
    console.error('保存项目失败:', error);
    throw error;
  }
};

// 删除项目
export const deleteProject = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      return { success: true };
    }
    const errorData = await response.json();
    throw new Error(errorData.error || '未知错误');
  } catch (error) {
    console.error('删除项目失败:', error);
    throw error;
  }
};

