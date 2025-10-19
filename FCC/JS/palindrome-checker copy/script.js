const textInput = document.getElementById('text-input');
const checkBtn = document.getElementById('check-btn');
const result = document.getElementById('result');

// Function to check if a string is a palindrome
const isPalindrome = (str) => {
  // Remove all non-alphanumeric characters and convert to lowercase
  const cleanStr = str.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
  
  // Compare the string with its reverse
  const reversedStr = cleanStr.split('').reverse().join('');
  
  return cleanStr === reversedStr;
};

// Function to display the result
const displayResult = (text, isPalin) => {
  // Remove any existing classes
  result.classList.remove('palindrome', 'not-palindrome');
  
  // Add the appropriate class based on the result
  if (isPalin) {
    result.textContent = `"${text}" 是回文！`;
    result.classList.add('palindrome');
  } else {
    result.textContent = `"${text}" 不是回文。`;
    result.classList.add('not-palindrome');
  }
  
  // Show the result with animation
  result.classList.add('show');
};

// Event listener for the check button
checkBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  
  // Check if input is empty
  if (text === '') {
    alert('请输入要检查的文本。');
    return;
  }
  
  // Check if the text is a palindrome
  const palinCheck = isPalindrome(text);
  
  // Display the result
  displayResult(text, palinCheck);
});

// Event listener for Enter key press
textInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkBtn.click();
  }
});

// Clear result when user starts typing
textInput.addEventListener('input', () => {
  result.classList.remove('show', 'palindrome', 'not-palindrome');
});