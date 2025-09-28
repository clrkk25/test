/**
 * 字符串截断函数
 * @param {string} string1 - 要截断的字符串
 * @param {number} num - 最大长度
 * @returns {string} 截断后的字符串，如果需要截断会在末尾添加...
 */
function truncateString(string1, num) {
    // 检查输入参数的有效性
    if (typeof string1 !== 'string') {
        throw new Error('第一个参数必须是字符串');
    }
    
    if (typeof num !== 'number' || num < 0) {
        throw new Error('第二个参数必须是非负数');
    }
    
    // 如果指定长度大于等于字符串长度，直接返回原字符串
    if (num >= string1.length) {
        return string1;
    }
    
    // 截断字符串并在末尾添加省略号
    return string1.slice(0, num) + "...";
}

// 导出函数以支持模块化使用（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = truncateString;
}
