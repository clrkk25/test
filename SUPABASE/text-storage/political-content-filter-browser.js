// 浏览器兼容版本的政治敏感内容检测模块
// 使用更完善的词库和Trie树算法

(function() {
  // 定义政治敏感内容词汇库（分类组织，便于维护和扩展）
  const sensitiveCategories = {
    // 政府相关敏感词
    government: [
      '政府腐败', '官员贪污', '政治动荡', '政权更迭', '颠覆国家',
      '分裂国家', '推翻社会主义制度', '反对宪法确立的基本原则'
    ],
    
    // 社会稳定相关敏感词
    socialStability: [
      '社会不稳定', '民众抗议', '群体事件', '非法集会', '破坏稳定',
      '煽动民族仇恨', '民族歧视', '宗教极端主义'
    ],
    
    // 法律相关敏感词
    legalSystem: [
      '法律漏洞', '司法不公', '执法不严', '审判不公', '滥用职权',
      '徇私枉法', '贪赃枉法', '玩忽职守'
    ],
    
    // 历史相关敏感词
    history: [
      '历史虚无主义', '歪曲历史', '否定革命', '美化侵略', '篡改历史'
    ],
    
    // 国家安全相关敏感词
    nationalSecurity: [
      '泄露国家秘密', '危害国家安全', '间谍行为', '恐怖主义', '极端主义',
      '分裂主义', '破坏国家统一', '损害国家利益'
    ],
    
    // 其他可能的政治敏感内容
    other: [
      '反华势力', '境外势力', '颜色革命', '和平演变', '西化分化',
      '政治谣言', '虚假信息', '煽动对立'
    ]
  };

  // 合并所有敏感词到一个数组
  const allSensitiveWords = Object.values(sensitiveCategories).flat();

  // 构建Trie树（前缀树）以提高检测效率
  class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }

  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
    
    insert(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
    
    search(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) {
          return false;
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
    
    // 检查文本中是否包含任何敏感词
    containsAny(text) {
      for (let i = 0; i < text.length; i++) {
        let node = this.root;
        for (let j = i; j < text.length; j++) {
          const char = text[j];
          if (!node.children[char]) {
            break;
          }
          node = node.children[char];
          if (node.isEndOfWord) {
            return true;
          }
        }
      }
      return false;
    }
  }

  // 创建Trie树实例并插入所有敏感词
  const sensitiveTrie = new Trie();
  allSensitiveWords.forEach(word => sensitiveTrie.insert(word));

  // 检测函数 - 使用Trie树提高效率
  function isPoliticalSensitive(content) {
    // 移除空白字符
    const cleanContent = content.trim();
    
    // 如果内容为空，不视为敏感
    if (!cleanContent) {
      return false;
    }
    
    // 使用Trie树检查是否包含任何敏感词
    return sensitiveTrie.containsAny(cleanContent);
  }

  // 将函数暴露给全局对象
  window.politicalContentFilter = {
    isPoliticalSensitive: isPoliticalSensitive,
    sensitiveCategories: sensitiveCategories
  };
})();