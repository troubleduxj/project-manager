import React from 'react';

// 表单字段组件
const FormField = ({ label, value, onChange, type = 'text', required, options, fullWidth, rows, min, max, isMobile }) => {
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

export default FormField;

