import React from 'react';

const TaskManagement = ({ 
  selectedProject, 
  projectTasks, 
  selectedTask, 
  subTasks, 
  user, 
  showTaskForm, 
  showSubTaskForm,
  editingTask,
  showTaskEditForm,
  newTask,
  newSubTask,
  error,
  loading,
  setShowTaskForm,
  setShowSubTaskForm,
  setEditingTask,
  setShowTaskEditForm,
  setNewTask,
  setNewSubTask,
  handleTaskSelect,
  handleAddTask,
  handleUpdateTaskProgress,
  handleDeleteTask,
  handleEditTask,
  handleUpdateTask,
  handleAddSubTask,
  handleUpdateSubTask,
  handleDeleteSubTask,
  taskCommentCounts,
  selectedTaskForComments,
  taskComments,
  showCommentPanel,
  setShowCommentPanel,
  handleShowTaskComments,
  handleAddTaskComment
}) => {
  if (!selectedProject) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '20px',
        margin: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '24px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}>📊</div>
        <h2 style={{ 
          margin: '0 0 15px 0', 
          color: '#495057',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          请选择一个项目
        </h2>
        <p style={{ 
          margin: '0 0 30px 0', 
          fontSize: '16px',
          color: '#6c757d',
          fontWeight: '500'
        }}>
          选择项目后即可开始管理任务和查看进度
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* 项目概览 - 左右布局 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        marginBottom: '32px',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* 装饰性背景元素 */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%'
        }} />
        
        {/* 左侧：项目信息 */}
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          flex: 1
        }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '32px', 
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {selectedProject.name}
            <span style={{ fontSize: '48px' }}>📝</span>
          </h2>
          <p style={{ 
            margin: '0', 
            fontSize: '16px', 
            opacity: 0.95,
            fontWeight: '500'
          }}>
            {selectedProject.description || '管理项目任务，跟踪进度，分配工作'}
          </p>
        </div>
        
        {/* 右侧：统计信息 */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: '32px',
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {selectedProject.progress || 0}%
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>整体进度</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {projectTasks.filter(t => t.status === 'done').length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {projectTasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>进行中</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {projectTasks.filter(t => t.status === 'todo').length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>待开始</div>
          </div>
        </div>
      </div>

      {/* 两列布局：主任务列表 | 子任务列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        minHeight: '500px'
      }}>
        {/* 主任务列表 */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, color: '#495057', fontSize: '18px' }}>
              主任务列表 ({projectTasks.length})
            </h3>
            {user.role === 'admin' && (
              <button
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={() => setShowTaskForm(true)}
              >
                + 添加任务
              </button>
            )}
          </div>
          
          {projectTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6c757d',
              border: '2px dashed #e9ecef',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
              <p>暂无任务</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: selectedTask?.id === task.id 
                      ? '2px solid #667eea' 
                      : '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '18px',
                    background: selectedTask?.id === task.id 
                      ? 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)' 
                      : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedTask?.id === task.id 
                      ? '0 8px 25px rgba(102, 126, 234, 0.15)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transform: selectedTask?.id === task.id ? 'translateY(-2px)' : 'translateY(0)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleTaskSelect(task)}
                  onMouseEnter={(e) => {
                    if (selectedTask?.id !== task.id) {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTask?.id !== task.id) {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {/* 选中状态指示器 */}
                  {selectedTask?.id === task.id && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '0 2px 2px 0'
                    }} />
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '15px',
                        color: '#212529',
                        fontWeight: '600'
                      }}>
                        {task.task_name}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#6c757d',
                        lineHeight: '1.4'
                      }}>
                        {task.description || '暂无描述'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: 
                          task.status === 'done' ? '#28a745' :
                          task.status === 'in_progress' ? '#007bff' :
                          task.status === 'blocked' ? '#dc3545' : '#6c757d'
                      }}>
                        {task.status === 'done' ? '完成' :
                         task.status === 'in_progress' ? '进行' :
                         task.status === 'blocked' ? '受阻' : '待办'}
                      </span>
                      
                      {/* 评论图标和数量 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '12px',
                          color: '#6c757d',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowTaskComments(task);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                          e.currentTarget.style.color = '#495057';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.color = '#6c757d';
                        }}
                        title="查看评论"
                      >
                        <span>💬</span>
                        <span>{taskCommentCounts[task.id] || 0}</span>
                      </div>
                      
                      {user.role === 'admin' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#007bff',
                              cursor: 'pointer',
                              fontSize: '12px',
                              padding: '2px 4px',
                              borderRadius: '3px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTask(task);
                            }}
                            title="编辑任务"
                          >
                            ✏️
                          </button>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc3545',
                              cursor: 'pointer',
                              fontSize: '12px',
                              padding: '2px 4px',
                              borderRadius: '3px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            title="删除任务"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#495057' }}>
                        进度: {task.progress || 0}%
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        width: `${task.progress || 0}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* 日期信息 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#6c757d'
                  }}>
                    <span>开始: {task.start_date ? new Date(task.start_date).toLocaleDateString() : '未设置'}</span>
                    <span>截止: {task.due_date ? new Date(task.due_date).toLocaleDateString() : '未设置'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 子任务列表 */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '12px 16px',
            background: selectedTask 
              ? 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)' 
              : '#f8f9fa',
            borderRadius: '12px',
            border: selectedTask 
              ? '1px solid rgba(102, 126, 234, 0.2)' 
              : '1px solid #e9ecef',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 关联指示器 */}
            {selectedTask && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '0 2px 2px 0'
              }} />
            )}
            
            <h3 style={{ 
              margin: 0, 
              color: selectedTask ? '#667eea' : '#495057', 
              fontSize: '18px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {selectedTask && <span style={{ fontSize: '16px' }}>🔗</span>}
              {selectedTask ? `"${selectedTask.task_name}" 的子任务 (${subTasks.length})` : '子任务列表'}
            </h3>
            {user.role === 'admin' && selectedTask && (
              <button
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={() => setShowSubTaskForm(true)}
              >
                + 添加子任务
              </button>
            )}
          </div>

          {!selectedTask ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d',
              border: '2px dashed #e9ecef',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>👈</div>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>请选择一个主任务</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>
                点击左侧的主任务来查看和管理其子任务
              </p>
            </div>
          ) : subTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d',
              border: '2px dashed #e9ecef',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>暂无子任务</h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>
                {user.role === 'admin' ? '点击上方按钮添加子任务' : '管理员尚未添加子任务'}
              </p>
              {user.role === 'admin' && (
                <button
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onClick={() => setShowSubTaskForm(true)}
                >
                  添加第一个子任务
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subTasks.map((subTask) => (
                <div
                  key={subTask.id}
                  style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.08)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* 关联指示器 - 显示与主任务的关联 */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '0 2px 2px 0',
                    opacity: 0.7
                  }} />
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{ flex: 1, paddingRight: '12px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '15px',
                          color: '#212529',
                          fontWeight: '600'
                        }}>
                          {subTask.task_name}
                        </h4>
                        {/* 子任务标识 - 放在标题右侧 */}
                        <div style={{
                          padding: '2px 6px',
                          background: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          子任务
                        </div>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#6c757d',
                        lineHeight: '1.4'
                      }}>
                        {subTask.description || '暂无描述'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: 
                          subTask.status === 'done' ? '#28a745' :
                          subTask.status === 'in_progress' ? '#007bff' :
                          subTask.status === 'blocked' ? '#dc3545' : '#6c757d'
                      }}>
                        {subTask.status === 'done' ? '完成' :
                         subTask.status === 'in_progress' ? '进行' :
                         subTask.status === 'blocked' ? '受阻' : '待办'}
                      </span>
                      
                      {/* 子任务评论图标和数量 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: '#6c757d',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowTaskComments(subTask);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                          e.currentTarget.style.color = '#495057';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.color = '#6c757d';
                        }}
                        title="查看子任务评论"
                      >
                        <span>💬</span>
                        <span>{taskCommentCounts[subTask.id] || 0}</span>
                      </div>
                      
                      {user.role === 'admin' && (
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 4px',
                            borderRadius: '3px'
                          }}
                          onClick={() => handleDeleteSubTask(subTask.id)}
                          title="删除子任务"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#495057' }}>
                        进度: {subTask.progress || 0}%
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        width: `${subTask.progress || 0}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* 管理员操作 */}
                  {user.role === 'admin' && (
                    <div style={{
                      borderTop: '1px solid #f1f3f4',
                      paddingTop: '10px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center'
                    }}>
                      <select
                        value={subTask.status}
                        onChange={(e) => handleUpdateSubTask(subTask.id, subTask.progress, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}
                      >
                        <option value="todo">待办</option>
                        <option value="in_progress">进行</option>
                        <option value="done">完成</option>
                        <option value="blocked">受阻</option>
                      </select>
                      
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={subTask.progress || 0}
                        onChange={(e) => handleUpdateSubTask(subTask.id, parseInt(e.target.value), subTask.status)}
                        style={{ flex: 1, minWidth: '60px' }}
                      />
                      
                      <span style={{
                        fontSize: '11px',
                        color: '#495057',
                        minWidth: '35px'
                      }}>
                        {subTask.progress || 0}%
                      </span>
                    </div>
                  )}

                  {/* 日期信息 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#6c757d',
                    marginTop: '8px'
                  }}>
                    <span>开始: {subTask.start_date ? new Date(subTask.start_date).toLocaleDateString() : '未设置'}</span>
                    <span>截止: {subTask.due_date ? new Date(subTask.due_date).toLocaleDateString() : '未设置'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 添加任务表单 */}
      {showTaskForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#212529' }}>添加新任务</h3>
            
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #fcc',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAddTask}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  任务名称 *
                </label>
                <input
                  type="text"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="请输入任务名称"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  任务描述
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="请输入任务描述"
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    color: '#555',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    color: '#555',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    截止日期
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false);
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#6c757d',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? '添加中...' : '添加任务'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 添加子任务表单 */}
      {showSubTaskForm && selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#212529' }}>
              为 "{selectedTask.task_name}" 添加子任务
            </h3>
            
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #fcc',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAddSubTask}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  子任务名称 *
                </label>
                <input
                  type="text"
                  value={newSubTask.taskName}
                  onChange={(e) => setNewSubTask({...newSubTask, taskName: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="请输入子任务名称"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  子任务描述
                </label>
                <textarea
                  value={newSubTask.description}
                  onChange={(e) => setNewSubTask({...newSubTask, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="请输入子任务描述"
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    color: '#555',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={newSubTask.startDate}
                    onChange={(e) => setNewSubTask({...newSubTask, startDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    color: '#555',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    截止日期
                  </label>
                  <input
                    type="date"
                    value={newSubTask.dueDate}
                    onChange={(e) => setNewSubTask({...newSubTask, dueDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubTaskForm(false);
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#6c757d',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? '添加中...' : '添加子任务'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑任务表单 */}
      {showTaskEditForm && editingTask && (
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
            padding: '30px',
            borderRadius: '12px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ 
              margin: '0 0 25px 0', 
              color: '#495057',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              编辑任务
            </h3>

            <form onSubmit={handleUpdateTask}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  任务名称 *
                </label>
                <input
                  type="text"
                  value={editingTask.task_name}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, task_name: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  任务描述
                </label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    状态
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, status: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="todo">待办</option>
                    <option value="in_progress">进行中</option>
                    <option value="done">已完成</option>
                    <option value="blocked">受阻</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    进度 (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingTask.progress || 0}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={editingTask.start_date || ''}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, start_date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    截止日期
                  </label>
                  <input
                    type="date"
                    value={editingTask.due_date || ''}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, due_date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  background: '#f8d7da',
                  color: '#721c24',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskEditForm(false);
                    setEditingTask(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#6c757d',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? '更新中...' : '更新任务'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 评论面板 - 放在任务面板下方 */}
      {showCommentPanel && selectedTaskForComments && (
        <div 
          id="comment-panel"
          style={{
            marginTop: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            animation: 'slideInUp 0.3s ease-out'
          }}
        >
          {/* 评论面板头部 */}
          <div style={{
            padding: '20px 28px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 装饰性背景 */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                💬 {selectedTaskForComments.task_name}
              </h3>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '14px', 
                opacity: 0.9,
                fontWeight: '500'
              }}>
                共 {taskComments.length} 条评论 · 点击下方添加新评论
              </p>
            </div>
            
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1
              }}
              onClick={() => setShowCommentPanel(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>
          
          {/* 评论列表 */}
          <div style={{
            maxHeight: '400px',
            overflow: 'auto',
            padding: '24px 28px'
          }}>
            {taskComments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6c757d'
              }}>
                <div style={{ 
                  fontSize: '64px', 
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}>💭</div>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  还没有评论
                </h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  成为第一个评论这个任务的人吧！
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {taskComments.map((comment, index) => (
                  <div key={comment.id} style={{
                    padding: '20px',
                    background: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {/* 评论序号 */}
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      #{index + 1}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                      marginTop: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: comment.role === 'admin' 
                            ? 'linear-gradient(135deg, #dc3545, #c82333)' 
                            : 'linear-gradient(135deg, #28a745, #20c997)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {(comment.full_name || comment.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{
                            fontWeight: '700',
                            color: '#495057',
                            fontSize: '15px'
                          }}>
                            {comment.full_name || comment.username}
                          </span>
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: 'white',
                            backgroundColor: comment.role === 'admin' ? '#dc3545' : '#28a745'
                          }}>
                            {comment.role === 'admin' ? '管理员' : '用户'}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        fontWeight: '500'
                      }}>
                        {new Date(comment.created_at).toLocaleString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div style={{
                      color: '#212529',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      fontSize: '14px',
                      marginBottom: comment.mentioned_users && comment.mentioned_users.length > 0 ? '12px' : 0
                    }}>
                      {comment.content}
                    </div>
                    
                    {comment.mentioned_users && comment.mentioned_users.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#6c757d'
                      }}>
                        <span>👥 提及了:</span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {comment.mentioned_users.map((userId, idx) => (
                            <span key={idx} style={{
                              padding: '2px 6px',
                              background: '#e3f2fd',
                              color: '#1976d2',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              @用户{userId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 添加评论表单 */}
          <CommentForm
            onSubmit={handleAddTaskComment}
            placeholder={`为 "${selectedTaskForComments.task_name}" 添加评论...`}
          />
        </div>
      )}
    </div>
  );
};

// 评论表单组件
const CommentForm = ({ onSubmit, placeholder }) => {
  const [content, setContent] = React.useState('');
  const [mentionedUsers, setMentionedUsers] = React.useState([]);
  const [showUserList, setShowUserList] = React.useState(false);
  const [availableUsers, setAvailableUsers] = React.useState([]);
  const textareaRef = React.useRef(null);
  
  React.useEffect(() => {
    // 获取可@的用户列表
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7080/api/comments/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const users = await response.json();
          setAvailableUsers(users);
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
      }
    };
    
    fetchUsers();
    
    // 自动聚焦到文本框
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit(content, mentionedUsers);
    setContent('');
    setMentionedUsers([]);
    
    // 提交后重新聚焦
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };
  
  const handleMentionUser = (user) => {
    if (!mentionedUsers.find(u => u.id === user.id)) {
      setMentionedUsers(prev => [...prev, user]);
      setContent(prev => prev + `@${user.full_name || user.username} `);
    }
    setShowUserList(false);
    
    // 重新聚焦到文本框
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };
  
  return (
    <div style={{
      padding: '24px 28px',
      borderTop: '1px solid #e9ecef',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '16px',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              resize: 'vertical',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onKeyDown={(e) => {
              // Ctrl+Enter 快速提交
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowUserList(!showUserList)}
                style={{
                  padding: '8px 12px',
                  background: showUserList ? '#667eea' : '#e9ecef',
                  color: showUserList ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!showUserList) {
                    e.currentTarget.style.background = '#dee2e6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showUserList) {
                    e.currentTarget.style.background = '#e9ecef';
                  }
                }}
              >
                👥 @ 提及用户
              </button>
              
              {mentionedUsers.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {mentionedUsers.map(user => (
                    <span key={user.id} style={{
                      padding: '4px 8px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      @{user.full_name || user.username}
                      <button
                        type="button"
                        onClick={() => setMentionedUsers(prev => prev.filter(u => u.id !== user.id))}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '10px',
                          padding: '2px',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '12px',
                color: '#6c757d',
                fontWeight: '500'
              }}>
                Ctrl+Enter 快速发送
              </span>
              <button
                type="submit"
                disabled={!content.trim()}
                style={{
                  padding: '10px 20px',
                  background: content.trim() 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#e9ecef',
                  color: content.trim() ? 'white' : '#6c757d',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: content.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: content.trim() ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (content.trim()) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (content.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                💬 发送评论
              </button>
            </div>
          </div>
          
          {/* 用户列表下拉 */}
          {showUserList && (
            <div style={{
              position: 'fixed', // 改为fixed定位，避免被父容器遮挡
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              maxWidth: '90vw',
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
              zIndex: 9999, // 提高z-index确保在最顶层
              maxHeight: '60vh',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.3s ease-out'
            }}>
              {/* 弹窗头部 */}
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '16px 16px 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    选择要提及的用户
                  </h4>
                </div>
                <button
                  onClick={() => setShowUserList(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>
              </div>
              
              {/* 用户列表内容 */}
              <div style={{
                maxHeight: 'calc(60vh - 80px)',
                overflow: 'auto',
                padding: '8px 0'
              }}>
                {availableUsers.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#6c757d',
                    fontSize: '14px'
                  }}>
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>👤</div>
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      暂无可提及的用户
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      请联系管理员添加更多用户
                    </p>
                  </div>
                ) : (
                  availableUsers.map((user, index) => (
                    <div
                      key={user.id}
                      onClick={() => handleMentionUser(user)}
                      style={{
                        padding: '12px 20px',
                        cursor: 'pointer',
                        borderBottom: index < availableUsers.length - 1 ? '1px solid #f8f9fa' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {/* 用户头像 */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: user.role === 'admin' 
                          ? 'linear-gradient(135deg, #dc3545, #c82333)' 
                          : 'linear-gradient(135deg, #28a745, #20c997)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }}>
                        {(user.full_name || user.username).charAt(0).toUpperCase()}
                      </div>
                      
                      {/* 用户信息 */}
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '15px',
                          color: '#212529',
                          marginBottom: '2px'
                        }}>
                          {user.full_name || user.username}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6c757d',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            padding: '2px 8px',
                            background: user.role === 'admin' ? '#dc3545' : '#28a745',
                            color: 'white',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            {user.role === 'admin' ? '管理员' : '用户'}
                          </span>
                          <span>@{user.username}</span>
                        </div>
                      </div>
                      
                      {/* 选择指示器 */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid #e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}>
                        {mentionedUsers.find(u => u.id === user.id) && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)'
                          }} />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* 遮罩层 */}
          {showUserList && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9998,
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.2s ease-out'
              }}
              onClick={() => setShowUserList(false)}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskManagement;
