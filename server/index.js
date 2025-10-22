const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// 初始化数据库连接
const database = require('./database/db');

// 导入路由
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const documentRoutes = require('./routes/documents');
const messageRoutes = require('./routes/messages');
const settingsRoutes = require('./routes/settings');
const commentsRoutes = require('./routes/comments');
const emailRoutes = require('./routes/email');
const foldersRoutes = require('./routes/folders');
const statsRoutes = require('./routes/stats');
const systemRoutes = require('./routes/system');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:7076", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 7080;

console.log('🔧 使用自定义 CORS 配置');

// 移除默认的 cors 中间件，使用手动配置
// 手动 CORS 中间件 - 确保所有响应都有 CORS 头部
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:7076', 'http://localhost:3000'];
  
  console.log('CORS middleware - Method:', req.method, 'Origin:', origin, 'URL:', req.url);
  
  // 总是设置 CORS 头部
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ Setting Access-Control-Allow-Origin to:', origin);
  } else if (origin) {
    // 如果有 origin 但不在允许列表中，仍然设置一个（用于调试）
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('⚠️ Origin not in allowed list but setting anyway:', origin);
  } else {
    // 没有 origin 的请求（比如同源请求）
    console.log('ℹ️ No origin header present');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false'); // 改为 false 因为我们移除了 credentials
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS request');
    res.status(200).end();
    return;
  }
  
  next();
});

// 增加body大小限制以支持base64头像上传
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/system', systemRoutes);

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 加入项目房间
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`用户 ${socket.id} 加入项目 ${projectId}`);
  });

  // 发送消息
  socket.on('send-message', (data) => {
    const { projectId, message, sender } = data;
    // 广播消息到项目房间
    io.to(`project-${projectId}`).emit('new-message', {
      id: Date.now(),
      message,
      sender,
      timestamp: new Date().toISOString(),
      projectId
    });
  });

  // 项目进度更新
  socket.on('progress-update', (data) => {
    const { projectId, progress } = data;
    io.to(`project-${projectId}`).emit('progress-updated', progress);
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
async function startServer() {
  try {
    // 连接数据库
    await database.connect();
    console.log('✅ 数据库连接成功');
    
    // 启动服务器
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📊 API 地址: http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.IO 已启用`);
      console.log(`💻 前端地址: http://localhost:7076/project-management`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app, io };
