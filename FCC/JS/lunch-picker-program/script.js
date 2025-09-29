/**
 * 向数组末尾添加午餐项
 * @param {Array} arr - 午餐数组
 * @param {string} string - 要添加的午餐项
 * @returns {Array} 更新后的数组
 */
function addLunchToEnd(arr, string) {
    // 参数有效性检查
    if (typeof string !== 'string') {
        console.log("错误：第二个参数必须是字符串");
        return arr;
    }
    
    arr.push(string);
    console.log(`${string} added to the end of the lunch menu.`);
    return arr;
}

/**
 * 向数组开头添加午餐项
 * @param {Array} arr - 午餐数组
 * @param {string} string - 要添加的午餐项
 * @returns {Array} 更新后的数组
 */
function addLunchToStart(arr, string) {
    // 参数有效性检查
    if (typeof string !== 'string') {
        console.log("错误：第二个参数必须是字符串");
        return arr;
    }
    
    arr.unshift(string);
    console.log(`${string} added to the start of the lunch menu.`);
    return arr;
}

/**
 * 移除数组末尾的午餐项
 * @param {Array} arr - 午餐数组
 * @returns {Array} 更新后的数组
 */
function removeLastLunch(arr) {
    if (arr.length === 0) {
        console.log("No lunches to remove.");
        return arr;
    }
    
    let string = arr[arr.length - 1];
    arr.pop();
    console.log(`${string} removed from the end of the lunch menu.`);
    return arr;
}

/**
 * 移除数组开头的午餐项
 * @param {Array} arr - 午餐数组
 * @returns {Array} 更新后的数组
 */
function removeFirstLunch(arr) {
    if (arr.length === 0) {
        console.log("No lunches to remove.");
        return arr;
    }
    
    let string = arr[0];
    arr.shift();
    console.log(`${string} removed from the start of the lunch menu.`);
    return arr;
}

/**
 * 随机选择一个午餐项
 * @param {Array} arr - 午餐数组
 */
function getRandomLunch(arr) {
    if (arr.length === 0) {
        console.log("No lunches available.");
        return;
    }
    
    let string = arr[Math.floor(Math.random() * arr.length)];
    console.log(`Randomly selected lunch: ${string}`);
    return string;
}

/**
 * 显示所有午餐项
 * @param {Array} arr - 午餐数组
 */
function showLunchMenu(arr) {
    if (arr.length === 0) {
        console.log("The menu is empty.");
        return;
    }
    
    let string = "";
    for (let i = 0; i < arr.length; i++) {
        string += arr[i];
        if (i < arr.length - 1) {
            string += ", ";
        }
    }
    
    console.log(`Menu items: ${string}`);
    return string;
}

// 模块化支持
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addLunchToEnd,
        addLunchToStart,
        removeLastLunch,
        removeFirstLunch,
        getRandomLunch,
        showLunchMenu
    };
}


