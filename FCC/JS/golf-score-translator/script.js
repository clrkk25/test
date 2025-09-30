const names = ["Hole-in-one!", "Eagle", "Birdie", "Par", "Bogey", "Double Bogey", "Go Home!"];

function golfScore(par, strokes) {
  // 检查输入是否有效
  if (par < 1 || strokes < 1) {
    return "输入无效";
  }
  
  // 根据条件判断返回对应的术语
  if (par === 1) {
    return "Hole-in-one!";
  } else if (strokes <= par - 2) {
    return "Eagle";
  } else if (strokes === par - 1) {
    return "Birdie";
  } else if (strokes === par) {
    return "Par";
  } else if (strokes === par + 1) {
    return "Bogey";
  } else if (strokes === par + 2) {
    return "Double Bogey";
  } else {
    return "Go Home!";
  }
}

// 翻译分数并显示结果
function translateScore() {
  // 获取输入值
  const parInput = document.getElementById('par');
  const strokesInput = document.getElementById('strokes');
  
  // 验证输入
  if (!parInput || !strokesInput) {
    console.error("无法找到输入元素");
    return;
  }
  
  const par = parseInt(parInput.value);
  const strokes = parseInt(strokesInput.value);
  
  // 检查输入是否有效
  if (isNaN(par) || isNaN(strokes)) {
    document.getElementById('result').textContent = "请输入有效的数字";
    return;
  }
  
  // 调用golfScore函数获取结果
  const result = golfScore(par, strokes);
  
  // 显示结果
  const resultElement = document.getElementById('result');
  if (resultElement) {
    resultElement.textContent = result;
  }
}

// 页面加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
  const parInput = document.getElementById('par');
  const strokesInput = document.getElementById('strokes');
  const button = document.querySelector('button');
  
  // 添加回车键支持
  if (parInput && strokesInput) {
    parInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        translateScore();
      }
    });
    
    strokesInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        translateScore();
      }
    });
  }
});