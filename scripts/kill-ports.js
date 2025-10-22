#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

const PORTS = [7076, 7080];
const platform = os.platform();

console.log('====================================');
console.log('   端口清理工具');
console.log('====================================\n');

async function killPort(port) {
  return new Promise((resolve) => {
    let command;
    
    if (platform === 'win32') {
      // Windows 系统
      command = `netstat -ano | findstr :${port} | findstr LISTENING`;
    } else {
      // Linux/Mac 系统
      command = `lsof -ti:${port}`;
    }

    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`[OK] 端口 ${port} 未被占用`);
        resolve(true);
        return;
      }

      let pid;
      if (platform === 'win32') {
        // Windows: 从 netstat 输出中提取 PID (最后一列)
        const lines = stdout.trim().split('\n');
        const match = lines[0].match(/\s+(\d+)\s*$/);
        pid = match ? match[1] : null;
      } else {
        // Linux/Mac: lsof 直接返回 PID
        pid = stdout.trim().split('\n')[0];
      }

      if (!pid) {
        console.log(`[警告] 无法获取端口 ${port} 的进程ID`);
        resolve(false);
        return;
      }

      console.log(`[发现] 端口 ${port} 被进程 ${pid} 占用`);
      console.log(`[操作] 正在终止进程 ${pid}...`);

      const killCommand = platform === 'win32' 
        ? `taskkill /F /PID ${pid}`
        : `kill -9 ${pid}`;

      exec(killCommand, (killError) => {
        if (killError) {
          console.log(`[失败] 无法终止进程 ${pid}${platform === 'win32' ? ' (可能需要管理员权限)' : ' (可能需要 sudo)'}`);
          resolve(false);
        } else {
          console.log(`[成功] 进程 ${pid} 已终止`);
          resolve(true);
        }
      });
    });
  });
}

async function main() {
  console.log(`[信息] 检测到系统: ${platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : 'Linux'}`);
  console.log('[信息] 正在检查端口占用情况...\n');

  for (const port of PORTS) {
    await killPort(port);
  }

  console.log('\n====================================');
  console.log('[完成] 端口清理完成');
  console.log('====================================\n');
}

main();

