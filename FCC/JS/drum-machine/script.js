const display = document.getElementById('display');
const drum_pad = document.querySelectorAll('.drum-pad');
const audio = document.querySelectorAll('audio');

// 键盘按键映射到音频元素
const keyMap = {
  'Q': { audio: document.getElementById('Q'), pad: document.getElementById('button-Q') },
  'W': { audio: document.getElementById('W'), pad: document.getElementById('button-W') },
  'E': { audio: document.getElementById('E'), pad: document.getElementById('button-E') },
  'A': { audio: document.getElementById('A'), pad: document.getElementById('button-A') },
  'S': { audio: document.getElementById('S'), pad: document.getElementById('button-S') },
  'D': { audio: document.getElementById('D'), pad: document.getElementById('button-D') },
  'Z': { audio: document.getElementById('Z'), pad: document.getElementById('button-Z') },
  'X': { audio: document.getElementById('X'), pad: document.getElementById('button-X') },
  'C': { audio: document.getElementById('C'), pad: document.getElementById('button-C') }
};

// 点击事件处理
drum_pad.forEach((pad) => {
  pad.addEventListener('click', () => {
    // 从按钮ID中提取按键字符（例如从"button-Q"中提取"Q"）
    const key = pad.id.replace('button-', '');
    playSound(key);
  });
});

// 键盘事件处理
document.addEventListener('keydown', (event) => {
  const key = event.key.toUpperCase();
  
  // 检查按下的键是否在映射中
  if (keyMap[key]) {
    playSound(key);
    
    // 添加视觉反馈 - 高亮被按下的按键
    keyMap[key].pad.classList.add('active');
    setTimeout(() => {
      keyMap[key].pad.classList.remove('active');
    }, 150);
  }
});

// 播放声音的函数
function playSound(key) {
  if (keyMap[key] && keyMap[key].audio) {
    // 重置音频并播放
    keyMap[key].audio.currentTime = 0;
    keyMap[key].audio.play();
    
    // 更新显示文本
    display.textContent = key;
  }
}

// 添加键盘事件监听器到整个文档
document.addEventListener('DOMContentLoaded', () => {
  // 确保页面加载后可以接收键盘事件
  document.body.focus();
});

// 确保页面可以接收键盘焦点
document.body.setAttribute('tabindex', '0');
document.body.style.outline = 'none'; // 移除焦点轮廓

