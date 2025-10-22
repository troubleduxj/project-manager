import React, { useState } from 'react';

const ProjectDocumentation = ({ selectedProject, user, isMobile }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', icon: '📝', title: '项目概述', color: '#667eea' },
    { id: 'structure', icon: '🏗️', title: '项目结构', color: '#28a745' },
    { id: 'workflow', icon: '🔄', title: '工作流程', color: '#f59e0b' },
    { id: 'guidelines', icon: '📋', title: '开发规范', color: '#ef4444' },
  ];

  const renderOverview = () => (
    <div>
      <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: isMobile ? '20px' : '28px', fontWeight: '700' }}>
        项目概述
      </h2>
      <div style={{
        background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
        borderRadius: isMobile ? '8px' : '12px',
        padding: isMobile ? '16px' : '24px',
        marginBottom: isMobile ? '16px' : '24px',
        border: '1px solid rgba(102, 126, 234, 0.15)'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057', fontSize: isMobile ? '16px' : '20px' }}>项目介绍</h3>
        <p style={{ color: '#6c757d', lineHeight: '1.8', fontSize: isMobile ? '14px' : '15px' }}>
          {selectedProject?.description || '暂无项目介绍'}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: isMobile ? '12px' : '20px', 
        marginBottom: isMobile ? '16px' : '24px' 
      }}>
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '8px' : '12px' }}>🎯</div>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: isMobile ? '16px' : '18px' }}>项目目标</h4>
          <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.6', fontSize: isMobile ? '13px' : '14px' }}>
            构建高效、易用的项目管理系统，提升团队协作效率
          </p>
        </div>
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '8px' : '12px' }}>⏰</div>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: isMobile ? '16px' : '18px' }}>项目周期</h4>
          <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.6', fontSize: isMobile ? '13px' : '14px' }}>
            {selectedProject?.start_date && selectedProject?.end_date 
              ? `${new Date(selectedProject.start_date).toLocaleDateString('zh-CN')} - ${new Date(selectedProject.end_date).toLocaleDateString('zh-CN')}`
              : '待定'
            }
          </p>
        </div>
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '8px' : '12px' }}>👥</div>
          <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: isMobile ? '16px' : '18px' }}>项目成员</h4>
          <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.6', fontSize: isMobile ? '13px' : '14px' }}>
            项目经理、开发人员、测试人员等
          </p>
        </div>
      </div>
    </div>
  );

  const renderStructure = () => (
    <div>
      <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: isMobile ? '20px' : '28px', fontWeight: '700' }}>
        项目结构
      </h2>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '8px' : '12px',
        padding: isMobile ? '16px' : '24px',
        border: '2px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057', fontSize: isMobile ? '16px' : '20px' }}>目录结构</h3>
        <pre style={{
          background: '#f8f9fa',
          padding: isMobile ? '12px' : '20px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: isMobile ? '11px' : '14px',
          lineHeight: '1.6',
          color: '#2c3e50'
        }}>
{`├── server/              # 后端服务
│   ├── routes/          # API 路由
│   ├── database/        # 数据库配置
│   └── migrations/      # 数据库迁移
├── src/                 # 前端源码
│   ├── components/      # React 组件
│   │   ├── Auth/        # 认证相关
│   │   └── ProjectManagement/  # 项目管理
│   ├── config/          # 配置文件
│   └── pages/           # 页面组件
├── static/              # 静态资源
│   ├── img/             # 图片资源
│   └── uploads/         # 上传文件
└── package.json         # 依赖配置`}
        </pre>
      </div>
    </div>
  );

  const renderWorkflow = () => (
    <div>
      <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: isMobile ? '20px' : '28px', fontWeight: '700' }}>
        工作流程
      </h2>
      <div style={{ display: 'grid', gap: isMobile ? '12px' : '20px' }}>
        {[
          { step: '1', title: '需求分析', desc: '收集和分析项目需求，明确项目目标和范围', icon: '📋', color: '#667eea' },
          { step: '2', title: '任务分配', desc: '将项目拆分为多个任务，分配给团队成员', icon: '👥', color: '#28a745' },
          { step: '3', title: '开发实施', desc: '按照分配的任务进行开发和实施', icon: '💻', color: '#f59e0b' },
          { step: '4', title: '测试验收', desc: '进行功能测试和质量验收', icon: '✅', color: '#10b981' },
          { step: '5', title: '部署上线', desc: '部署到生产环境并正式上线', icon: '🚀', color: '#6366f1' }
        ].map((item) => (
          <div
            key={item.step}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: isMobile ? '12px' : '20px',
              background: 'white',
              borderRadius: isMobile ? '8px' : '12px',
              padding: isMobile ? '16px' : '24px',
              border: '2px solid #e9ecef',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.boxShadow = `0 4px 16px ${item.color}30`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              borderRadius: isMobile ? '8px' : '12px',
              background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}30 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '20px' : '24px',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', marginBottom: '8px' }}>
                <div style={{
                  width: isMobile ? '28px' : '32px',
                  height: isMobile ? '28px' : '32px',
                  borderRadius: '50%',
                  background: item.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '700'
                }}>
                  {item.step}
                </div>
                <h4 style={{ margin: 0, color: '#2c3e50', fontSize: isMobile ? '16px' : '18px', fontWeight: '600' }}>
                  {item.title}
                </h4>
              </div>
              <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.6', fontSize: isMobile ? '13px' : '14px' }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGuidelines = () => (
    <div>
      <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: isMobile ? '20px' : '28px', fontWeight: '700' }}>
        开发规范
      </h2>
      <div style={{ display: 'grid', gap: isMobile ? '12px' : '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057', fontSize: isMobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💻</span> 代码规范
          </h3>
          <ul style={{ color: '#6c757d', lineHeight: isMobile ? '1.8' : '2', fontSize: isMobile ? '13px' : '15px', paddingLeft: isMobile ? '20px' : '40px' }}>
            <li>遵循 ESLint 代码规范</li>
            <li>使用有意义的变量和函数命名</li>
            <li>添加必要的注释说明</li>
            <li>保持代码简洁和可维护性</li>
          </ul>
        </div>

        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057', fontSize: isMobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔀</span> Git 规范
          </h3>
          <ul style={{ color: '#6c757d', lineHeight: isMobile ? '1.8' : '2', fontSize: isMobile ? '13px' : '15px', paddingLeft: isMobile ? '20px' : '40px' }}>
            <li>提交信息格式：<code style={{ background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', fontSize: isMobile ? '11px' : '13px' }}>type: description</code></li>
            <li>类型：feat (功能), fix (修复), docs (文档), style (格式), refactor (重构)</li>
            <li>每次提交只包含一个功能或修复</li>
            <li>提交前进行代码审查</li>
          </ul>
        </div>

        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057', fontSize: isMobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧪</span> 测试规范
          </h3>
          <ul style={{ color: '#6c757d', lineHeight: isMobile ? '1.8' : '2', fontSize: isMobile ? '13px' : '15px', paddingLeft: isMobile ? '20px' : '40px' }}>
            <li>编写单元测试覆盖核心功能</li>
            <li>进行集成测试确保模块协作</li>
            <li>测试覆盖率不低于 70%</li>
            <li>上线前进行完整的回归测试</li>
          </ul>
        </div>

        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '16px' : '24px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057', fontSize: isMobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📚</span> 文档规范
          </h3>
          <ul style={{ color: '#6c757d', lineHeight: isMobile ? '1.8' : '2', fontSize: isMobile ? '13px' : '15px', paddingLeft: isMobile ? '20px' : '40px' }}>
            <li>更新 API 文档说明</li>
            <li>编写使用说明和示例</li>
            <li>记录重要决策和变更</li>
            <li>保持文档与代码同步</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? '12px 0' : '20px 0' }}>
      {/* 页面标题 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        marginBottom: isMobile ? '16px' : '32px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '22px' : '32px', fontWeight: '700' }}>
          📚 项目文档
        </h1>
        <p style={{ margin: 0, fontSize: isMobile ? '14px' : '16px', opacity: 0.9 }}>
          {selectedProject?.name} - 项目文档和开发规范
        </p>
      </div>

      {isMobile ? (
        /* 移动端布局 */
        <div>
          {/* 顶部选项卡 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    background: activeSection === section.id 
                      ? `linear-gradient(135deg, ${section.color}15 0%, ${section.color}30 100%)` 
                      : '#f8f9fa',
                    color: activeSection === section.id ? section.color : '#6c757d',
                    border: activeSection === section.id ? `2px solid ${section.color}` : '2px solid transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeSection === section.id ? '600' : '500',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef'
          }}>
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'structure' && renderStructure()}
            {activeSection === 'workflow' && renderWorkflow()}
            {activeSection === 'guidelines' && renderGuidelines()}
          </div>
        </div>
      ) : (
        /* PC端布局 */
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
          {/* 左侧导航 */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50', fontSize: '18px', fontWeight: '600' }}>
              文档目录
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: activeSection === section.id 
                      ? `linear-gradient(135deg, ${section.color}15 0%, ${section.color}30 100%)` 
                      : 'transparent',
                    color: activeSection === section.id ? section.color : '#6c757d',
                    border: activeSection === section.id ? `2px solid ${section.color}` : '2px solid transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: activeSection === section.id ? '600' : '500',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
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
                  <span style={{ fontSize: '20px' }}>{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 右侧内容 */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            minHeight: '600px'
          }}>
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'structure' && renderStructure()}
            {activeSection === 'workflow' && renderWorkflow()}
            {activeSection === 'guidelines' && renderGuidelines()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDocumentation;

