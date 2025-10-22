/**
 * 头像生成工具 - 完全本地化实现，适合内网部署
 * 根据用户名生成独特的彩色头像
 */

/**
 * 根据字符串生成一致的颜色
 * @param {string} str - 输入字符串（用户名）
 * @returns {string} HSL颜色值
 */
function generateColor(str) {
  if (!str) return 'hsl(200, 65%, 55%)'; // 默认蓝色
  
  // 使用简单的哈希算法生成一致的色相值
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // 转换为32位整数
  }
  
  // 生成0-360度的色相值
  const hue = Math.abs(hash % 360);
  
  // 返回HSL颜色（饱和度65%，亮度55%）
  return `hsl(${hue}, 65%, 55%)`;
}

/**
 * 调整颜色亮度
 * @param {string} hslColor - HSL颜色字符串
 * @param {number} amount - 调整量（-100 到 100）
 * @returns {string} 调整后的HSL颜色
 */
function adjustBrightness(hslColor, amount) {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslColor;
  
  const [, h, s, l] = match;
  const newL = Math.max(0, Math.min(100, parseInt(l) + amount));
  
  return `hsl(${h}, ${s}%, ${newL}%)`;
}

/**
 * 获取用户名的首字符
 * 支持中文和英文
 * @param {string} username - 用户名
 * @returns {string} 首字符（大写）
 */
function getFirstChar(username) {
  if (!username || username.length === 0) return '?';
  
  const firstChar = username.charAt(0);
  
  // 如果是中文字符，直接返回
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return firstChar;
  }
  
  // 如果是英文字符，转为大写
  if (/[a-zA-Z]/.test(firstChar)) {
    return firstChar.toUpperCase();
  }
  
  // 如果是数字或其他字符
  if (/[0-9]/.test(firstChar)) {
    return firstChar;
  }
  
  // 其他情况返回第一个字符
  return firstChar;
}

/**
 * 生成用户头像（Base64格式）
 * @param {string} username - 用户名
 * @param {number} size - 头像尺寸（像素）
 * @param {string} role - 用户角色（可选，用于特殊标识）
 * @returns {string} Base64格式的图片数据
 */
export function generateAvatar(username, size = 100, role = null) {
  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // 生成渐变背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  const baseColor = generateColor(username);
  const darkerColor = adjustBrightness(baseColor, -15);
  
  gradient.addColorStop(0, baseColor);
  gradient.addColorStop(1, darkerColor);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // 添加微妙的纹理效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * (size / 10);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制首字符
  const firstChar = getFirstChar(username);
  
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.45}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Microsoft YaHei", "微软雅黑"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  ctx.fillText(firstChar, size / 2, size / 2);
  
  // 如果是管理员，添加皇冠标记
  if (role === 'admin') {
    ctx.shadowColor = 'transparent';
    ctx.font = `${size * 0.25}px sans-serif`;
    ctx.fillText('👑', size * 0.75, size * 0.25);
  }
  
  // 转换为Base64
  return canvas.toDataURL('image/png');
}

/**
 * 获取用户头像（如果用户已上传则使用上传的，否则生成默认头像）
 * @param {object} user - 用户对象，包含 username 和 avatar 字段
 * @param {number} size - 头像尺寸
 * @returns {string} 头像URL（上传的或生成的）
 */
export function getUserAvatar(user, size = 100) {
  if (!user) return generateAvatar('?', size);
  
  // 如果用户已上传头像，直接使用
  if (user.avatar) {
    return user.avatar;
  }
  
  // 否则生成默认头像
  return generateAvatar(user.username, size, user.role);
}

/**
 * 预加载头像（用于优化性能）
 * @param {string} username - 用户名
 * @param {number} size - 头像尺寸
 * @returns {Promise<string>} Base64图片数据
 */
export function preloadAvatar(username, size = 100) {
  return Promise.resolve(generateAvatar(username, size));
}

/**
 * 批量生成多个用户的头像
 * @param {Array} users - 用户数组
 * @param {number} size - 头像尺寸
 * @returns {Object} 用户名到头像的映射对象
 */
export function generateAvatarBatch(users, size = 100) {
  const avatarMap = {};
  
  users.forEach(user => {
    if (user.username) {
      avatarMap[user.username] = getUserAvatar(user, size);
    }
  });
  
  return avatarMap;
}

/**
 * 测试头像生成器
 * 在控制台调用此函数可以查看生成效果
 */
export function testAvatarGenerator() {
  const testUsers = [
    { username: '张三', role: 'client' },
    { username: '李四', role: 'client' },
    { username: 'admin', role: 'admin' },
    { username: 'Alice', role: 'client' },
    { username: 'Bob', role: 'client' },
    { username: '王五', role: 'client' }
  ];
  
  console.log('🎨 头像生成器测试\n');
  
  testUsers.forEach(user => {
    const avatar = generateAvatar(user.username, 100, user.role);
    console.log(`用户: ${user.username.padEnd(10)} | 角色: ${user.role.padEnd(7)} | Base64长度: ${avatar.length}`);
  });
  
  console.log('\n✅ 所有头像生成成功！');
  console.log('💡 提示: 相同用户名会生成相同的颜色');
}

export default {
  generateAvatar,
  getUserAvatar,
  preloadAvatar,
  generateAvatarBatch,
  testAvatarGenerator
};

