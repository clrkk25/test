function mutation(arr) {
    // 将数组元素转换为小写字符串
    const str1 = arr[0].toLowerCase();
    const str2 = arr[1].toLowerCase();

    // 过滤出第一个字符串中的字母字符并去重
    const letters1 = new Set();
    for (const char of str1) {
        // 判断当前字符是否为小写字母，若是则添加到集合中
        if (/[a-z]/.test(char)) {
            letters1.add(char);
        }
    }

    // 过滤出第二个字符串中的字母字符并去重
    const letters2 = new Set();
    for (const char of str2) {
        // 判断当前字符是否为小写字母，若是则添加到集合中
        if (/[a-z]/.test(char)) {
            letters2.add(char);
        }
    }

    // 判断第二个字符串的字母是否都存在于第一个字符串中，即判断 letters2 是否是 letters1 的子集
    for (const char of letters2) {
        // 判断第二个字符串中的当前字母是否不存在于第一个字符串中，若不存在则返回 false
        if (!letters1.has(char)) {
            return false;
        }
    }
    return true;
}
console.log(mutation(["hello", "hey"])); // false
