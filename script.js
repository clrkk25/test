// 项目主页脚本文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加交互功能
    console.log('项目主页已加载');
    
    // 为所有导航链接添加点击事件跟踪
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log(`用户点击了链接: ${this.textContent}`);
        });
    });
});