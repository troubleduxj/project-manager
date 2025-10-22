import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ExcelViewer = ({ fileUrl, title, onClose }) => {
  const [workbook, setWorkbook] = useState(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExcel();
  }, [fileUrl]);

  const loadExcel = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('文件加载失败');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });
      
      setWorkbook(wb);
    } catch (err) {
      console.error('加载 Excel 文件失败:', err);
      setError(err.message || 'Excel 文件加载失败');
    } finally {
      setLoading(false);
    }
  };

  const renderSheet = (sheetName) => {
    if (!workbook) return null;
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    if (jsonData.length === 0) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <p>该工作表没有数据</p>
        </div>
      );
    }
    
    return (
      <div style={{
        overflow: 'auto',
        padding: '20px',
        background: '#f8f9fa'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          fontSize: '13px'
        }}>
          <tbody>
            {jsonData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const CellTag = rowIndex === 0 ? 'th' : 'td';
                  return (
                    <CellTag
                      key={cellIndex}
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '10px 12px',
                        textAlign: 'left',
                        background: rowIndex === 0 ? '#f7fafc' : (rowIndex % 2 === 0 ? 'white' : '#fafbfc'),
                        fontWeight: rowIndex === 0 ? '600' : '400',
                        color: rowIndex === 0 ? '#2d3748' : '#4a5568',
                        whiteSpace: 'nowrap',
                        minWidth: '100px'
                      }}
                    >
                      {cell !== null && cell !== undefined ? String(cell) : ''}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>正在加载 Excel 文档...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📗</div>
        <h3 style={{ margin: '0 0 8px 0' }}>文档加载失败</h3>
        <p style={{ margin: 0, color: '#6c757d' }}>{error}</p>
        <button
          onClick={loadExcel}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          重试
        </button>
      </div>
    );
  }

  if (!workbook) return null;

  const sheetNames = workbook.SheetNames;

  return (
    <div className="excel-viewer" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white'
    }}>
      {/* 顶部工具栏 */}
      <div style={{
        background: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>📗</span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
            {title || 'Excel 文档'}
          </h3>
        </div>
        <div style={{ fontSize: '13px', color: '#6c757d' }}>
          共 {sheetNames.length} 个工作表
        </div>
      </div>

      {/* 工作表标签页 */}
      {sheetNames.length > 1 && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e9ecef',
          padding: '0 16px',
          display: 'flex',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {sheetNames.map((name, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeSheet === index ? '3px solid #10b981' : '3px solid transparent',
                background: activeSheet === index ? '#f0fdf4' : 'transparent',
                color: activeSheet === index ? '#10b981' : '#6c757d',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeSheet === index ? '600' : '400',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* 工作表内容 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: '#f8f9fa'
      }}>
        {renderSheet(sheetNames[activeSheet])}
      </div>

      {/* 底部状态栏 */}
      <div style={{
        background: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        padding: '8px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        <div>当前工作表: <strong style={{ color: '#2c3e50' }}>{sheetNames[activeSheet]}</strong></div>
        <div>
          {XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[activeSheet]], { header: 1 }).length} 行
        </div>
      </div>
    </div>
  );
};

export default ExcelViewer;

