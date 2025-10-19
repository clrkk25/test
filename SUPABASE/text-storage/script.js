// 初始化 Supabase 客户端
const SUPABASE_URL = 'https://oghruvwipiivlzftzcyr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naHJ1dndpcGlpdmx6ZnR6Y3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODU3NTksImV4cCI6MjA3NjI2MTc1OX0.2yt6R9g23mTSTsamxK1xVnXZP9q9zpjV1ZRser4cejc';

let supabase;
let currentUser = null;
let currentUserId = null; // 添加当前用户ID变量

// 获取 DOM 元素
const allMessagesElement = document.getElementById('allMessages');
const messageInput = document.getElementById('messageInput');
const saveButton = document.getElementById('saveButton');
const statusElement = document.getElementById('status');
const warningElement = document.getElementById('contentWarning');

// 登录相关元素
const messagesSection = document.getElementById('messagesSection');
const saveMessageSection = document.getElementById('saveMessageSection');
const userInfo = document.getElementById('userInfo');
const authButtons = document.getElementById('authButtons');
const userName = document.getElementById('userName');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const logoutButton = document.getElementById('logoutButton');
const authStatus = document.getElementById('authStatus');
const showLoginButton = document.getElementById('showLoginButton');
const loginSection = document.getElementById('loginSection');
const notLoggedInMessage = document.getElementById('notLoggedInMessage');
const messageInputSection = document.getElementById('messageInputSection');
const cancelLoginButton = document.querySelector('.cancel-login-btn');

// 引入政治敏感内容检测模块
const { isPoliticalSensitive } = typeof module !== 'undefined' && module.exports ? 
  require('./political-content-filter.js') : 
  window.politicalContentFilter || { isPoliticalSensitive: () => false };

// 检查bcrypt库是否已加载
function isBcryptLoaded() {
    return typeof bcrypt !== 'undefined';
}

// 等待bcrypt库加载
function waitForBcrypt() {
    return new Promise((resolve, reject) => {
        if (isBcryptLoaded()) {
            resolve();
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 50; // 最多等待5秒
        const interval = setInterval(() => {
            attempts++;
            if (isBcryptLoaded()) {
                clearInterval(interval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                // 尝试手动加载本地bcrypt文件
                console.log('尝试加载本地bcrypt文件...');
                const script = document.createElement('script');
                script.src = 'bcrypt.min.js';
                script.onload = () => {
                    if (isBcryptLoaded()) {
                        console.log('本地bcrypt文件加载成功');
                        resolve();
                    } else {
                        reject(new Error('bcrypt库加载失败'));
                    }
                };
                script.onerror = () => {
                    reject(new Error('bcrypt库加载失败'));
                };
                document.head.appendChild(script);
            }
        }, 100);
    });
}

// 使用bcrypt进行密码哈希
async function hashPassword(password) {
    try {
        await waitForBcrypt();
        // 生成salt并哈希密码
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error('bcrypt库未加载:', error);
        throw error;
    }
}

// 验证密码
async function verifyPassword(password, hash) {
    try {
        await waitForBcrypt();
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('bcrypt库未加载:', error);
        return false;
    }
}

// 初始化 Supabase 客户端
function initSupabase() {
    try {
        // 检查 Supabase SDK 是否已加载
        if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase 客户端初始化成功');
            return true;
        } else {
            // 如果 SDK 未加载，等待一段时间后重试
            console.warn('Supabase SDK 仍在加载中，稍后重试...');
            setTimeout(() => {
                if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                    console.log('Supabase 客户端初始化成功');
                    checkUser(); // 检查用户登录状态
                } else {
                    console.error('Supabase SDK 加载失败');
                    showAuthStatus('Supabase 客户端加载失败，请检查网络连接或稍后重试', 'error');
                }
            }, 2000);
            return false;
        }
    } catch (error) {
        console.error('Supabase 客户端初始化失败:', error);
        showAuthStatus('Supabase 客户端初始化失败，请检查网络连接或稍后重试', 'error');
        return false;
    }
}

// 检查用户登录状态
async function checkUser() {
    // 从本地存储获取用户信息
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        currentUser = userData.user;
        currentUserId = userData.userId;
        showUserInterface();
    } else {
        showGuestInterface();
    }
    
    // 加载所有消息
    await fetchAllMessages();
}

// 显示游客界面（未登录状态）
function showGuestInterface() {
    userInfo.style.display = 'none';
    authButtons.style.display = 'block';
    notLoggedInMessage.style.display = 'block'; // 显示顶部的未登录提示
    loginSection.style.display = 'none';
    messageInputSection.style.display = 'none';
    messagesSection.style.display = 'block'; // 显示消息显示区域
    saveMessageSection.style.display = 'none'; // 隐藏保存消息区域
    
    // 获取容器元素
    const container = document.querySelector('.container');
    
    // 注意：我们仍然加载消息，因为游客可以查看消息
}

// 显示用户界面（已登录状态）
function showUserInterface() {
    userInfo.style.display = 'block';
    authButtons.style.display = 'none';
    notLoggedInMessage.style.display = 'none'; // 隐藏顶部的未登录提示
    loginSection.style.display = 'none';
    messageInputSection.style.display = 'block';
    messagesSection.style.display = 'block'; // 显示消息显示区域
    saveMessageSection.style.display = 'block'; // 显示保存消息区域
    
    userName.textContent = currentUser.user_metadata?.username || '用户';
    fetchAllMessages();
}

// 显示登录表单
function showLoginForm() {
    notLoggedInMessage.style.display = 'none'; // 隐藏顶部的未登录提示
    authButtons.style.display = 'none';
    loginSection.style.display = 'block';
    messageInputSection.style.display = 'none';
    messagesSection.style.display = 'none'; // 隐藏消息显示区域
    saveMessageSection.style.display = 'none'; // 隐藏保存消息区域
}

// 隐藏登录表单
function hideLoginForm() {
    notLoggedInMessage.style.display = 'block'; // 显示顶部的未登录提示
    authButtons.style.display = 'block';
    loginSection.style.display = 'none';
    messageInputSection.style.display = 'none';
    messagesSection.style.display = 'block'; // 显示消息显示区域
    saveMessageSection.style.display = 'none'; // 继续保持隐藏保存消息区域
}

// 验证用户名格式
function validateUsername(username) {
    // 检查长度
    if (username.length < 3) {
        return { valid: false, message: '用户名长度不能少于3位' };
    }
    
    if (username.length > 20) {
        return { valid: false, message: '用户名长度不能超过20位' };
    }
    
    // 只允许字母和数字
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return { valid: false, message: '用户名只能包含字母和数字' };
    }
    
    return { valid: true, message: '' };
}

// 用户登录
async function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // 验证输入
    if (!username) {
        showAuthStatus('请输入用户名', 'error');
        return;
    }
    
    if (!password) {
        showAuthStatus('请输入密码', 'error');
        return;
    }
    
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
        showAuthStatus(usernameValidation.message, 'error');
        return;
    }
    
    try {
        loginButton.disabled = true;
        loginButton.textContent = '登录中...';
        
        // 直接使用用户名和密码登录
        // 首先尝试查找用户
        const { data: users, error: fetchError } = await supabase
            .from('users')
            .select('id, username, password_hash')
            .eq('username', username)
            .single();
        
        if (fetchError || !users) {
            showAuthStatus('用户名或密码错误', 'error');
            loginButton.disabled = false;
            loginButton.textContent = '登录';
            return;
        }
        
        // 验证密码
        const isPasswordValid = await verifyPassword(password, users.password_hash);
        if (!isPasswordValid) {
            showAuthStatus('用户名或密码错误', 'error');
            loginButton.disabled = false;
            loginButton.textContent = '登录';
            return;
        }
        
        // 如果用户存在且密码正确，设置当前用户
        currentUser = {
            user_metadata: {
                username: users.username
            }
        };
        
        currentUserId = users.id;
        
        // 保存用户信息到本地存储
        localStorage.setItem('currentUser', JSON.stringify({
            user: currentUser,
            userId: currentUserId
        }));
        
        showAuthStatus('登录成功!', 'success');
        showUserInterface();
    } catch (error) {
        console.error('登录失败:', error);
        showAuthStatus('登录失败: ' + (error.message || '未知错误'), 'error');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = '登录';
    }
}

// 用户注册
async function register() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // 验证输入
    if (!username) {
        showAuthStatus('请输入用户名', 'error');
        return;
    }
    
    if (!password) {
        showAuthStatus('请输入密码', 'error');
        return;
    }
    
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
        showAuthStatus(usernameValidation.message, 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthStatus('密码长度不能少于6位', 'error');
        return;
    }
    
    // 检查用户名是否已存在
    try {
        const { data: existingUsers, error: fetchError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();
        
        if (existingUsers && !fetchError) {
            showAuthStatus('用户名已存在，请选择其他用户名', 'error');
            return;
        }
    } catch (err) {
        // 如果查询出错，可能是用户不存在，继续注册流程
        console.log('检查用户名时出错（可能用户不存在）:', err);
    }
    
    try {
        registerButton.disabled = true;
        registerButton.textContent = '注册中...';
        
        // 哈希密码
        const hashedPassword = await hashPassword(password);
        
        // 直接在users表中创建用户
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username: username,
                    password_hash: hashedPassword
                }
            ])
            .select()
            .single();
        
        if (error) throw error;
        
        showAuthStatus('注册成功!请登录。', 'success');
    } catch (error) {
        console.error('注册失败:', error);
        showAuthStatus('注册失败: ' + (error.message || '未知错误'), 'error');
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = '注册';
    }
}

// 用户退出登录
async function logout() {
    try {
        // 清除当前用户状态
        currentUser = null;
        currentUserId = null;
        localStorage.removeItem('currentUser');
        showGuestInterface();
        showAuthStatus('已退出登录', 'success');
    } catch (error) {
        console.error('退出登录失败:', error);
        showAuthStatus('退出登录失败: ' + (error.message || '未知错误'), 'error');
    }
}

// 获取所有消息
async function fetchAllMessages() {
    if (!supabase) {
        allMessagesElement.innerHTML = '<div class="error">Supabase 客户端未初始化</div>';
        return;
    }

    try {
        allMessagesElement.innerHTML = '<div class="loading">正在加载...</div>';
        
        // 查询消息时关联用户信息
        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('id, content, created_at, user_id')
            .order('created_at', { ascending: false });

        if (messagesError && messagesError.code !== 'PGRST116') { // PGRST116 表示没有找到记录
            throw messagesError;
        }

        if (messages && messages.length > 0) {
            // 收集所有非空的user_id
            const userIds = [...new Set(messages
                .filter(msg => msg.user_id)
                .map(msg => msg.user_id))]
                .filter(id => id !== null);
            
            // 批量获取用户信息
            let usersMap = {};
            if (userIds.length > 0) {
                const { data: users, error: usersError } = await supabase
                    .from('users')
                    .select('id, username')
                    .in('id', userIds);
                
                if (!usersError && users) {
                    usersMap = Object.fromEntries(users.map(user => [user.id, user.username]));
                }
            }
            
            // 创建消息列表
            let messagesHTML = '<div class="messages-list">';
            messages.forEach((message, index) => {
                const date = new Date(message.created_at).toLocaleString('zh-CN');
                
                // 获取发送者信息
                let sender = '匿名用户';
                if (message.user_id && usersMap[message.user_id]) {
                    sender = usersMap[message.user_id];
                }
                
                messagesHTML += `
                    <div class="message-item">
                        <div class="message-content">${message.content}</div>
                        <div class="message-meta">
                            <span class="message-sender">${sender}</span>
                            <span class="message-date">${date}</span>
                        </div>
                    </div>
                    ${index < messages.length - 1 ? '<hr class="message-separator">' : ''}
                `;
            });
            messagesHTML += '</div>';
            allMessagesElement.innerHTML = messagesHTML;
        } else {
            allMessagesElement.innerHTML = '<div class="no-messages">暂无消息</div>';
        }
    } catch (error) {
        console.error('获取消息失败:', error);
        allMessagesElement.innerHTML = `
            <div class="error">
                <strong>获取消息失败:</strong><br>
                ${error.message || '未知错误'}
            </div>
        `;
    }
}

// 保存消息
async function saveMessage() {
    // 检查用户是否已登录
    if (!currentUser || !currentUserId) {
        showStatus('请先登录后再保存消息', 'error');
        return;
    }

    const content = messageInput.value.trim();
    
    // 检查输入是否为空
    if (!content) {
        showStatus('请输入要保存的内容', 'error');
        return;
    }
    
    // 检查是否包含政治敏感内容
    if (isPoliticalSensitive(content)) {
        showWarning('检测到可能的政治敏感内容，请修改后再保存。');
        return;
    }
    
    // 清除之前的警告
    clearWarning();
    
    // 禁用按钮并显示保存状态
    saveButton.disabled = true;
    saveButton.textContent = '保存中...';
    
    try {
        // 保存消息时关联当前用户
        const { error } = await supabase
            .from('messages')
            .insert([{ 
                content,
                user_id: currentUserId, // 关联当前用户
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        showStatus('保存成功!', 'success');
        messageInput.value = ''; // 清空输入框
        await fetchAllMessages(); // 重新加载所有消息
    } catch (error) {
        console.error('保存消息失败:', error);
        showStatus('保存失败: ' + (error.message || '未知错误'), 'error');
    } finally {
        // 恢复按钮状态
        saveButton.disabled = false;
        saveButton.textContent = '保存消息';
    }
}

// 显示认证状态信息
function showAuthStatus(message, type) {
    authStatus.textContent = message;
    authStatus.className = type || '';
    
    // 3秒后清除状态信息
    if (message) {
        setTimeout(() => {
            authStatus.textContent = '';
            authStatus.className = '';
        }, 3000);
    }
}

// 显示状态信息
function showStatus(message, type) {
    statusElement.textContent = message;
    statusElement.className = type || '';
    
    // 3秒后清除状态信息
    if (message) {
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = '';
        }, 3000);
    }
}

// 显示警告信息
function showWarning(message) {
    warningElement.textContent = message;
    warningElement.className = 'warning';
}

// 清除警告信息
function clearWarning() {
    warningElement.textContent = '';
    warningElement.className = '';
}

// 页面加载完成后初始化并检查用户状态
document.addEventListener('DOMContentLoaded', async () => {
    if (initSupabase()) {
        // 绑定事件监听器
        loginButton.addEventListener('click', login);
        registerButton.addEventListener('click', register);
        logoutButton.addEventListener('click', logout);
        showLoginButton.addEventListener('click', showLoginForm);
        cancelLoginButton.addEventListener('click', hideLoginForm);
        
        // 支持按回车键登录
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
        
        // 检查用户登录状态并加载消息
        await checkUser();
    }
});

// 绑定保存按钮点击事件
saveButton.addEventListener('click', saveMessage);

// 支持按 Ctrl+Enter 快捷保存
messageInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        saveMessage();
    }
});
