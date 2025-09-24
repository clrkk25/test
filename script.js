// 项目主页脚本文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加交互功能
    console.log('项目主页已加载');
    
    // 为所有导航链接添加点击事件跟踪（仅针对非文件夹链接）
    const navLinks = document.querySelectorAll('nav a:not(.folder-link)');
    navLinks.forEach(link => {
        // 添加鼠标点击事件
        link.addEventListener('click', function(e) {
            console.log(`用户点击了链接: ${this.textContent}`);
            
            // 添加点击波纹效果
            createRipple(e, this);
        });
        
        // 添加触摸事件支持
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        const touchThreshold = 10; // 触摸移动阈值，超过此值认为是滑动
        
        link.addEventListener('touchstart', function(e) {
            console.log(`用户触摸了链接: ${this.textContent}`);
            
            // 记录触摸开始时间和位置
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            // 在触摸设备上也添加波纹效果
            const touch = e.touches[0];
            const mockEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            createRipple(mockEvent, this);
        });
        
        // 添加触摸移动事件处理
        link.addEventListener('touchmove', function(e) {
            // 移除可能已创建的波纹效果
            const ripple = this.querySelector('.ripple');
            if (ripple) {
                ripple.remove();
            }
        });
        
        // 添加触摸结束事件处理
        link.addEventListener('touchend', function(e) {
            // 计算触摸持续时间和移动距离
            const touchDuration = Date.now() - touchStartTime;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);
            
            // 判断是否为点击操作（触摸时间短且移动距离小）
            if (touchDuration < 500 && deltaX < touchThreshold && deltaY < touchThreshold) {
                // 获取链接的href属性
                const href = this.getAttribute('href');
                
                // 如果链接有href属性且不是#，则在短暂延迟后跳转
                if (href && href !== '#') {
                    e.preventDefault(); // 阻止默认行为
                    setTimeout(() => {
                        window.location.href = href; // 使用当前窗口跳转而不是新窗口
                    }, 300); // 延迟300ms以确保波纹效果完成
                }
            } else {
                // 滑动操作，移除波纹效果
                const ripple = this.querySelector('.ripple');
                if (ripple) {
                    ripple.remove();
                }
            }
        });
        
        // 添加触摸取消事件处理
        link.addEventListener('touchcancel', function(e) {
            // 移除可能已创建的波纹效果
            const ripple = this.querySelector('.ripple');
            if (ripple) {
                ripple.remove();
            }
        });
    });
    
    // 处理文件夹展开/折叠功能
    const folderLinks = document.querySelectorAll('.folder-link');
    
    // 为每个文件夹链接添加点击事件监听器
    folderLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认链接行为
            e.preventDefault();
            
            // 获取下一个兄弟元素（即子文件夹列表）
            const subFolder = this.nextElementSibling;
            
            // 检查是否存在子文件夹
            if (subFolder && subFolder.classList.contains('sub-folder')) {
                // 切换显示状态
                if (subFolder.style.display === 'none' || subFolder.style.display === '') {
                    // 展开动画效果
                    subFolder.style.display = 'block';
                    subFolder.style.maxHeight = '0';
                    subFolder.style.overflow = 'hidden';
                    this.classList.add('open');
                    
                    // 触发重排
                    subFolder.offsetHeight;
                    subFolder.style.transition = 'max-height 0.2s ease';
                    subFolder.style.maxHeight = subFolder.scrollHeight + 'px';
                    
                    // 动画结束后清除maxHeight限制
                    setTimeout(() => {
                        if (this.classList.contains('open')) {
                            subFolder.style.maxHeight = 'none';
                        }
                    }, 200);
                } else {
                    // 折叠动画效果
                    subFolder.style.maxHeight = subFolder.scrollHeight + 'px';
                    subFolder.style.transition = 'max-height 0.2s ease';
                    subFolder.offsetHeight; // 触发重排
                    subFolder.style.maxHeight = '0';
                    this.classList.remove('open');
                    
                    // 动画结束后隐藏元素
                    setTimeout(() => {
                        if (!this.classList.contains('open')) {
                            subFolder.style.display = 'none';
                        }
                    }, 200);
                }
            }
        });
    });
    
    // 初始化：默认展开根目录文件夹
    const rootFolders = document.querySelectorAll('[data-folder="BASIC"], [data-folder="FCC"]');
    rootFolders.forEach(folder => {
        const link = folder.querySelector('.folder-link');
        const subFolder = link.nextElementSibling;
        
        if (subFolder) {
            subFolder.style.display = 'block';
            subFolder.style.maxHeight = 'none';
            link.classList.add('open');
        }
    });
});

// 创建点击波纹效果
function createRipple(event, element) {
    // 移除已存在的波纹效果
    const existingRipple = element.querySelector(".ripple");
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // 创建新的波纹元素
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
    circle.classList.add("ripple");
    
    element.appendChild(circle);
    
    // 在动画结束后移除波纹元素
    setTimeout(() => {
        circle.remove();
    }, 600);
}