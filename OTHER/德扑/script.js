// 菜单页面逻辑
class MenuManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadGameStats();
    }

    bindEvents() {
        // 开始游戏按钮
        const startBtn = document.getElementById('startGame');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        // 切换规则显示
        const toggleRulesBtn = document.getElementById('toggleRules');
        const rulesPanel = document.getElementById('rulesPanel');
        
        if (toggleRulesBtn && rulesPanel) {
            toggleRulesBtn.addEventListener('click', () => {
                rulesPanel.classList.toggle('hidden');
                toggleRulesBtn.textContent = rulesPanel.classList.contains('hidden') 
                    ? '查看游戏规则' 
                    : '隐藏游戏规则';
            });
        }

        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.startGame();
            }
        });
    }

    startGame() {
        // 添加开始游戏动画效果
        const startBtn = document.getElementById('startGame');
        if (startBtn) {
            startBtn.style.transform = 'scale(0.95)';
            startBtn.style.opacity = '0.8';
            
            setTimeout(() => {
                startBtn.style.transform = 'scale(1)';
                startBtn.style.opacity = '1';
                
                // 跳转到游戏页面
                window.location.href = 'game.html';
            }, 150);
        } else {
            // 直接跳转
            window.location.href = 'game.html';
        }
    }

    loadGameStats() {
        // 从localStorage加载游戏统计数据
        try {
            const stats = localStorage.getItem('poker_stats');
            if (stats) {
                const gameStats = JSON.parse(stats);
                this.displayStats(gameStats);
            }
        } catch (error) {
            console.log('无法加载游戏统计数据');
        }
    }

    displayStats(stats) {
        // 在页面上显示游戏统计数据
        const statsElement = document.createElement('div');
        statsElement.className = 'game-stats';
        statsElement.innerHTML = `
            <h3>游戏统计</h3>
            <p>总游戏次数: ${stats.totalGames || 0}</p>
            <p>获胜次数: ${stats.wins || 0}</p>
            <p>胜率: ${stats.winRate ? (stats.winRate * 100).toFixed(1) : 0}%</p>
        `;
        
        const menuContent = document.querySelector('.menu-content');
        if (menuContent) {
            menuContent.insertBefore(statsElement, menuContent.firstChild);
        }
    }

    saveGameStats(result) {
        // 保存游戏统计数据到localStorage
        try {
            let stats = JSON.parse(localStorage.getItem('poker_stats') || '{}');
            
            stats.totalGames = (stats.totalGames || 0) + 1;
            if (result === 'win') {
                stats.wins = (stats.wins || 0) + 1;
            }
            stats.winRate = stats.wins / stats.totalGames;
            
            localStorage.setItem('poker_stats', JSON.stringify(stats));
        } catch (error) {
            console.log('无法保存游戏统计数据');
        }
    }
}

// 页面加载完成后初始化菜单管理器
document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加一些视觉效果
function addVisualEffects() {
    // 创建背景粒子效果
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particlesContainer);
    
    // 创建一些扑克牌样式的粒子
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.innerHTML = '♠♥♦♣';
    particle.style.cssText = `
        position: absolute;
        color: rgba(212, 175, 55, 0.1);
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s linear infinite;
        transform: rotate(${Math.random() * 360}deg);
    `;
    
    container.appendChild(particle);
}

// 添加浮动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
        100% { transform: translateY(0px) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// 初始化视觉效果
addVisualEffects();