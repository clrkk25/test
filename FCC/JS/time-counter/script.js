const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const submitBtn = document.getElementById("submit-btn");

// 初始化字符计数
showCharCount({ value: "" });

function showCharCount(text) {
  const currText = text.value;
  
  // 更新字符计数显示
  const charCountText = `Character Count: ${currText.length}/50`;
  charCount.textContent = charCountText;
  
  // 根据字符数量应用不同的样式
  charCount.classList.remove("warning", "over-limit");
  
  if (currText.length >= 50) {
    // 超过限制
    charCount.classList.add("over-limit");
    textInput.value = currText.slice(0, 50); // 截取前50个字符
    submitBtn.disabled = true;
  } else if (currText.length >= 40) {
    // 接近限制
    charCount.classList.add("warning");
    submitBtn.disabled = false;
  } else {
    // 正常状态
    submitBtn.disabled = currText.length === 0; // 如果没有输入则禁用按钮
  }
}

// 提交按钮点击事件
submitBtn.addEventListener("click", () => {
  alert(`Submitted text with ${textInput.value.length} characters!`);
  // 这里可以添加实际的提交逻辑
});

// 输入事件监听
textInput.addEventListener("input", () => showCharCount(textInput));