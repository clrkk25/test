// 项目主页脚本文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取所有文件夹链接
    const folderLinks = document.querySelectorAll('.folder-link');

    // 为每个文件夹链接添加点击事件监听器
    folderLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // 阻止默认链接行为
            e.preventDefault();

            // 获取父级li元素（文件夹）
            const folder = this.parentElement;

            // 获取子文件夹列表
            const subFolder = folder.querySelector('.sub-folder');

            // 切换子文件夹的显示状态
            if (subFolder.style.display === 'none' || subFolder.style.display === '') {
                // 显示子文件夹
                subFolder.style.display = 'block';
                // 设置最大高度以实现滑动动画
                subFolder.style.maxHeight = subFolder.scrollHeight + 'px';
            } else {
                // 隐藏子文件夹
                subFolder.style.maxHeight = '0';
                // 在过渡动画结束后隐藏子文件夹
                setTimeout(() => {
                    subFolder.style.display = 'none';
                }, 300); // 与CSS过渡时间保持一致
            }
        });
    });

    // 获取所有非文件夹链接
    const links = document.querySelectorAll('nav a:not(.folder-link)');

    // 为每个链接添加点击事件监听器
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // 添加波纹效果
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            // 移除波纹效果
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Jekyll适配：确保链接在当前窗口打开
            const href = this.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('{{')) {
                e.preventDefault();
                window.location.href = href;
            }
        });

        // 添加触摸事件支持
        link.addEventListener('touchstart', function () {
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

    // 默认展开根目录文件夹
    const rootFolders = document.querySelectorAll('.folder');
    rootFolders.forEach(folder => {
        const folderName = folder.getAttribute('data-folder');
        if (folderName === 'BASIC' || folderName === 'FCC') {
            const subFolder = folder.querySelector('.sub-folder');
            subFolder.style.display = 'block';
            subFolder.style.maxHeight = subFolder.scrollHeight + 'px';
        }
    });
});