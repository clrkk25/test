function spinalCase(arr) {
    return arr.replace(/([a-z]\s)/,'$1-').replace(/[\s|_]/g, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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
            const inputValue = inputElement.value;
            if (inputValue) {
                const result = spinalCase(inputValue);
                outputElement.textContent = result;
            } else {
                outputElement.textContent = '请输入要转换的字符串';
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
console.log(spinalCase("This Is Spinal Tap")); // this-is-spinal-tap
console.log(spinalCase("thisIsSpinalTap")); // this-is-spinal-tap
console.log(spinalCase("The_Andy_Griffith_Show")); // the-andy-griffith-show
console.log(spinalCase("Teletubbies say Eh-oh")); // teletubbies-say-eh-oh

