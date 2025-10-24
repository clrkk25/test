const y = ["a", "e", "i", "o", "u"];

function translatePigLatin(str) {
    // 如果字符串包含元音字母
    if(y.some(v => str.includes(v))) {
        // 如果第一个字符不是元音字母
        if (!y.includes(str[0])) {
            // 找到第一个元音字母的位置
            const index = str.split('').findIndex(char => y.includes(char));
            // 如果找到了元音字母
            if (index !== -1) {
                return str.slice(index) + str.slice(0, index) + "ay";
            } else {
                // 如果没有找到元音字母（理论上不应该发生）
                return str + "ay";
            }
        }
        // 如果第一个字符是元音字母
        else if (y.includes(str[0])) {
            return str + "way";
        }
    }
    // 如果字符串不包含元音字母
    return str + "ay";
}

// 如果在浏览器环境中运行，则添加DOM操作功能
if (typeof window !== 'undefined') {
    // 页面加载完成后绑定事件
    document.addEventListener('DOMContentLoaded', function() {
        const inputElement = document.getElementById('inputString');
        const outputElement = document.getElementById('outputString');
        const convertBtn = document.getElementById('convertBtn');
        
        // 转换按钮点击事件
        convertBtn.addEventListener('click', function() {
            const inputValue = inputElement.value.trim();
            if (inputValue) {
                const result = translatePigLatin(inputValue);
                outputElement.textContent = result;
            } else {
                outputElement.textContent = '请输入要转换的单词或句子';
            }
        });
        
        // 回车键触发转换
        inputElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                convertBtn.click();
            }
        });
    });
}

// 保留控制台输出用于测试
console.log(translatePigLatin("california")); // aliforniacay
console.log(translatePigLatin("paragraphs")); // aragraphspay
console.log(translatePigLatin("glove")); // oveglay
console.log(translatePigLatin("algorithm")); // algorithmway
console.log(translatePigLatin("eight")); // eightway
console.log(translatePigLatin("schwartz")); // artzschway
console.log(translatePigLatin("rhythm")); // rhythmay
