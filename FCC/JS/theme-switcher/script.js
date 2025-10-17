const themeSwitcherButton = document.getElementById("theme-switcher-button");
const themeDropdown = document.getElementById("theme-dropdown");
const messageContainer = document.querySelector('[aria-live="polite"]');

// 主题数据
const themes = [{
  name: "light",
  message: "Hello sunshine — Light theme is on!"
}, {
  name: "dark",
  message: "The night is yours — Dark theme is on!"
}, {
  name: "ocean",
  message: "Blue skies and high tides — Ocean theme is on!"
}, {
  name: "nord",
  message: "Focus and clarity — Nord theme is on!"
}];

// 切换主题下拉菜单的显示/隐藏
themeSwitcherButton.addEventListener("click", () => {
  themeDropdown.hidden = !themeDropdown.hidden;
  if (themeDropdown.hidden) {
    themeSwitcherButton.setAttribute("aria-expanded", "false");
  } else {
    themeSwitcherButton.setAttribute("aria-expanded", "true");
  }
});

const themeTypes = document.querySelectorAll('.theme-type');
themeTypes.forEach(themeType => {
  themeType.addEventListener("click", () => {
    // 获取主题名称
    const themeName = themeType.textContent.toLowerCase();
    
    // 更新消息容器
    messageContainer.textContent = themes.find(theme => theme.name === themeName).message;
    
    // 隐藏下拉菜单
    themeDropdown.hidden = !themeDropdown.hidden;
    
    // 移除所有可能的主题类
    document.body.classList.remove('light', 'dark', 'ocean', 'nord');
    
    // 添加新的主题类
    document.body.classList.add(themeName);
  });
});
