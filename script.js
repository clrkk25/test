// 项目主页脚本文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加交互功能
    console.log('项目主页已加载');
    
    // 为所有导航链接添加点击事件跟踪
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log(`用户点击了链接: ${this.textContent}`);
            
            // 添加点击波纹效果
            createRipple(e, this);
        });
    });
});

// 创建点击波纹效果
function createRipple(event, element) {
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
    circle.classList.add("ripple");
    
    const ripple = element.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
}