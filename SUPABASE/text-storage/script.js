// Supabase 文本存储示例项目的JavaScript代码

// 注意：这只是一个前端示例，实际的Supabase集成需要后端配置
// 这里我们模拟数据存储和检索功能

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const saveButton = document.getElementById('saveButton');
    const textList = document.getElementById('textList');
    
    // 模拟存储的数据
    let storedTexts = JSON.parse(localStorage.getItem('supabaseTexts')) || [];
    
    // 显示已存储的文本
    function displayTexts() {
        textList.innerHTML = '';
        storedTexts.forEach((text, index) => {
            const li = document.createElement('li');
            li.textContent = text;
            textList.appendChild(li);
        });
    }
    
    // 保存文本
    saveButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        if (text) {
            storedTexts.push(text);
            localStorage.setItem('supabaseTexts', JSON.stringify(storedTexts));
            textInput.value = '';
            displayTexts();
        }
    });
    
    // 初始化显示
    displayTexts();
});