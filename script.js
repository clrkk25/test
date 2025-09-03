// 项目主页脚本文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加交互功能
    console.log('项目主页已加载');
    
    // 为所有导航链接添加点击事件跟踪
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        // 添加鼠标点击事件
        link.addEventListener('click', function(e) {
            console.log(`用户点击了链接: ${this.textContent}`);
            
            // 添加点击波纹效果
            createRipple(e, this);
        });
        
        // 添加触摸事件支持
        link.addEventListener('touchstart', function(e) {
            console.log(`用户触摸了链接: ${this.textContent}`);
            
            // 在触摸设备上也添加波纹效果
            const touch = e.touches[0];
            const mockEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            createRipple(mockEvent, this);
        });
        
        // 防止触摸后的鼠标事件
        link.addEventListener('touchend', function(e) {
            e.preventDefault();
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