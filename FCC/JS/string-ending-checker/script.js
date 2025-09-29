/**
 * 检查字符串是否以指定的结尾字符串结束
 * @param {string} string1 - 要检查的字符串
 * @param {string} string2 - 结尾字符串
 * @returns {boolean} 如果string1以string2结尾则返回true，否则返回false
 */
function confirmEnding(string1, string2) {
    // 检查输入参数的有效性
    if (typeof string1 !== 'string' || typeof string2 !== 'string') {
        throw new Error('两个参数都必须是字符串');
    }
    
    // 如果结尾字符串为空，返回true（所有字符串都以空字符串结尾）
    if (string2.length === 0) {
        return true;
    }
    
    // 如果结尾字符串比原字符串还长，肯定不匹配
    if (string2.length > string1.length) {
        return false;
    }
    
    // 使用substring方法检查结尾
    return string1.substring(string1.length - string2.length) === string2;
}

// 导出函数以支持模块化使用（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = confirmEnding;
}
