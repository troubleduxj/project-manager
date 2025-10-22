import React from 'react';

// 项目选择器组件
const ProjectSelector = ({ projects, selectedProjectFilter, onChange }) => {
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
        value={selectedProjectFilter || ''}
        onChange={(e) => onChange(e.target.value)}
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

export default ProjectSelector;

