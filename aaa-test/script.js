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
];


function getRandomQuestion(arr){
    let num = Math.floor(Math.random() * arr.length);
    return arr[num];
}

function getRandomComputerChoice (arr) {
    let num = Math.floor(Math.random() * arr.length);
    return arr[num];
}

function getResults  (arr, choice) {
    if(arr.answer === choice){
        return "The computer's choice is correct!";
    }
    return "The computer's choice is wrong. The correct answer is: " + arr.answer;
 } 

let a = getRandomQuestion(questions);
let c = getRandomComputerChoice(a.choices);
console.log(a.question);
console.log(c);
console.log(getResults  (a, c));
