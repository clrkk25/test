// 元音计数函数
function getVowelCount(sentence) {
  const vowels = "aeiouAEIOU";
  let count = 0;

  for (const char of sentence) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

// 辅音计数函数
function getConsonantCount(sentence) {
  const consonants = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
  let count = 0;

  for (const char of sentence) {
    if (consonants.includes(char)) {
      count++;
    }
  }
  return count;
}

// 标点符号计数函数
function getPunctuationCount(sentence) {
  const punctuations = ".,!?;:-()[]{}\"'–";
  let count = 0;

  for (const char of sentence) {
    if (punctuations.includes(char)) {
      count++;
    }
  }
  return count;
}

// 单词计数函数
function getWordCount(sentence) {
  const trimmed = sentence.trim();
  if (trimmed === '') {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

// 字符计数函数
function getCharacterCount(sentence) {
  return sentence.length;
}

// 大写字母计数函数
function getUppercaseCount(sentence) {
  let count = 0;
  for (const char of sentence) {
    if (char >= 'A' && char <= 'Z') {
      count++;
    }
  }
  return count;
}

// 小写字母计数函数
function getLowercaseCount(sentence) {
  let count = 0;
  for (const char of sentence) {
    if (char >= 'a' && char <= 'z') {
      count++;
    }
  }
  return count;
}

// 数字计数函数
function getDigitCount(sentence) {
  let count = 0;
  for (const char of sentence) {
    if (char >= '0' && char <= '9') {
      count++;
    }
  }
  return count;
}

// 空格计数函数
function getSpaceCount(sentence) {
  let count = 0;
  for (const char of sentence) {
    if (char === ' ') {
      count++;
    }
  }
  return count;
}

// 获取最长单词
// 查找最长单词长度函数
function findLongestWordLength(sentence) {
    const trimmed = sentence.trim();
    if (trimmed === '') {
        return 0;
    }
    let arr = trimmed.split(/\s+/);
    let maxLength = 0;
    for (let i = 0; i < arr.length; i++) {
        // 移除单词中的标点符号后再计算长度
        const cleanWord = arr[i].replace(/[.,!?;:(){}\[\]"']/g, '');
        if (cleanWord.length > maxLength) {
            maxLength = cleanWord.length;
        }
    }
    return maxLength;
}
function getLongestWord(sentence) {
  const trimmed = sentence.trim();
  if (trimmed === '') {
    return '-';
  }
  
  const words = trimmed.split(/\s+/);
  let longest = '';
  
  for (const word of words) {
    // 移除单词中的标点符号
    const cleanWord = word.replace(/[.,!?;:(){}\[\]"']/g, '');
    if (cleanWord.length > longest.length) {
      longest = cleanWord;
    }
  }
  
  return longest || '-';
}

// 判断句子类型
function getSentenceType(sentence) {
  const trimmed = sentence.trim();
  if (trimmed === '') {
    return '-';
  }
  
  if (trimmed.endsWith('.')) {
    return '陈述句';
  } else if (trimmed.endsWith('?')) {
    return '疑问句';
  } else if (trimmed.endsWith('!')) {
    return '感叹句';
  } else {
    return '未知类型';
  }
}

// 更新所有结果显示
function updateResults(sentence) {
  document.getElementById('wordCount').textContent = getWordCount(sentence);
  document.getElementById('vowelCount').textContent = getVowelCount(sentence);
  document.getElementById('consonantCount').textContent = getConsonantCount(sentence);
  document.getElementById('punctuationCount').textContent = getPunctuationCount(sentence);
  document.getElementById('characterCount').textContent = getCharacterCount(sentence);
  document.getElementById('uppercaseCount').textContent = getUppercaseCount(sentence);
  document.getElementById('lowercaseCount').textContent = getLowercaseCount(sentence);
  document.getElementById('digitCount').textContent = getDigitCount(sentence);
  document.getElementById('spaceCount').textContent = getSpaceCount(sentence);
  document.getElementById('longestWord').textContent = getLongestWord(sentence);
  document.getElementById('sentenceType').textContent = getSentenceType(sentence);
  // 添加最长单词长度的显示
  document.getElementById('longestWordLength').textContent = findLongestWordLength(sentence);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const sentenceInput = document.getElementById('sentenceInput');
  
  // 初始化显示默认句子的结果
  updateResults(sentenceInput.value);
  
  // 添加按钮点击事件
  analyzeBtn.addEventListener('click', function() {
    updateResults(sentenceInput.value);
  });
  
  // 添加回车键触发分析功能（Ctrl+Enter）
  sentenceInput.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      updateResults(sentenceInput.value);
    }
  });
});

