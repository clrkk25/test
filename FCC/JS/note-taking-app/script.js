const noteEl = document.getElementById("note");
const statusEl = document.getElementById("status");
let currentContent = "";

// 显示初始状态消息
window.addEventListener("DOMContentLoaded", () => {
  currentContent = noteEl.textContent;
  showStatus("Click on the note to start editing", 3000);
});

noteEl.addEventListener("focus", () => {
  showStatus("Editing note...", 0);
});

noteEl.addEventListener("blur", () => {
  const newContent = noteEl.innerHTML;
  if (currentContent === newContent) {
    showStatus("No changes made", 2000);
    return;
  }
  currentContent = newContent;
  console.log(currentContent);
  showStatus("Note saved successfully!", 3000);
});

// 显示状态消息的函数
function showStatus(message, duration) {
  statusEl.textContent = message;
  
  // 如果duration大于0，则在指定时间后清除消息
  if (duration > 0) {
    setTimeout(() => {
      statusEl.textContent = "";
    }, duration);
  }
}

// 添加键盘快捷键支持
document.addEventListener("keydown", (e) => {
  // Ctrl+S 或 Cmd+S 保存
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    noteEl.blur(); // 触发保存
  }
});