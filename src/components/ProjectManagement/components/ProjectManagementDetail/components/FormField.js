import React, { memo } from 'react';

// 表单字段组件 - 使用 memo 优化，防止不必要的重新渲染导致失焦
const FormField = memo(({ label, value, onChange, type = 'text', required, options, fullWidth, rows, min, max, placeholder }) => {
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
          placeholder={placeholder}
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
          {options?.map((opt, index) => {
            // 支持两种格式: 字符串或对象 {value, label}
            if (typeof opt === 'string') {
              return <option key={opt} value={opt}>{opt}</option>;
            } else {
              return <option key={opt.value || index} value={opt.value}>{opt.label}</option>;
            }
          })}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        />
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;

