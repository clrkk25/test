const questions = [
    {
        category: "音乐",
        question: "被誉为钢琴诗人的是哪位作曲家?",
        choices: ["肖邦", "贝多芬", "莫扎特"],
        answer: "肖邦"
    },
    {
        category: "艺术",
        question: "《蒙娜丽莎》是哪位画家的作品?",
        choices: ["达·芬奇", "拉斐尔", "米开朗基罗"],
        answer: "达·芬奇"
    },
    {
        category: "数学",
        question: "圆周率π约等于多少（保留两位小数）?",
        choices: ["3.14", "3.15", "3.16"],
        answer: "3.14"
    },
    {
        category: "生物",
        question: "人体中最大的器官是?",
        choices: ["皮肤", "肝脏", "肺"],
        answer: "皮肤"
    },
    {
        category: "交通",
        question: "世界上第一条地铁在哪个城市建成?",
        choices: ["伦敦", "巴黎", "纽约"],
        answer: "伦敦"
    },
    {
        category: "地理",
        question: "世界上最大的洲是?",
        choices: ["亚洲", "非洲", "北美洲"],
        answer: "亚洲"
    },
    {
        category: "历史",
        question: "中国历史上第一个统一的封建王朝是?",
        choices: ["秦朝", "汉朝", "唐朝"],
        answer: "秦朝"
    },
    {
        category: "科学",
        question: "光速在真空中的速度约为每秒多少公里?",
        choices: ["30万公里", "40万公里", "50万公里"],
        answer: "30万公里"
    }
];

// 游戏状态变量
let currentQuestion = null;
let score = 0;
let totalQuestions = 0;
let answered = false;

// DOM元素
const categoryElement = document.getElementById('category');
const questionElement = document.getElementById('question');
const choiceElements = [
    document.getElementById('choice0'),
    document.getElementById('choice1'),
    document.getElementById('choice2')
];
const resultElement = document.getElementById('result');
const resultTextElement = document.getElementById('result-text');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalTotalElement = document.getElementById('final-total');
const restartButton = document.getElementById('restart-btn');

// 初始化游戏
function initGame() {
    score = 0;
    totalQuestions = 0;
    answered = false;
    gameOverElement.style.display = 'none';
    loadQuestion();
    updateScore();
}

// 加载问题
function loadQuestion() {
    // 如果所有问题都答完了，显示游戏结束界面
    if (totalQuestions >= questions.length) {
        showGameOver();
        return;
    }
    
    // 获取随机问题
    currentQuestion = getRandomQuestion(questions);
    
    // 显示问题和选项
    categoryElement.textContent = currentQuestion.category;
    questionElement.textContent = currentQuestion.question;
    
    // 显示选项
    currentQuestion.choices.forEach((choice, index) => {
        choiceElements[index].textContent = choice;
        choiceElements[index].disabled = false;
        choiceElements[index].classList.remove('correct', 'incorrect');
    });
    
    // 隐藏结果区域
    resultElement.classList.remove('show');
    answered = false;
}

// 获取随机问题
function getRandomQuestion(arr) {
    let num = Math.floor(Math.random() * arr.length);
    return arr[num];
}

// 处理选项点击
function handleChoiceClick(choiceIndex) {
    if (answered) return;
    
    answered = true;
    totalQuestions++;
    
    const selectedChoice = currentQuestion.choices[choiceIndex];
    const isCorrect = selectedChoice === currentQuestion.answer;
    
    // 更新选项样式
    choiceElements.forEach((choice, index) => {
        choice.disabled = true;
        if (currentQuestion.choices[index] === currentQuestion.answer) {
            choice.classList.add('correct');
        } else if (index === choiceIndex) {
            choice.classList.add('incorrect');
        }
    });
    
    // 更新得分
    if (isCorrect) {
        score++;
    }
    
    // 显示结果
    resultTextElement.textContent = isCorrect ? 
        '🎉 回答正确!' : 
        `❌ 回答错误。正确答案是: ${currentQuestion.answer}`;
    resultElement.classList.add('show');
    
    // 更新得分显示
    updateScore();
}

// 更新得分显示
function updateScore() {
    scoreElement.textContent = score;
    totalElement.textContent = totalQuestions;
}

// 显示游戏结束界面
function showGameOver() {
    finalScoreElement.textContent = score;
    finalTotalElement.textContent = totalQuestions;
    gameOverElement.style.display = 'block';
}

// 事件监听器
choiceElements[0].addEventListener('click', () => handleChoiceClick(0));
choiceElements[1].addEventListener('click', () => handleChoiceClick(1));
choiceElements[2].addEventListener('click', () => handleChoiceClick(2));

nextButton.addEventListener('click', () => {
    if (answered) {
        loadQuestion();
    }
});

restartButton.addEventListener('click', () => {
    initGame();
});

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
