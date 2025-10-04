const recordCollection = {
  2548: {
    albumTitle: 'Slippery When Wet',
    artist: 'Bon Jovi',
    tracks: ['Let It Rock', 'You Give Love a Bad Name']
  },
  2468: {
    albumTitle: '1999',
    artist: 'Prince',
    tracks: ['1999', 'Little Red Corvette']
  },
  1245: {
    artist: 'Robert Palmer',
    tracks: []
  },
  5439: {
    albumTitle: 'ABBA Gold'
  }
};

// 更新唱片信息的函数
function updateRecords(records, id, prop, value) {
  // 如果值为空字符串，则删除属性
  if (value === "") {
    delete records[id][prop];
    return records;
  }

  // 检查ID是否存在
  if (id in records) {
    // 如果属性是tracks
    if (prop === "tracks") {
      // 如果该唱片没有tracks属性，则创建一个空数组
      if (!records[id].hasOwnProperty("tracks")) {
        records[id][prop] = [];
      }
      // 将值添加到tracks数组中
      records[id][prop].push(value);
    } else {
      // 对于其他属性，直接赋值
      records[id][prop] = value;
    }
  }
  return records;
}

// 显示所有唱片信息的函数
function displayRecords() {
  const output = document.getElementById('output');
  let displayText = '';
  
  for (const id in recordCollection) {
    displayText += `唱片 ID: ${id}\n`;
    for (const prop in recordCollection[id]) {
      if (prop === 'tracks') {
        displayText += `  ${prop}: [${recordCollection[id][prop].join(', ')}]\n`;
      } else {
        displayText += `  ${prop}: ${recordCollection[id][prop]}\n`;
      }
    }
    displayText += '\n';
  }
  
  output.textContent = displayText;
}

// 处理表单提交
function handleUpdate(event) {
  event.preventDefault();
  
  const recordId = document.getElementById('recordId').value;
  const property = document.getElementById('property').value;
  const value = document.getElementById('value').value;
  
  if (!recordId || !property || !value) {
    alert('请填写所有字段');
    return;
  }
  
  updateRecords(recordCollection, parseInt(recordId), property, value);
  displayRecords();
  
  // 清空表单
  document.getElementById('recordForm').reset();
}

// 重置表单
function handleReset() {
  document.getElementById('recordForm').reset();
}

// 测试用例1：添加曲目到2468
function runTest1() {
  console.log('测试前:', recordCollection[2468]);
  updateRecords(recordCollection, 2468, "tracks", "Free");
  console.log('测试后:', recordCollection[2468]);
  displayRecords();
}

// 测试用例2：删除属性
function runTest2() {
  console.log('测试前:', recordCollection[5439]);
  updateRecords(recordCollection, 5439, "albumTitle", "");
  console.log('测试后:', recordCollection[5439]);
  displayRecords();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 显示初始唱片信息
  displayRecords();
  
  // 绑定事件监听器
  document.getElementById('recordForm').addEventListener('submit', handleUpdate);
  document.getElementById('resetBtn').addEventListener('click', handleReset);
  document.getElementById('test1').addEventListener('click', runTest1);
  document.getElementById('test2').addEventListener('click', runTest2);
  
  // 支持回车键提交表单
  document.getElementById('value').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      handleUpdate(event);
    }
  });
});

// 保留原始测试代码
console.log("初始状态:");
console.log(recordCollection[2468]);
updateRecords(recordCollection, 2468, "tracks", "Free");
console.log("添加'Free'后:");
console.log(recordCollection[2468]);
