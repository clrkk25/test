function reverseString(string) {
  let arr = "";
  for (let i = 0; i < string.length; i++) {
    arr += string[string.length - 1 - i];
  }
  return arr;
}

// 反转字符串并显示结果
function reverseAndDisplay() {
  // 获取输入值
  const inputElement = document.getElementById('inputString');
  
  // 验证输入
  if (!inputElement) {
    console.error("无法找到输入元素");
    return;
  }
  
  const inputString = inputElement.value;
  
  // 检查输入是否为空
  if (inputString === "") {
    document.getElementById('result').textContent = "请输入一个字符串";
    return;
  }
  
  // 调用reverseString函数获取结果
  const result = reverseString(inputString);
  
  // 显示结果
  const resultElement = document.getElementById('result');
  if (resultElement) {
    resultElement.textContent = result;
  }
}

// 页面加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('inputString');
  
  // 添加回车键支持
  if (inputElement) {
    inputElement.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        reverseAndDisplay();
      }
    });
  }
});

// 其他反转字符串的方法（供参考）
function reverseStringWithBuiltIn(string) {
  return string.split('').reverse().join('');
}

function reverseStringWithSpread(string) {
  return [...string].reverse().join('');
}

function reverseStringWithArrayFrom(string) {
  return Array.from(string).reverse().join('');
}