import React, { useState, useEffect } from 'react';

const EmailTemplatesConfig = ({ systemSettings, user }) => {
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: '项目周报',
      type: 'weekly_report',
      subject: '📊 {项目名称} - 第{周数}周项目周报',
      description: '用于发送项目进度周报',
      enabled: true,
      schedule: '每周五 18:00',
      lastSent: '2024-10-11 18:00:00'
    },
    {
      id: 2,
      name: '任务更新通知',
      type: 'notification',
      subject: '📋 任务更新通知 - {任务名称}',
      description: '任务状态变更时发送通知',
      enabled: true,
      schedule: '实时发送',
      lastSent: '2024-10-15 14:30:00'
    },
    {
      id: 3,
      name: '里程碑达成',
      type: 'milestone',
      subject: '🎯 项目里程碑达成 - {里程碑名称}',
      description: '项目重要里程碑达成时发送',
      enabled: false,
      schedule: '事件触发',
      lastSent: '-'
    },
    {
      id: 4,
      name: '任务截止提醒',
      type: 'reminder',
      subject: '⏰ 任务截止日期提醒 - {任务名称}',
      description: '任务即将到期时发送提醒',
      enabled: true,
      schedule: '截止前24小时',
      lastSent: '2024-10-14 09:00:00'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // 处理模板预览
  const handlePreviewTemplate = (template) => {
    // 如果点击的是同一个模板，则关闭预览
    if (previewTemplate && previewTemplate.id === template.id) {
      setPreviewTemplate(null);
    } else {
      setPreviewTemplate(template);
      // 关闭编辑模式
      setSelectedTemplate(null);
    }
  };

  // 处理模板编辑
  const handleEditTemplate = (template) => {
    // 如果点击的是同一个模板，则关闭编辑
    if (selectedTemplate && selectedTemplate.id === template.id) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(template);
      // 关闭预览模式
      setPreviewTemplate(null);
    }
  };

  // 处理模板启用/禁用
  const handleToggleTemplate = (templateId) => {
    setEmailTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, enabled: !template.enabled }
        : template
    ));
  };

  // 处理测试邮件发送
  const handleSendTestEmail = async (template) => {
    try {
      const response = await fetch('http://localhost:7080/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          smtp_host: 'smtp.exmail.qq.com',
          smtp_port: '465',
          smtp_user: 'xj.du@hanatech.com.cn',
          smtp_pass: 'Dxj19831010',
          from_name: '杜晓军',
          from_email: 'xj.du@hanatech.com.cn',
          test_email: 'duxiaojun1983@163.com',
          enable_tls: 'false',
          enable_ssl: 'true',
          template_html: renderTemplatePreview(template, true),
          template_name: template.name,
          template_type: template.type,
          subject: template.subject.replace('{项目名称}', '企业网站重构').replace('{周数}', '42').replace('{任务名称}', '示例任务').replace('{里程碑名称}', '第一阶段完成')
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`测试邮件发送成功！\n邮件ID: ${result.messageId}\n收件人: ${result.to}`);
      } else {
        alert(`测试邮件发送失败: ${result.error}`);
      }
    } catch (error) {
      console.error('发送测试邮件失败:', error);
      alert('发送测试邮件失败，请检查网络连接');
    }
  };

  // 渲染模板预览
  const renderTemplatePreview = (template, isForEmail = false) => {
    if (!template) return null;

    const currentDate = new Date().toLocaleDateString('zh-CN');
    const systemName = systemSettings?.site_name || '项目管理系统';

    switch (template.type) {
      case 'weekly_report':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '8px',
            border: isForEmail ? 'none' : '2px solid #e3f2fd',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              borderBottom: '2px solid #2196f3',
              paddingBottom: '16px'
            }}>
              <h2 style={{ 
                margin: '0 0 8px 0', 
                color: '#1976d2',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                📊 项目周报
              </h2>
              <div style={{ 
                color: '#666',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                {systemName} | 第42周 | {currentDate}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                color: '#1976d2', 
                margin: '0 0 12px 0',
                fontSize: '18px',
                borderLeft: '4px solid #2196f3',
                paddingLeft: '12px'
              }}>
                📈 项目概况
              </h3>
              <div style={{ 
                background: '#e3f2fd', 
                padding: '16px', 
                borderRadius: '6px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <strong>项目名称：</strong>企业网站重构<br/>
                  <strong>项目经理：</strong>张三<br/>
                  <strong>报告周期：</strong>2024.10.14 - 2024.10.20
                </div>
                <div>
                  <strong>整体进度：</strong><span style={{color: '#4caf50', fontWeight: 'bold'}}>75%</span><br/>
                  <strong>项目状态：</strong><span style={{color: '#ff9800', fontWeight: 'bold'}}>进行中</span><br/>
                  <strong>风险等级：</strong><span style={{color: '#4caf50', fontWeight: 'bold'}}>低</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                color: '#1976d2', 
                margin: '0 0 12px 0',
                fontSize: '18px',
                borderLeft: '4px solid #4caf50',
                paddingLeft: '12px'
              }}>
                ✅ 本周完成
              </h3>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>前端开发：</strong>完成用户登录模块开发和测试
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>后端开发：</strong>完成用户认证API接口开发
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>数据库设计：</strong>完成用户表结构设计和优化
                </li>
              </ul>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #e0e0e0',
              color: '#666',
              fontSize: '12px'
            }}>
              此报告由 {systemName} 自动生成 | 生成时间：{new Date().toLocaleString('zh-CN')}
            </div>
          </div>
        );

      case 'notification':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '8px',
            border: isForEmail ? 'none' : '2px solid #fff3cd',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              borderBottom: '2px solid #ffc107',
              paddingBottom: '16px'
            }}>
              <h2 style={{ 
                margin: '0 0 8px 0', 
                color: '#856404',
                fontSize: '22px',
                fontWeight: 'bold'
              }}>
                📋 任务更新通知
              </h2>
              <div style={{ 
                color: '#666',
                fontSize: '14px'
              }}>
                来自 {systemName} | {currentDate}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: '#fff3cd', 
                padding: '16px', 
                borderRadius: '6px',
                border: '1px solid #ffeaa7'
              }}>
                <p><strong>任务名称：</strong>用户界面优化</p>
                <p><strong>状态变更：</strong>进行中 → 已完成</p>
                <p><strong>负责人：</strong>李四</p>
                <p><strong>完成时间：</strong>{new Date().toLocaleString('zh-CN')}</p>
                <p><strong>备注：</strong>已完成所有UI优化工作，通过测试验收。</p>
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              color: '#666',
              fontSize: '12px'
            }}>
              此通知由 {systemName} 自动发送，请勿回复此邮件。
            </div>
          </div>
        );

      case 'milestone':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '8px',
            border: isForEmail ? 'none' : '2px solid #d1ecf1',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              borderBottom: '2px solid #17a2b8',
              paddingBottom: '16px'
            }}>
              <h2 style={{ 
                margin: '0 0 8px 0', 
                color: '#0c5460',
                fontSize: '22px',
                fontWeight: 'bold'
              }}>
                🎯 项目里程碑达成
              </h2>
              <div style={{ 
                color: '#666',
                fontSize: '14px'
              }}>
                来自 {systemName} | {currentDate}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: '#d1ecf1', 
                padding: '16px', 
                borderRadius: '6px',
                border: '1px solid #bee5eb'
              }}>
                <p><strong>🎉 恭喜！项目重要里程碑已达成</strong></p>
                <p><strong>里程碑名称：</strong>第一阶段开发完成</p>
                <p><strong>达成时间：</strong>{new Date().toLocaleString('zh-CN')}</p>
                <p><strong>完成度：</strong>100%</p>
                <p><strong>主要成果：</strong></p>
                <ul>
                  <li>用户管理模块开发完成</li>
                  <li>项目管理核心功能实现</li>
                  <li>系统测试通过</li>
                </ul>
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              color: '#666',
              fontSize: '12px'
            }}>
              此通知由 {systemName} 自动发送 | 继续加油！
            </div>
          </div>
        );

      case 'reminder':
        return (
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '8px',
            border: isForEmail ? 'none' : '2px solid #f8d7da',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              borderBottom: '2px solid #dc3545',
              paddingBottom: '16px'
            }}>
              <h2 style={{ 
                margin: '0 0 8px 0', 
                color: '#721c24',
                fontSize: '22px',
                fontWeight: 'bold'
              }}>
                ⏰ 任务截止日期提醒
              </h2>
              <div style={{ 
                color: '#666',
                fontSize: '14px'
              }}>
                来自 {systemName} | {currentDate}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: '#f8d7da', 
                padding: '16px', 
                borderRadius: '6px',
                border: '1px solid #f5c6cb'
              }}>
                <p><strong>⚠️ 重要提醒：任务即将到期</strong></p>
                <p><strong>任务名称：</strong>系统部署准备</p>
                <p><strong>负责人：</strong>王五</p>
                <p><strong>截止时间：</strong>2024年10月18日 18:00</p>
                <p><strong>剩余时间：</strong><span style={{color: '#dc3545', fontWeight: 'bold'}}>2天</span></p>
                <p><strong>当前状态：</strong>进行中 (70%)</p>
                <p><strong>提醒：</strong>请及时完成任务，如有困难请联系项目经理。</p>
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              color: '#666',
              fontSize: '12px'
            }}>
              此提醒由 {systemName} 自动发送，请及时处理相关任务。
            </div>
          </div>
        );

      default:
        return (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6c757d'
          }}>
            <p>暂无预览内容</p>
          </div>
        );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#1a73e8', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📧 邮件模板配置
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          管理系统邮件模板，包括周报、通知、提醒等各类邮件模板
        </p>
      </div>

      {/* 模板列表 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
        }}>
          {emailTemplates.map(template => (
            <div key={template.id}>
              {/* 模板卡片 */}
              <div style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '24px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: previewTemplate && previewTemplate.id === template.id ? '0' : '16px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#1a202c',
                      fontSize: '18px',
                      fontWeight: '700',
                      letterSpacing: '-0.025em'
                    }}>
                      {template.name}
                    </h4>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: template.enabled 
                        ? 'linear-gradient(135deg, #10b981, #059669)' 
                        : 'linear-gradient(135deg, #6b7280, #4b5563)',
                      color: 'white',
                      boxShadow: template.enabled 
                        ? '0 2px 4px rgba(16, 185, 129, 0.3)' 
                        : '0 2px 4px rgba(107, 114, 128, 0.3)'
                    }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: 'white',
                        display: 'inline-block'
                      }}></span>
                      {template.enabled ? '已启用' : '已禁用'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handlePreviewTemplate(template)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        background: previewTemplate && previewTemplate.id === template.id 
                          ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                          : 'linear-gradient(135deg, #e0f2fe, #b3e5fc)',
                        color: previewTemplate && previewTemplate.id === template.id ? 'white' : '#1976d2',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: previewTemplate && previewTemplate.id === template.id 
                          ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
                          : '0 2px 4px rgba(25, 118, 210, 0.2)'
                      }}
                    >
                      {previewTemplate && previewTemplate.id === template.id ? '收起预览' : '👁️ 预览'}
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        background: selectedTemplate && selectedTemplate.id === template.id 
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                          : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        color: selectedTemplate && selectedTemplate.id === template.id ? 'white' : '#f59e0b',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedTemplate && selectedTemplate.id === template.id 
                          ? '0 4px 12px rgba(245, 158, 11, 0.4)' 
                          : '0 2px 4px rgba(245, 158, 11, 0.2)'
                      }}
                    >
                      {selectedTemplate && selectedTemplate.id === template.id ? '收起编辑' : '✏️ 编辑'}
                    </button>
                    <button
                      onClick={() => handleToggleTemplate(template.id)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        background: template.enabled 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                          : 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: template.enabled 
                          ? '0 4px 12px rgba(239, 68, 68, 0.4)' 
                          : '0 4px 12px rgba(34, 197, 94, 0.4)'
                      }}
                    >
                      {template.enabled ? '🚫 禁用' : '✅ 启用'}
                    </button>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    color: '#666', 
                    fontSize: '13px' 
                  }}>
                    {template.description}
                  </p>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    color: '#333', 
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    <strong>主题：</strong>{template.subject}
                  </p>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    color: '#666', 
                    fontSize: '12px' 
                  }}>
                    <strong>发送规则：</strong>{template.schedule}
                  </p>
                  <p style={{ 
                    margin: '0', 
                    color: '#666', 
                    fontSize: '12px' 
                  }}>
                    <strong>最后发送：</strong>{template.lastSent}
                  </p>
                </div>
              </div>

              {/* 预览区域 */}
              {previewTemplate && previewTemplate.id === template.id && (
                <div style={{
                  border: '1px solid #e3f2fd',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  background: '#f8f9fa',
                  padding: '20px',
                  marginBottom: '16px',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      color: '#1976d2',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      📧 模板预览：{template.name}
                    </h4>
                    <button
                      onClick={() => handleSendTestEmail(template)}
                      style={{
                        padding: '8px 16px',
                        background: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      📧 发送测试邮件
                    </button>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '16px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {renderTemplatePreview(template)}
                  </div>
                </div>
              )}

              {/* 编辑区域 */}
              {selectedTemplate && selectedTemplate.id === template.id && (
                <div style={{
                  border: '1px solid #fff3cd',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  background: '#fffbf0',
                  padding: '20px',
                  marginBottom: '16px',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      color: '#ff9800',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      ✏️ 编辑模板：{template.name}
                    </h4>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '20px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          模板名称
                        </label>
                        <input
                          type="text"
                          defaultValue={template.name}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          模板类型
                        </label>
                        <select
                          defaultValue={template.type}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="weekly_report">项目周报</option>
                          <option value="notification">任务通知</option>
                          <option value="milestone">里程碑</option>
                          <option value="reminder">截止提醒</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          邮件主题
                        </label>
                        <input
                          type="text"
                          defaultValue={template.subject}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          模板描述
                        </label>
                        <textarea
                          defaultValue={template.description}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px', 
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          发送规则
                        </label>
                        <input
                          type="text"
                          defaultValue={template.schedule}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          <input
                            type="checkbox"
                            defaultChecked={template.enabled}
                            style={{ margin: 0 }}
                          />
                          启用此模板
                        </label>
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e0e0e0',
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          background: 'white',
                          color: '#666',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          // TODO: 实现保存逻辑
                          setSelectedTemplate(null);
                          alert('模板保存成功！');
                        }}
                        style={{
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '4px',
                          background: '#ff9800',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        保存模板
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* 旧的模板编辑器已移除 */}
      {false && selectedTemplate && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                ✏️ 编辑模板：{selectedTemplate.name}
              </h3>
              <button
                onClick={() => setShowTemplateEditor(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  模板名称
                </label>
                <input
                  type="text"
                  defaultValue={selectedTemplate.name}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  模板类型
                </label>
                <select
                  defaultValue={selectedTemplate.type}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="weekly_report">项目周报</option>
                  <option value="notification">任务通知</option>
                  <option value="milestone">里程碑</option>
                  <option value="reminder">截止提醒</option>
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  邮件主题
                </label>
                <input
                  type="text"
                  defaultValue={selectedTemplate.subject}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  模板描述
                </label>
                <textarea
                  defaultValue={selectedTemplate.description}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  发送规则
                </label>
                <input
                  type="text"
                  defaultValue={selectedTemplate.schedule}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  <input
                    type="checkbox"
                    defaultChecked={selectedTemplate.enabled}
                    style={{ margin: 0 }}
                  />
                  启用此模板
                </label>
              </div>
            </div>
            
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowTemplateEditor(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  // TODO: 实现保存逻辑
                  setShowTemplateEditor(false);
                  alert('模板保存成功！');
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#1976d2',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                保存模板
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesConfig;
