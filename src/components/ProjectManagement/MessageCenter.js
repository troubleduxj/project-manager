import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { API_ENDPOINTS } from '../../config/api';
import styles from './ProjectManagement.module.css';

const MessageCenter = ({ project, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [project.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const newSocket = io(API_ENDPOINTS.SOCKET_URL);
    
    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('join-project', project.id);
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.PROJECT_MESSAGES(project.id));
      setMessages(response.data);
    } catch (error) {
      setError('获取消息列表失败');
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // 通过Socket发送消息
      if (socket) {
        socket.emit('send-message', {
          projectId: project.id,
          message: messageText,
          sender: user.full_name || user.username
        });
      }

      // 同时通过API发送消息（作为备份）
      await axios.post(API_ENDPOINTS.SEND_MESSAGE(project.id), {
        message: messageText
      });

    } catch (error) {
      setError('发送消息失败');
      console.error('发送消息失败:', error);
      // 如果发送失败，恢复消息内容
      setNewMessage(messageText);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const isOwnMessage = (message) => {
    return message.sender_id === user.id;
  };

  const getRoleText = (role) => {
    const roleMap = {
      'admin': '管理员',
      'client': '客户',
      'manager': '项目经理'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      'admin': '#dc3545',
      'client': '#007bff',
      'manager': '#28a745'
    };
    return colorMap[role] || '#6c757d';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>加载消息...</p>
      </div>
    );
  }

  return (
    <div className={styles.messageCenter}>
      <div className={styles.messageHeader}>
        <h3>项目沟通</h3>
        <div className={styles.projectInfo}>
          <span>项目: {project.name}</span>
          <span className={styles.onlineStatus}>
            {socket?.connected ? '🟢 在线' : '🔴 离线'}
          </span>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* 消息列表 */}
      <div 
        className={styles.messagesContainer}
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className={styles.emptyMessages}>
            <div className={styles.emptyIcon}>💬</div>
            <h4>暂无消息</h4>
            <p>开始与项目团队沟通吧！</p>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.map((message, index) => {
              const isOwn = isOwnMessage(message);
              const showAvatar = index === 0 || 
                messages[index - 1].sender_id !== message.sender_id;

              return (
                <div 
                  key={message.id || index}
                  className={`${styles.messageItem} ${isOwn ? styles.ownMessage : styles.otherMessage}`}
                >
                  {!isOwn && showAvatar && (
                    <div className={styles.messageAvatar}>
                      <div className={styles.avatarCircle}>
                        {(message.sender_name || 'U').charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.messageContent}>
                    {!isOwn && showAvatar && (
                      <div className={styles.messageSender}>
                        <span className={styles.senderName}>
                          {message.sender_name}
                        </span>
                        <span 
                          className={styles.senderRole}
                          style={{ color: getRoleColor(message.sender_role) }}
                        >
                          {getRoleText(message.sender_role)}
                        </span>
                      </div>
                    )}
                    
                    <div className={styles.messageBubble}>
                      <p className={styles.messageText}>{message.message}</p>
                      <span className={styles.messageTime}>
                        {formatTime(message.created_at || message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 消息输入框 */}
      <div className={styles.messageInput}>
        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <div className={styles.inputContainer}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="输入消息..."
              className={styles.messageTextarea}
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button 
              type="submit" 
              className={styles.sendButton}
              disabled={!newMessage.trim()}
            >
              发送
            </button>
          </div>
          <div className={styles.inputHint}>
            <small>按 Enter 发送，Shift + Enter 换行</small>
          </div>
        </form>
      </div>

      {/* 参与者信息 */}
      <div className={styles.participantsInfo}>
        <h4>项目参与者</h4>
        <div className={styles.participantsList}>
          <div className={styles.participant}>
            <span className={styles.participantName}>
              {project.client_name}
            </span>
            <span className={styles.participantRole} style={{ color: getRoleColor('client') }}>
              客户
            </span>
          </div>
          <div className={styles.participant}>
            <span className={styles.participantName}>
              {project.manager_name}
            </span>
            <span className={styles.participantRole} style={{ color: getRoleColor('admin') }}>
              项目经理
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
