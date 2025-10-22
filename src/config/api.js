// API配置
const API_BASE_URL = 'http://localhost:7080';

// 通用的 API 请求函数
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    // 暂时移除 credentials: 'include' 来避免 CORS 问题
    // credentials: 'include',
    ...options
  };

  // 合并headers
  if (options.headers) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      ...options.headers
    };
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      // 如果是 401 或 403 错误，清除本地存储的认证信息
      if (response.status === 401 || response.status === 403) {
        console.log('🔐 认证失败，清除本地存储的认证信息');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 触发自定义事件通知组件更新状态
        window.dispatchEvent(new CustomEvent('authenticationFailed'));
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 如果响应是JSON，解析它
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export { API_BASE_URL };

export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // 项目相关
  PROJECTS: `${API_BASE_URL}/api/projects`,
  PROJECT_DETAIL: (id) => `${API_BASE_URL}/api/projects/${id}`,
  PROJECT_PROGRESS: (id) => `${API_BASE_URL}/api/projects/${id}/progress`,
  PROJECT_TASKS: (id) => `${API_BASE_URL}/api/projects/${id}/tasks`,
  PROJECT_TASK: (projectId, taskId) => `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
  CLIENTS_LIST: `${API_BASE_URL}/api/projects/clients/list`,
  
  // 文档相关
  PROJECT_DOCUMENTS: (id) => `${API_BASE_URL}/api/documents/project/${id}`,
  UPLOAD_DOCUMENT: (id) => `${API_BASE_URL}/api/documents/project/${id}/upload`,
  DOWNLOAD_DOCUMENT: (id) => `${API_BASE_URL}/api/documents/${id}/download`,
  PREVIEW_DOCUMENT: (id) => `${API_BASE_URL}/api/documents/${id}/preview`,
  DOCUMENT: (id) => `${API_BASE_URL}/api/documents/${id}`,
  
  // 消息相关
  PROJECT_MESSAGES: (id) => `${API_BASE_URL}/api/messages/project/${id}`,
  SEND_MESSAGE: (id) => `${API_BASE_URL}/api/messages/project/${id}`,
  UNREAD_COUNT: `${API_BASE_URL}/api/messages/unread/count`,
  RECENT_MESSAGES: `${API_BASE_URL}/api/messages/recent`,
  MESSAGE: (id) => `${API_BASE_URL}/api/messages/${id}`,
  
  // Socket.IO
  SOCKET_URL: API_BASE_URL
};

export default API_BASE_URL;
