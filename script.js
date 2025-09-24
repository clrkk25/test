// 项目主页脚本文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有文件夹链接
    const folderLinks = document.querySelectorAll('.folder-link');
    
    // 为每个文件夹链接添加点击事件监听器
    folderLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认链接行为
            e.preventDefault();
            
            // 切换文件夹链接的展开状态
            this.classList.toggle('expanded');
            
            // 获取下一个兄弟元素（子文件夹列表）
            const subFolder = this.nextElementSibling;
            
            // 切换子文件夹的显示状态
            if (subFolder.style.display === 'none' || subFolder.style.display === '') {
                subFolder.style.display = 'block';
            } else {
                subFolder.style.display = 'none';
            }
        });
    });
    
    // 获取所有非文件夹链接
    const links = document.querySelectorAll('nav a:not(.folder-link)');
    
    // 为每个链接添加点击事件监听器
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // 添加波纹效果
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // 移除波纹效果
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // 添加触摸事件支持
        link.addEventListener('touchstart', function() {
            // 添加波纹效果
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // 移除波纹效果
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 默认关闭根目录文件夹（BASIC和FCC）
    const rootFolders = document.querySelectorAll('.folder');
    rootFolders.forEach(folder => {
        const folderName = folder.getAttribute('data-folder');
        if (folderName === 'BASIC' || folderName === 'FCC') {
            const folderLink = folder.querySelector('.folder-link');
            const subFolder = folderLink.nextElementSibling;
            // 确保文件夹默认关闭
            folderLink.classList.remove('expanded');
            subFolder.style.display = 'none';
        }
    });
});