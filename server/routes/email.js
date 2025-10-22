const express = require('express');
const nodemailer = require('nodemailer');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 测试邮件发送
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    
    // 只有管理员可以测试邮件
    if (role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以测试邮件配置' });
    }

    const {
      smtp_host,
      smtp_port,
      smtp_user,
      smtp_pass,
      from_name,
      from_email,
      test_email,
      enable_tls,
      enable_ssl,
      template_html,
      template_name,
      template_type,
      subject
    } = req.body;

    // 验证必填字段
    if (!smtp_host || !smtp_port || !smtp_user || !smtp_pass || !from_email || !test_email) {
      return res.status(400).json({ error: '请填写完整的邮件配置信息' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email) || !emailRegex.test(test_email)) {
      return res.status(400).json({ error: '请输入有效的邮箱地址' });
    }

    // 创建邮件传输器
    const transportConfig = {
      host: smtp_host,
      port: parseInt(smtp_port),
      secure: enable_ssl === 'true', // true for 465, false for other ports
      auth: {
        user: smtp_user,
        pass: smtp_pass,
      },
      tls: {
        // 如果启用TLS但不是SSL，则不拒绝未授权的证书
        rejectUnauthorized: enable_ssl === 'true'
      }
    };

    // 腾讯企业邮箱特殊配置
    if (smtp_host === 'smtp.exmail.qq.com') {
      if (parseInt(smtp_port) === 587) {
        // 587端口使用STARTTLS
        transportConfig.secure = false;
        transportConfig.requireTLS = true;
        transportConfig.tls = {
          rejectUnauthorized: false,
          minVersion: 'TLSv1',
          maxVersion: 'TLSv1.3'
        };
      } else if (parseInt(smtp_port) === 465) {
        // 465端口使用SSL
        transportConfig.secure = true;
        transportConfig.tls = {
          rejectUnauthorized: false
        };
      }
    }

    console.log('邮件传输器配置:', {
      host: transportConfig.host,
      port: transportConfig.port,
      secure: transportConfig.secure,
      requireTLS: transportConfig.requireTLS
    });

    const transporter = nodemailer.createTransport(transportConfig);

    // 验证SMTP连接
    try {
      console.log('开始验证SMTP连接...');
      await transporter.verify();
      console.log('SMTP连接验证成功');
    } catch (error) {
      console.error('SMTP连接验证失败:', error);
      return res.status(400).json({ 
        error: 'SMTP服务器连接失败，请检查配置信息',
        details: error.message,
        config: {
          host: smtp_host,
          port: smtp_port,
          secure: enable_ssl === 'true',
          tls: enable_tls === 'true'
        }
      });
    }

    // 邮件内容
    let emailSubject, emailHtml;
    
    if (template_html && template_name) {
      // 如果提供了模板内容，使用模板
      emailSubject = subject || `${template_name} - 模板测试`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: #f0f8ff; border-radius: 8px; border-left: 4px solid #007bff;">
            <h2 style="color: #007bff; margin: 0;">📧 邮件模板测试</h2>
            <p style="color: #6c757d; margin: 5px 0 0 0;">模板名称：${template_name} | 类型：${template_type || '未知'}</p>
          </div>
          
          ${template_html}
          
          <div style="text-align: center; margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-top: 2px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              📋 这是一封模板测试邮件 | 发送时间：${new Date().toLocaleString('zh-CN')} | 请勿回复此邮件
            </p>
          </div>
        </div>
      `;
    } else {
      // 默认的配置测试邮件
      emailSubject = `${from_name} - 邮件配置测试`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0;">📧 邮件配置测试</h1>
            <p style="color: #7f8c8d; margin: 10px 0 0 0;">项目管理系统邮件功能测试</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #495057; margin: 0 0 15px 0;">✅ 测试成功</h3>
            <p style="color: #6c757d; margin: 0; line-height: 1.6;">
              恭喜！您的邮件配置已成功设置。系统现在可以正常发送邮件通知。
            </p>
          </div>
          
          <div style="border-left: 4px solid #28a745; padding-left: 15px; margin-bottom: 20px;">
            <h4 style="color: #495057; margin: 0 0 10px 0;">📋 配置信息</h4>
            <ul style="color: #6c757d; margin: 0; padding-left: 20px;">
              <li>SMTP服务器: ${smtp_host}:${smtp_port}</li>
              <li>发件人: ${from_name} &lt;${from_email}&gt;</li>
              <li>安全连接: ${enable_ssl === 'true' ? 'SSL' : enable_tls === 'true' ? 'TLS' : '无'}</li>
              <li>测试时间: ${new Date().toLocaleString('zh-CN')}</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 6px;">
            <p style="color: #155724; margin: 0; font-weight: bold;">
              🎉 邮件系统配置完成！现在可以发送项目通知了。
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              此邮件由项目管理系统自动发送，请勿回复。
            </p>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: `${from_name} <${from_email}>`,
      to: test_email,
      subject: emailSubject,
      html: emailHtml,
    };

    // 发送邮件
    console.log('开始发送测试邮件...');
    console.log('邮件配置:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('测试邮件发送成功:', info.messageId);
    console.log('邮件发送详情:', info);
    
    res.json({
      success: true,
      message: '测试邮件发送成功',
      messageId: info.messageId,
      from: `${from_name} <${from_email}>`,
      to: test_email,
      subject: mailOptions.subject
    });

  } catch (error) {
    console.error('邮件发送失败:', error);
    console.error('错误堆栈:', error.stack);
    
    // 根据错误类型提供更具体的错误信息
    let errorMessage = '邮件发送失败';
    let statusCode = 500;
    
    if (error.code === 'EAUTH') {
      errorMessage = '邮箱认证失败，请检查用户名和密码';
      statusCode = 401;
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'SMTP服务器连接失败，请检查服务器地址和端口';
      statusCode = 400;
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = '连接超时，请检查网络连接或SMTP服务器设置';
      statusCode = 408;
    } else if (error.responseCode === 550) {
      errorMessage = '收件人邮箱地址无效或被拒绝';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message,
      code: error.code,
      responseCode: error.responseCode
    });
  }
});

// 发送通知邮件（供系统其他功能调用）
router.post('/send-notification', authenticateToken, async (req, res) => {
  try {
    const { to, subject, content, type = 'notification' } = req.body;
    
    if (!to || !subject || !content) {
      return res.status(400).json({ error: '缺少必要的邮件参数' });
    }

    // 这里可以从数据库或配置中获取邮件设置
    // 暂时返回功能未实现的提示
    res.status(501).json({ 
      error: '通知邮件功能尚未完全实现',
      message: '请先在配置管理中完善邮件设置' 
    });

  } catch (error) {
    console.error('发送通知邮件失败:', error);
    res.status(500).json({ 
      error: '发送通知邮件失败',
      details: error.message 
    });
  }
});

module.exports = router;
