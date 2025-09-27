// 原有的MathBot功能
const botName = "MathBot";
const greeting = `Hi there! My name is ${botName} and I am here to teach you about the Math object!`;

console.log(greeting);

console.log("The Math.random() method returns a pseudo random number between 0 and less than 1.");

const randomNum = Math.random();
console.log(randomNum);

console.log("Now, generate a random number between two values.");

const min = 1;
const max = 100;

const randomNum2 = Math.random() * (max - min) + min;
console.log(randomNum2);

console.log("The Math.floor() method rounds the value down to the nearest whole integer.");

const numRoundedDown = Math.floor(6.7);
console.log(numRoundedDown);

console.log("The Math.ceil() method rounds the value up to the nearest whole integer.");

const numRoundedUp = Math.ceil(3.2);
console.log(numRoundedUp);

console.log(
  "The Math.round() method rounds the value to the nearest whole integer."
);

const numRounded = Math.round(2.7);
console.log(numRounded);
const numRounded2 = Math.round(11.2);
console.log(numRounded2);

console.log("The Math.max() and Math.min() methods are used to get the maximum and minimum number from a range.");

const maxNum = Math.max(3, 125, 55, 24);
console.log(maxNum);
const minNum = Math.min(6, 90, 14, 90, 2);
console.log(minNum);

console.log("It was fun learning about the different Math methods with you!");

// 页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 捕获控制台输出并显示在页面上
    const originalLog = console.log;
    const consoleOutput = document.getElementById('console-output');
    
    console.log = function(message) {
        // 调用原始的console.log
        originalLog.apply(console, arguments);
        
        // 将消息添加到页面上的输出区域
        if (consoleOutput) {
            consoleOutput.textContent += message + '\n';
            // 滚动到底部
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
    };
    
    // 重新运行原有的代码以显示在页面上
    console.log(greeting);
    console.log("The Math.random() method returns a pseudo random number between 0 and less than 1.");
    console.log(randomNum);
    console.log("Now, generate a random number between two values.");
    console.log(randomNum2);
    console.log("The Math.floor() method rounds the value down to the nearest whole integer.");
    console.log(numRoundedDown);
    console.log("The Math.ceil() method rounds the value up to the nearest whole integer.");
    console.log(numRoundedUp);
    console.log("The Math.round() method rounds the value to the nearest whole integer.");
    console.log(numRounded);
    console.log(numRounded2);
    console.log("The Math.max() and Math.min() methods are used to get the maximum and minimum number from a range.");
    console.log(maxNum);
    console.log(minNum);
    console.log("It was fun learning about the different Math methods with you!");
    
    // 恢复原始的console.log
    console.log = originalLog;
    
    // 交互式计算器功能
    const calculateBtn = document.getElementById('calculate');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const num1 = parseFloat(document.getElementById('num1').value);
            const operation = document.getElementById('operation').value;
            const num2 = parseFloat(document.getElementById('num2').value);
            const resultDiv = document.getElementById('result');
            
            let result;
            
            if (isNaN(num1)) {
                result = "请输入有效的数字";
            } else {
                switch(operation) {
                    case 'round':
                        result = `Math.round(${num1}) = ${Math.round(num1)}`;
                        break;
                    case 'floor':
                        result = `Math.floor(${num1}) = ${Math.floor(num1)}`;
                        break;
                    case 'ceil':
                        result = `Math.ceil(${num1}) = ${Math.ceil(num1)}`;
                        break;
                    case 'sqrt':
                        if (num1 < 0) {
                            result = "负数不能计算平方根";
                        } else {
                            result = `Math.sqrt(${num1}) = ${Math.sqrt(num1)}`;
                        }
                        break;
                    case 'abs':
                        result = `Math.abs(${num1}) = ${Math.abs(num1)}`;
                        break;
                }
            }
            
            if (resultDiv) {
                resultDiv.textContent = result;
            }
        });
    }
    
    // 演示按钮功能
    const demoButtons = document.querySelectorAll('.demo-btn');
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoType = this.getAttribute('data-demo');
            let result = "";
            
            switch(demoType) {
                case 'random':
                    const random = Math.random();
                    const randomRange = Math.random() * (100 - 1) + 1;
                    result = `0-1之间的随机数: ${random.toFixed(6)}\n1-100之间的随机数: ${randomRange.toFixed(2)}`;
                    break;
                case 'maxmin':
                    const numbers = [3, 125, 55, 24, 6, 90, 14, 90, 2];
                    const max = Math.max(...numbers);
                    const min = Math.min(...numbers);
                    result = `数组 [${numbers.join(', ')}] 中:\n最大值: ${max}\n最小值: ${min}`;
                    break;
                case 'pi':
                    result = `Math.PI = ${Math.PI}\n保留两位小数: ${Math.PI.toFixed(2)}`;
                    break;
                case 'pow':
                    const base = 2;
                    const exponent = 8;
                    const power = Math.pow(base, exponent);
                    result = `Math.pow(${base}, ${exponent}) = ${power}`;
                    break;
            }
            
            const resultDiv = document.getElementById(`${demoType}-result`);
            if (resultDiv) {
                resultDiv.textContent = result;
            }
        });
    });
});