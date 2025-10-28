const database = require('../database/db');

async function createTestMessages() {
  console.log('🔄 开始创建测试消息...\n');

  try {
    // 连接数据库
    await database.connect();

    // 获取所有用户
    const users = await database.all('SELECT id, username, full_name FROM users');
    
    if (users.length < 2) {
      console.log('❌ 至少需要2个用户才能创建测试消息');
      return;
    }

    console.log(`✅ 找到 ${users.length} 个用户:\n`);
    users.forEach(u => console.log(`   - ID ${u.id}: ${u.username} (${u.full_name || '未设置姓名'})`));
    console.log('');

    // 为每个用户创建一些测试消息
    const messageTypes = ['system', 'project', 'task', 'document', 'comment', 'text'];
    const messageTitles = {
      'system': ['系统维护通知', '系统更新公告', '安全提醒'],
      'project': ['项目启动通知', '项目进度更新', '项目结项提醒'],
      'task': ['任务分配通知', '任务即将到期', '任务完成提醒'],
      'document': ['文档上传通知', '文档审核完成', '文档版本更新'],
      'comment': ['收到新评论', '@提及您', '评论回复'],
      'text': ['工作提醒', '会议通知', '重要消息']
    };

    const messageContents = {
      'system': [
        '系统将于今晚22:00-23:00进行例行维护,请提前保存工作。',
        '系统已更新至v2.0版本,新增了消息通知功能。',
        '检测到异常登录尝试,请注意账户安全。'
      ],
      'project': [
        '您的项目"示例项目"已成功创建,请尽快完善项目信息。',
        '项目进度已更新至35%,请查看最新状态。',
        '项目即将到达截止日期,请加快进度。'
      ],
      'task': [
        '您有新的任务"完成需求文档",请及时处理。',
        '任务"数据库设计"将在3天后到期,请注意。',
        '恭喜!任务"功能测试"已完成。'
      ],
      'document': [
        '用户上传了新文档"项目需求.docx",请查看。',
        '您提交的文档已通过审核。',
        '文档"系统设计"已更新到v2.0版本。'
      ],
      'comment': [
        '用户在您的任务下添加了新评论。',
        '张三 在讨论中@了您,请查看。',
        '您的评论收到了新的回复。'
      ],
      'text': [
        '请记得今天15:00参加项目评审会议。',
        '本周工作周报请于周五17:00前提交。',
        '请关注明天的全员大会通知。'
      ]
    };

    let successCount = 0;
    let failCount = 0;

    for (const receiver of users) {
      // 为每个用户创建5条消息
      for (let i = 0; i < 5; i++) {
        const sender = users.find(u => u.id !== receiver.id) || users[0];
        const typeIndex = i % messageTypes.length;
        const type = messageTypes[typeIndex];
        const titles = messageTitles[type];
        const contents = messageContents[type];
        
        const title = titles[i % titles.length];
        const message = contents[i % contents.length];

        try {
          // 随机决定是否已读(30%概率已读)
          const isRead = Math.random() < 0.3 ? 1 : 0;

          await database.run(`
            INSERT INTO messages (
              sender_id, receiver_id, title, message, message_type, 
              is_read, project_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            sender.id,
            receiver.id,
            title,
            message,
            type,
            isRead,
            null  // 暂时不关联项目
          ]);

          successCount++;
        } catch (error) {
          console.error(`❌ 为用户 ${receiver.username} 创建消息失败:`, error.message);
          failCount++;
        }
      }
    }

    console.log('\n📊 测试消息创建完成:');
    console.log(`   ✅ 成功创建: ${successCount} 条消息`);
    console.log(`   ❌ 失败: ${failCount} 条消息`);
    console.log('\n✨ 您现在可以登录系统查看消息通知功能了!\n');

  } catch (error) {
    console.error('❌ 创建测试消息时出错:', error);
  } finally {
    database.close();
  }
}

createTestMessages();

