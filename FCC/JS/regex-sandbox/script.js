const regexPattern = document.getElementById('pattern');
const stringToTest = document.getElementById('test-string');
const testBtn = document.getElementById('test-btn');
const testResult = document.getElementById('result');
const caseInsensitiveFlag = document.getElementById('i');
const globalFlag = document.getElementById('g');
const testButton = document.getElementById('test-btn');

function getFlags() {
    let flags = '';
    if (caseInsensitiveFlag.checked) {
        flags += 'i';
    }
    if (globalFlag.checked) {
        flags += 'g';
    }
    return flags;
}

testBtn.addEventListener('click', () => {
    // 获取用户输入的测试字符串
    const testString = stringToTest.innerText || stringToTest.textContent;
    
    let regex = new RegExp(regexPattern.value, getFlags());

    console.log(regex);
    console.log(testString);
    console.log(caseInsensitiveFlag.checked);
    console.log(globalFlag.checked);
    
    // 执行匹配并获取结果
    const matchResult = testString.match(regex);
    console.log("Match result:", matchResult);
    
    // 显示匹配结果
    if (matchResult) {
        testResult.textContent = Array.isArray(matchResult) ? 
            matchResult.join(', ') : 
            matchResult.toString();
    } else {
        testResult.textContent = "no match";
    }
    
    // 高亮显示匹配的内容
    if (regex.global) {
        // 全局匹配，高亮所有匹配项
        stringToTest.innerHTML = testString.replace(regex, `<span class="highlight">$&</span>`);
    } else if (matchResult) {
        // 非全局匹配，只高亮第一个匹配项
        stringToTest.innerHTML = testString.replace(regex, `<span class="highlight">$&</span>`);
    } else {
        // 没有匹配项，保持原样
        stringToTest.textContent = testString;
    }
});