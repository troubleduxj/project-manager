import React, { useState, useEffect } from 'react';

const ProjectConfig = ({ user }) => {
  const [config, setConfig] = useState({
    // 项目默认设置
    defaultSettings: {
      defaultPriority: 'medium',
      defaultStatus: 'planning',
      defaultCurrency: 'CNY',
      defaultTimeZone: 'Asia/Shanghai',
      autoAssignId: true,
      enableVersionControl: true
    },
    // 工作时间设置
    workingTime: {
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
      overtimeEnabled: false,
      breakTime: {
        start: '12:00',
        end: '13:00'
      }
    },
    // 项目流程设置
    workflow: {
      requireApproval: true,
      approvalLevels: 2,
      autoStatusUpdate: true,
      milestoneTracking: true,
      progressCalculation: 'auto', // auto, manual
      taskDependency: true
    },
    // 通知设置
    notifications: {
      projectCreation: true,
      statusChange: true,
      milestoneReached: true,
      deadlineReminder: true,
      reminderDaysBefore: 3,
      emailNotifications: true,
      systemNotifications: true
    },
    // 文档管理设置（增强版 - 整合了DocumentConfig的所有功能）
    documentSettings: {
      // 基础设置
      maxFileSize: 50, // MB
      allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'png', 'txt', 'md'],
      retentionDays: 365,
      // 预览设置（来自DocumentConfig）
      previewableTypes: ['pdf', 'txt', 'md', 'doc', 'docx'],
      autoPreview: true,
      // 高级功能（来自DocumentConfig）
      autoVersioning: true,
      requireApproval: false,
      compressionEnabled: true, // 来自DocumentConfig
      downloadPermission: 'all' // all, admin, none（来自DocumentConfig）
    },
    // 显示偏好
    displayPreferences: {
      defaultView: 'card', // card, list, kanban
      itemsPerPage: 20,
      showProgressBar: true,
      showBudgetInfo: true,
      showTeamMembers: true,
      compactMode: false
    },
    // 安全设置
    security: {
      projectVisibility: 'role-based', // public, private, role-based
      allowGuestAccess: false,
      dataEncryption: true,
      auditLog: true,
      sessionTimeout: 30 // minutes
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('defaultSettings');
  const [documentStats, setDocumentStats] = useState({
    totalDocs: 0,
    storageUsed: '0 MB',
    storageRate: 0,
    monthlyUploads: 0
  });

  // 获取文档存储统计
  useEffect(() => {
    fetchDocumentStats();
  }, []);

  const fetchDocumentStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/documents/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const stats = await response.json();
        setDocumentStats({
          totalDocs: stats.totalDocuments || 0,
          storageUsed: formatStorageSize(stats.totalSize || 0),
          storageRate: calculateStorageRate(stats.totalSize || 0),
          monthlyUploads: stats.monthlyUploads || 0
        });
      }
    } catch (error) {
      console.error('获取文档统计失败:', error);
      // 保持初始值
    }
  };

  // 格式化存储大小
  const formatStorageSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    } else if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${bytes} B`;
    }
  };

  // 计算存储使用率（假设总容量为10GB）
  const calculateStorageRate = (bytes) => {
    const totalCapacity = 10 * 1024 * 1024 * 1024; // 10GB
    const rate = (bytes / totalCapacity) * 100;
    return Math.min(Math.round(rate), 100);
  };

  // 优先级选项
  const priorityOptions = [
    { value: 'low', label: '低', color: '#4caf50' },
    { value: 'medium', label: '中', color: '#ff9800' },
    { value: 'high', label: '高', color: '#f44336' },
    { value: 'critical', label: '紧急', color: '#9c27b0' }
  ];

  // 项目状态选项
  const statusOptions = [
    { value: 'planning', label: '规划中', color: '#ff9800' },
    { value: 'active', label: '进行中', color: '#4caf50' },
    { value: 'paused', label: '已暂停', color: '#f44336' },
    { value: 'completed', label: '已完成', color: '#2196f3' },
    { value: 'cancelled', label: '已取消', color: '#9e9e9e' }
  ];

  // 工作日选项
  const weekdayOptions = [
    { value: 'monday', label: '周一' },
    { value: 'tuesday', label: '周二' },
    { value: 'wednesday', label: '周三' },
    { value: 'thursday', label: '周四' },
    { value: 'friday', label: '周五' },
    { value: 'saturday', label: '周六' },
    { value: 'sunday', label: '周日' }
  ];

  // 文件类型选项（整合了DocumentConfig的完整列表）
  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF文档', icon: '📄' },
    { value: 'doc', label: 'Word (.doc)', icon: '📝' },
    { value: 'docx', label: 'Word (.docx)', icon: '📝' },
    { value: 'xls', label: 'Excel (.xls)', icon: '📊' },
    { value: 'xlsx', label: 'Excel (.xlsx)', icon: '📊' },
    { value: 'ppt', label: 'PowerPoint (.ppt)', icon: '📊' },
    { value: 'pptx', label: 'PowerPoint (.pptx)', icon: '📊' },
    { value: 'txt', label: '纯文本', icon: '📄' },
    { value: 'md', label: 'Markdown', icon: '📝' },
    { value: 'jpg', label: 'JPG图片', icon: '🖼️' },
    { value: 'jpeg', label: 'JPEG图片', icon: '🖼️' },
    { value: 'png', label: 'PNG图片', icon: '🖼️' },
    { value: 'gif', label: 'GIF图片', icon: '🖼️' },
    { value: 'zip', label: 'ZIP压缩包', icon: '📦' },
    { value: 'rar', label: 'RAR压缩包', icon: '📦' }
  ];

  // 处理工作日选择
  const handleWorkingDayChange = (day, checked) => {
    setConfig(prev => ({
      ...prev,
      workingTime: {
        ...prev.workingTime,
      workingDays: checked 
          ? [...prev.workingTime.workingDays, day]
          : prev.workingTime.workingDays.filter(d => d !== day)
      }
    }));
  };

  // 处理文件类型选择
  const handleFileTypeChange = (type, checked) => {
    setConfig(prev => ({
      ...prev,
      documentSettings: {
        ...prev.documentSettings,
        allowedFileTypes: checked
          ? [...prev.documentSettings.allowedFileTypes, type]
          : prev.documentSettings.allowedFileTypes.filter(t => t !== type)
      }
    }));
  };

  // 处理预览类型选择
  const handlePreviewTypeChange = (type, checked) => {
    setConfig(prev => ({
      ...prev,
      documentSettings: {
        ...prev.documentSettings,
        previewableTypes: checked
          ? [...prev.documentSettings.previewableTypes, type]
          : prev.documentSettings.previewableTypes.filter(t => t !== type)
      }
    }));
  };

  // 保存配置
  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // TODO: 调用API保存配置
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      alert('✅ 全局项目配置保存成功！');
    } catch (error) {
      console.error('保存配置失败:', error);
      alert('❌ 保存配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置配置
  const handleResetConfig = () => {
    if (confirm('确定要重置为默认配置吗？此操作不可撤销。')) {
      setConfig({
        defaultSettings: {
          defaultPriority: 'medium',
          defaultStatus: 'planning',
          defaultCurrency: 'CNY',
          defaultTimeZone: 'Asia/Shanghai',
          autoAssignId: true,
          enableVersionControl: true
        },
        workingTime: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: { start: '09:00', end: '18:00' },
          overtimeEnabled: false,
          breakTime: { start: '12:00', end: '13:00' }
        },
        workflow: {
          requireApproval: true,
          approvalLevels: 2,
          autoStatusUpdate: true,
          milestoneTracking: true,
          progressCalculation: 'auto',
          taskDependency: true
        },
        notifications: {
          projectCreation: true,
          statusChange: true,
          milestoneReached: true,
          deadlineReminder: true,
          reminderDaysBefore: 3,
          emailNotifications: true,
          systemNotifications: true
        },
        documentSettings: {
          maxFileSize: 50,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'png', 'txt', 'md'],
          retentionDays: 365,
          previewableTypes: ['pdf', 'txt', 'md', 'doc', 'docx'],
          autoPreview: true,
          autoVersioning: true,
          requireApproval: false,
          compressionEnabled: true,
          downloadPermission: 'all'
        },
        displayPreferences: {
          defaultView: 'card',
          itemsPerPage: 20,
          showProgressBar: true,
          showBudgetInfo: true,
          showTeamMembers: true,
          compactMode: false
        },
        security: {
          projectVisibility: 'role-based',
          allowGuestAccess: false,
          dataEncryption: true,
          auditLog: true,
          sessionTimeout: 30
        }
      });
      alert('✅ 配置已重置为默认值');
    }
  };

  const sections = [
    { id: 'defaultSettings', label: '📋 默认设置', icon: '📋' },
    { id: 'workingTime', label: '⏰ 工作时间', icon: '⏰' },
    { id: 'workflow', label: '🔄 工作流程', icon: '🔄' },
    { id: 'notifications', label: '🔔 通知规则', icon: '🔔' },
    { id: 'documentSettings', label: '📁 文档管理', icon: '📁' },
    { id: 'displayPreferences', label: '🎨 显示偏好', icon: '🎨' },
    { id: 'security', label: '🔒 安全设置', icon: '🔒' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#1a73e8', 
          fontSize: '20px',
          fontWeight: '600'
        }}>
          ⚙️ 项目管理通用配置
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          配置全局项目管理规范、默认设置和应用习惯（这些设置将应用于所有项目）
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        {/* 左侧导航 */}
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                margin: '4px 0',
                background: activeSection === section.id ? '#f0f8ff' : 'transparent',
                border: activeSection === section.id ? '1px solid #1976d2' : '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeSection === section.id ? '600' : '500',
                color: activeSection === section.id ? '#1976d2' : '#333',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label.replace(/^.+ /, '')}</span>
            </button>
          ))}
        </div>

        {/* 右侧内容 */}
      <div style={{ display: 'grid', gap: '24px' }}>
          {/* 默认设置 */}
          {activeSection === 'defaultSettings' && (
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
              padding: '24px'
        }}>
          <h4 style={{ 
                margin: '0 0 20px 0', 
            color: '#333',
                fontSize: '18px',
            fontWeight: '600'
          }}>
                📋 项目默认设置
          </h4>
          
              <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                      color: '#333',
                    fontSize: '14px'
                    }}>
                      默认优先级
                </label>
                    <select
                      value={config.defaultSettings.defaultPriority}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        defaultSettings: {
                          ...prev.defaultSettings,
                          defaultPriority: e.target.value
                        }
                  }))}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                    border: '1px solid #ddd',
                        borderRadius: '6px',
                    fontSize: '14px'
                  }}
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                    }}>
                      默认状态
                </label>
                <select
                      value={config.defaultSettings.defaultStatus}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        defaultSettings: {
                          ...prev.defaultSettings,
                          defaultStatus: e.target.value
                        }
                  }))}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                    border: '1px solid #ddd',
                        borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                }}>
                      默认货币
                </label>
                <select
                      value={config.defaultSettings.defaultCurrency}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        defaultSettings: {
                          ...prev.defaultSettings,
                          defaultCurrency: e.target.value
                        }
                  }))}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                    border: '1px solid #ddd',
                        borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                      <option value="CNY">人民币 (¥)</option>
                      <option value="USD">美元 ($)</option>
                      <option value="EUR">欧元 (€)</option>
                      <option value="JPY">日元 (¥)</option>
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                }}>
                      默认时区
                </label>
                <select
                      value={config.defaultSettings.defaultTimeZone}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        defaultSettings: {
                          ...prev.defaultSettings,
                          defaultTimeZone: e.target.value
                        }
                  }))}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                    border: '1px solid #ddd',
                        borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                  <option value="UTC">世界标准时间 (UTC)</option>
                  <option value="America/New_York">纽约时间 (UTC-5)</option>
                  <option value="Europe/London">伦敦时间 (UTC+0)</option>
                </select>
          </div>
        </div>

        <div style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e1e5e9'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
            color: '#333',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                <input
                      type="checkbox"
                      checked={config.defaultSettings.autoAssignId}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        defaultSettings: {
                          ...prev.defaultSettings,
                          autoAssignId: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500' }}>自动分配项目编号</span>
                  </label>
                  
                <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer'
                  }}>
                <input
                      type="checkbox"
                      checked={config.defaultSettings.enableVersionControl}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        defaultSettings: {
                          ...prev.defaultSettings,
                          enableVersionControl: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500' }}>启用版本控制</span>
                  </label>
              </div>
            </div>
            </div>
          )}

          {/* 工作时间设置 */}
          {activeSection === 'workingTime' && (
            <div style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                color: '#333',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                ⏰ 工作时间设置
              </h4>
              
              <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: '500',
                    color: '#333',
                    fontSize: '14px'
              }}>
                工作日设置
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {weekdayOptions.map(day => (
                  <label key={day.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                        background: config.workingTime.workingDays.includes(day.value) ? '#e3f2fd' : 'white',
                        borderColor: config.workingTime.workingDays.includes(day.value) ? '#1976d2' : '#e0e0e0',
                        transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="checkbox"
                          checked={config.workingTime.workingDays.includes(day.value)}
                      onChange={(e) => handleWorkingDayChange(day.value, e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                    />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                }}>
                  工作开始时间
                </label>
                <input
                  type="time"
                      value={config.workingTime.workingHours.start}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        workingTime: {
                          ...prev.workingTime,
                    workingHours: {
                            ...prev.workingTime.workingHours,
                      start: e.target.value
                          }
                    }
                  }))}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                    border: '1px solid #ddd',
                        borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                }}>
                  工作结束时间
                </label>
                <input
                  type="time"
                      value={config.workingTime.workingHours.end}
                      onChange={(e) => setConfig(prev => ({
                    ...prev,
                        workingTime: {
                          ...prev.workingTime,
                    workingHours: {
                            ...prev.workingTime.workingHours,
                      end: e.target.value
                          }
                    }
                  }))}
                  style={{
                    width: '100%',
                        padding: '10px 12px',
                    border: '1px solid #ddd',
                        borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                    }}>
                      休息开始时间
                    </label>
                    <input
                      type="time"
                      value={config.workingTime.breakTime.start}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        workingTime: {
                          ...prev.workingTime,
                          breakTime: {
                            ...prev.workingTime.breakTime,
                            start: e.target.value
                          }
                        }
                      }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#333',
                      fontSize: '14px'
                    }}>
                      休息结束时间
                    </label>
                    <input
                      type="time"
                      value={config.workingTime.breakTime.end}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        workingTime: {
                          ...prev.workingTime,
                          breakTime: {
                            ...prev.workingTime.breakTime,
                            end: e.target.value
                          }
                        }
                      }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
          </div>
        </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={config.workingTime.overtimeEnabled}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      workingTime: {
                        ...prev.workingTime,
                        overtimeEnabled: e.target.checked
                      }
                    }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '500' }}>允许加班时间统计</span>
                </label>
              </div>
            </div>
          )}

          {/* 工作流程设置 */}
          {activeSection === 'workflow' && (
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
              padding: '24px'
        }}>
          <h4 style={{ 
                margin: '0 0 20px 0', 
            color: '#333',
                fontSize: '18px',
            fontWeight: '600'
          }}>
                🔄 工作流程设置
          </h4>
          
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e1e5e9'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.workflow.requireApproval}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        workflow: {
                          ...prev.workflow,
                          requireApproval: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500' }}>项目创建需要审批</span>
                  </label>
                  
                  {config.workflow.requireApproval && (
                    <div style={{ marginLeft: '28px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                        fontSize: '13px',
                        color: '#666'
              }}>
                        审批级别数
              </label>
              <input
                type="number"
                        min="1"
                        max="5"
                        value={config.workflow.approvalLevels}
                        onChange={(e) => setConfig(prev => ({
                  ...prev,
                          workflow: {
                            ...prev.workflow,
                            approvalLevels: parseInt(e.target.value) || 1
                          }
                }))}
                style={{
                          width: '100px',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
                    </div>
                  )}
            </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={config.workflow.autoStatusUpdate}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      workflow: {
                        ...prev.workflow,
                        autoStatusUpdate: e.target.checked
                      }
                    }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>自动更新项目状态</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      根据任务完成情况自动更新项目状态
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={config.workflow.milestoneTracking}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      workflow: {
                        ...prev.workflow,
                        milestoneTracking: e.target.checked
                      }
                    }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>启用里程碑跟踪</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      跟踪项目重要节点和里程碑
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={config.workflow.taskDependency}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      workflow: {
                        ...prev.workflow,
                        taskDependency: e.target.checked
                      }
                    }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>启用任务依赖关系</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      允许设置任务之间的依赖关系
                    </div>
                  </div>
                </label>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                    color: '#333',
                    fontSize: '14px'
              }}>
                    进度计算方式
              </label>
              <select
                    value={config.workflow.progressCalculation}
                    onChange={(e) => setConfig(prev => ({
                  ...prev,
                      workflow: {
                        ...prev.workflow,
                        progressCalculation: e.target.value
                      }
                }))}
                style={{
                  width: '100%',
                      padding: '10px 12px',
                  border: '1px solid #ddd',
                      borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                    <option value="auto">自动计算（基于任务完成情况）</option>
                    <option value="manual">手动设置</option>
              </select>
            </div>
          </div>
        </div>
          )}

        {/* 通知设置 */}
          {activeSection === 'notifications' && (
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
              padding: '24px'
        }}>
          <h4 style={{ 
                margin: '0 0 20px 0', 
            color: '#333',
                fontSize: '18px',
            fontWeight: '600'
          }}>
                🔔 通知规则设置
          </h4>
          
              <div style={{ display: 'grid', gap: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
                  gap: '10px',
              fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                    checked={config.notifications.projectCreation}
                    onChange={(e) => setConfig(prev => ({
                  ...prev,
                      notifications: {
                        ...prev.notifications,
                        projectCreation: e.target.checked
                      }
                }))}
                    style={{ width: '18px', height: '18px' }}
              />
                  <span style={{ fontWeight: '500' }}>项目创建通知</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
                  gap: '10px',
              fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                    checked={config.notifications.statusChange}
                    onChange={(e) => setConfig(prev => ({
                  ...prev,
                      notifications: {
                        ...prev.notifications,
                        statusChange: e.target.checked
                      }
                }))}
                    style={{ width: '18px', height: '18px' }}
              />
                  <span style={{ fontWeight: '500' }}>状态变更通知</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
                  gap: '10px',
              fontSize: '14px',
                  color: '#333',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                    checked={config.notifications.milestoneReached}
                    onChange={(e) => setConfig(prev => ({
                  ...prev,
                      notifications: {
                        ...prev.notifications,
                        milestoneReached: e.target.checked
                      }
                }))}
                    style={{ width: '18px', height: '18px' }}
              />
                  <span style={{ fontWeight: '500' }}>里程碑达成通知</span>
            </label>

                <div style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e1e5e9'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.notifications.deadlineReminder}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          deadlineReminder: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500' }}>截止日期提醒</span>
                  </label>
                  
                  {config.notifications.deadlineReminder && (
                    <div style={{ marginLeft: '28px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        提前提醒天数
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={config.notifications.reminderDaysBefore}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            reminderDaysBefore: parseInt(e.target.value) || 1
                          }
                        }))}
                        style={{
                          width: '100px',
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
          </div>
                  )}
        </div>

                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: '#e3f2fd',
                  borderRadius: '6px',
                  border: '1px solid #90caf9'
                }}>
                  <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#1976d2',
                    fontSize: '14px'
                  }}>
                    通知渠道
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.notifications.emailNotifications}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          emailNotifications: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>📧 邮件通知</span>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.notifications.systemNotifications}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          systemNotifications: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>🔔 系统通知</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 文档管理设置（增强版 - 整合了DocumentConfig的所有功能） */}
          {activeSection === 'documentSettings' && (
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
              padding: '24px'
        }}>
          <h4 style={{ 
                margin: '0 0 20px 0', 
            color: '#333',
                fontSize: '18px',
            fontWeight: '600'
          }}>
                📁 文档管理设置
          </h4>
          
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* 基础设置 */}
                <div>
                  <h5 style={{
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#555'
                  }}>
                    📎 基础设置
                  </h5>
                  
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '14px'
                      }}>
                        最大文件大小 (MB)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={config.documentSettings.maxFileSize}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            maxFileSize: parseInt(e.target.value) || 1
                          }
                        }))}
                        style={{
                          width: '200px',
                          padding: '10px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        marginTop: '6px' 
                      }}>
                        建议设置为50MB以下，过大的文件可能影响系统性能
                      </div>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '12px', 
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '14px'
                      }}>
                        允许的文件类型
                      </label>
          <div style={{
            display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '10px'
                      }}>
                        {fileTypeOptions.map(type => (
                          <label key={type.value} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: config.documentSettings.allowedFileTypes.includes(type.value) ? '#e3f2fd' : 'white',
                            borderColor: config.documentSettings.allowedFileTypes.includes(type.value) ? '#1976d2' : '#e0e0e0',
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                          }}>
                            <input
                              type="checkbox"
                              checked={config.documentSettings.allowedFileTypes.includes(type.value)}
                              onChange={(e) => handleFileTypeChange(type.value, e.target.checked)}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '14px'
                      }}>
                        文档保留天数
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="3650"
                        value={config.documentSettings.retentionDays}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            retentionDays: parseInt(e.target.value) || 30
                          }
                        }))}
                        style={{
                          width: '200px',
                          padding: '10px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
            <div style={{
                        fontSize: '12px', 
                        color: '#666', 
                        marginTop: '6px' 
                      }}>
                        已删除文档在回收站保留的天数
                      </div>
                    </div>
                  </div>
                </div>

                {/* 预览设置 */}
                <div>
                  <h5 style={{
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#555'
                  }}>
                    👁️ 预览设置
                  </h5>
                  
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.documentSettings.autoPreview}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            autoPreview: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>启用自动预览</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          点击文档时自动打开预览窗口
                        </div>
                      </div>
                    </label>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '12px', 
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '14px'
                      }}>
                        支持预览的文件类型
                      </label>
              <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '10px'
                      }}>
                        {config.documentSettings.allowedFileTypes.map(type => {
                          const option = fileTypeOptions.find(opt => opt.value === type);
                          if (!option) return null;
                          
                          return (
                            <label key={type} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              background: config.documentSettings.previewableTypes.includes(type) ? '#e8f5e9' : 'white',
                              borderColor: config.documentSettings.previewableTypes.includes(type) ? '#4caf50' : '#e0e0e0',
                              fontSize: '13px',
                              transition: 'all 0.2s ease'
                            }}>
                              <input
                                type="checkbox"
                                checked={config.documentSettings.previewableTypes.includes(type)}
                                onChange={(e) => handlePreviewTypeChange(type, e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                              />
                              <span>{option.icon}</span>
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
              </div>
                    </div>
              </div>
            </div>

                {/* 高级功能 */}
                <div>
                  <h5 style={{
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#555'
                  }}>
                    ⚙️ 高级功能
                  </h5>
                  
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      padding: '16px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.documentSettings.autoVersioning}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            autoVersioning: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>启用自动版本管理</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          上传同名文件时自动创建新版本，保留文档历史
                        </div>
                      </div>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      padding: '16px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.documentSettings.compressionEnabled}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            compressionEnabled: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>启用文件压缩</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          自动压缩大文件以节省存储空间
                        </div>
                      </div>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      padding: '16px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.documentSettings.requireApproval}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            requireApproval: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>文档上传需要审批</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          上传的文档需要管理员审批后才能查看
                        </div>
                      </div>
                    </label>
            
            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
                      border: '1px solid #e1e5e9'
                    }}>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        文档下载权限
                      </label>
                      <select
                        value={config.documentSettings.downloadPermission}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          documentSettings: {
                            ...prev.documentSettings,
                            downloadPermission: e.target.value
                          }
                        }))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="all">所有用户可下载</option>
                        <option value="admin">仅管理员可下载</option>
                        <option value="none">禁止下载（仅在线预览）</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 存储统计 */}
                <div>
                  <h5 style={{
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#555'
                  }}>
                    📊 存储统计
                  </h5>
                  
              <div style={{ 
                    padding: '16px',
                    background: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#856404'
                  }}>
                    ℹ️ 统计数据来自系统实时数据。如显示为0，表示暂无上传的文档。
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}>
                      <div style={{ 
                        fontSize: '32px', 
                fontWeight: 'bold', 
                        marginBottom: '8px'
              }}>
                        {documentStats.totalDocs}
              </div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        总文档数量
              </div>
                    </div>
                    
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
                    }}>
                      <div style={{ 
                        fontSize: documentStats.storageUsed.length > 10 ? '24px' : '32px', 
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        {documentStats.storageUsed}
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        已使用存储
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
                    }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        {documentStats.storageRate}%
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        存储使用率
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        opacity: 0.8,
                        marginTop: '4px'
                      }}>
                        （总容量10GB）
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)'
                    }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        {documentStats.monthlyUploads}
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        本月上传
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 显示偏好设置 */}
          {activeSection === 'displayPreferences' && (
            <div style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                color: '#333',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                🎨 显示偏好设置
              </h4>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    默认视图模式
                  </label>
                  <select
                    value={config.displayPreferences.defaultView}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      displayPreferences: {
                        ...prev.displayPreferences,
                        defaultView: e.target.value
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="card">卡片视图</option>
                    <option value="list">列表视图</option>
                    <option value="kanban">看板视图</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    每页显示项目数
                  </label>
                  <select
                    value={config.displayPreferences.itemsPerPage}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      displayPreferences: {
                        ...prev.displayPreferences,
                        itemsPerPage: parseInt(e.target.value)
                      }
                    }))}
                    style={{
                      width: '200px',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
            </div>
            
            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
                  border: '1px solid #e1e5e9'
            }}>
              <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    显示内容
              </div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.displayPreferences.showProgressBar}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          displayPreferences: {
                            ...prev.displayPreferences,
                            showProgressBar: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>显示进度条</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.displayPreferences.showBudgetInfo}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          displayPreferences: {
                            ...prev.displayPreferences,
                            showBudgetInfo: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>显示预算信息</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.displayPreferences.showTeamMembers}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          displayPreferences: {
                            ...prev.displayPreferences,
                            showTeamMembers: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>显示团队成员</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={config.displayPreferences.compactMode}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          displayPreferences: {
                            ...prev.displayPreferences,
                            compactMode: e.target.checked
                          }
                        }))}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>紧凑模式</span>
                    </label>
              </div>
            </div>
              </div>
            </div>
          )}
            
          {/* 安全设置 */}
          {activeSection === 'security' && (
            <div style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                color: '#333',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                🔒 安全设置
              </h4>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    项目可见性设置
                  </label>
                  <select
                    value={config.security.projectVisibility}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        projectVisibility: e.target.value
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="public">公开（所有用户可见）</option>
                    <option value="private">私有（仅项目成员可见）</option>
                    <option value="role-based">基于角色（根据权限设置）</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    会话超时时间（分钟）
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={config.security.sessionTimeout}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        sessionTimeout: parseInt(e.target.value) || 30
                      }
                    }))}
                    style={{
                      width: '200px',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.security.allowGuestAccess}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          allowGuestAccess: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>允许访客访问</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        允许未登录用户查看公开项目
                      </div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.security.dataEncryption}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          dataEncryption: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>启用数据加密</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        对敏感数据进行加密存储
              </div>
              </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#333',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={config.security.auditLog}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          auditLog: e.target.checked
                        }
                      }))}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>启用审计日志</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        记录所有重要操作的日志
            </div>
          </div>
                  </label>
        </div>
              </div>
            </div>
          )}

        {/* 操作按钮 */}
        <div style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
          display: 'flex',
          gap: '12px',
            justifyContent: 'flex-end'
        }}>
          <button
              onClick={handleResetConfig}
            disabled={loading}
            style={{
                padding: '12px 24px',
              border: '1px solid #ddd',
                borderRadius: '6px',
              background: 'white',
              color: '#666',
              cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = '#999';
                  e.currentTarget.style.color = '#333';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.color = '#666';
              }}
            >
              🔄 重置配置
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={loading}
            style={{
                padding: '12px 32px',
              border: 'none',
                borderRadius: '6px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
                fontWeight: '600',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              {loading ? '⏳ 保存中...' : '💾 保存全局配置'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectConfig;
