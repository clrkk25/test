// 项目主页脚本文件

// 保存文件夹状态到localStorage
function saveFolderState(folderPath, isExpanded) {
    const folderStates = JSON.parse(localStorage.getItem('folderStates') || '{}');
    folderStates[folderPath] = isExpanded;
    localStorage.setItem('folderStates', JSON.stringify(folderStates));
}

// 从localStorage获取文件夹状态
function getFolderState(folderPath) {
    const folderStates = JSON.parse(localStorage.getItem('folderStates') || '{}');
    return folderStates[folderPath];
}

// 恢复所有文件夹状态
function restoreFolderStates() {
    const folderStates = JSON.parse(localStorage.getItem('folderStates') || '{}');
    
    // 遍历所有文件夹
    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => {
        const folderPath = folder.getAttribute('data-folder');
        if (folderPath && folderStates[folderPath] !== undefined) {
            const folderLink = folder.querySelector('.folder-link');
            const subFolder = folderLink.nextElementSibling;
            
            if (folderStates[folderPath]) {
                // 展开文件夹
                folderLink.classList.add('expanded');
                subFolder.style.display = 'block';
            } else {
                // 关闭文件夹
                folderLink.classList.remove('expanded');
                subFolder.style.display = 'none';
            }
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 恢复之前保存的文件夹状态
    restoreFolderStates();
    
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
            
            // 保存当前文件夹状态
            const folder = this.closest('.folder');
            if (folder) {
                const folderPath = folder.getAttribute('data-folder');
                const isExpanded = this.classList.contains('expanded');
                saveFolderState(folderPath, isExpanded);
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
});