// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取相关元素
    const navToggle = document.getElementById('nav-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 切换导航栏显示/隐藏
    function toggleNavbar() {
        navbar.classList.toggle('navbar-open');
    }
    
    // 关闭导航栏
    function closeNavbar() {
        navbar.classList.remove('navbar-open');
    }
    
    // 为切换按钮添加点击事件
    if (navToggle) {
        navToggle.addEventListener('click', toggleNavbar);
    }
    
    // 为所有导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 延迟关闭导航栏，确保链接跳转完成
            setTimeout(closeNavbar, 100);
        });
    });
});