// 原代码存在问题：字符串在 JavaScript 中是不可变的，不能直接通过索引赋值修改。
// 以下是修正后的代码

function maskEmail(email){
  let t = email.indexOf("@");
  let emailArr = email.split('');
  for(let i=1;i<t-1;i++){
    emailArr[i]="*";
  }
  return emailArr.join('');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const emailInput = document.getElementById('emailInput');
    const maskBtn = document.getElementById('maskBtn');
    const resultDiv = document.getElementById('result');
    
    // 为按钮添加点击事件
    maskBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        if (email) {
            const maskedEmail = maskEmail(email);
            resultDiv.textContent = maskedEmail;
        } else {
            resultDiv.textContent = "请输入有效的邮箱地址";
        }
    });
    
    // 显示示例结果
    document.getElementById('example1').textContent = maskEmail("apple.pie@example.com");
    document.getElementById('example2').textContent = maskEmail("freecodecamp@example.com");
    document.getElementById('example3').textContent = maskEmail("info@test.dev");
    document.getElementById('example4').textContent = maskEmail("user@test.dev");
    document.getElementById('example5').textContent = maskEmail("2220995109@qq.com");
});

// 保留原有的控制台输出
let email="2220995109@qq.com";
console.log(maskEmail("apple.pie@example.com"));
console.log(maskEmail("freecodecamp@example.com"));
console.log(maskEmail("info@test.dev"));
console.log(maskEmail("user@test.dev"));
console.log(maskEmail(email));

