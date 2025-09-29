function confirmEnding(string1, string2) {
    console.log(string1.substring(string1.length - string2.length, string1.length));

    // 检查输入参数的有效性
    if (string1.substring(string1.length - string2.length, string1.length) == string2) {
        return true;
    }
    else {
        return false;
    }

}
