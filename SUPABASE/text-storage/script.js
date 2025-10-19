// 初始化 Supabase 客户端
const SUPABASE_URL = 'https://oghruvwipiivlzftzcyr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naHJ1dndpcGlpdmx6ZnR6Y3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODU3NTksImV4cCI6MjA3NjI2MTc1OX0.2yt6R9g23mTSTsamxK1xVnXZP9q9zpjV1ZRser4cejc';

let supabase;

// 获取 DOM 元素
const allMessagesElement = document.getElementById('allMessages');
const messageInput = document.getElementById('messageInput');
const saveButton = document.getElementById('saveButton');
const statusElement = document.getElementById('status');

// 初始化 Supabase 客户端
function initSupabase() {
    try {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase 客户端初始化成功');
            return true;
        } else {
            throw new Error('Supabase SDK 未正确加载');
        }
    } catch (error) {
        console.error('Supabase 客户端初始化失败:', error);
        allMessagesElement.innerHTML = `
            <div class="error">
                <strong>错误:</strong> Supabase 客户端初始化失败<br>
                请检查网络连接或稍后重试
            </div>
        `;
        return false;
    }
}

// 页面加载完成后初始化并获取所有消息
document.addEventListener('DOMContentLoaded', async () => {
    if (initSupabase()) {
        await fetchAllMessages();
    }
});

// 获取所有消息
async function fetchAllMessages() {
    if (!supabase) {
        allMessagesElement.innerHTML = '<div class="error">Supabase 客户端未初始化</div>';
        return;
    }

    try {
        allMessagesElement.innerHTML = '<div class="loading">正在加载...</div>';
        
        const { data, error } = await supabase
            .from('messages')
            .select('content, created_at')
            .order('created_at', { ascending: false });

        if (error && error.code !== 'PGRST116') { // PGRST116 表示没有找到记录
            throw error;
        }

        if (data && data.length > 0) {
            // 创建消息列表
            let messagesHTML = '<div class="messages-list">';
            data.forEach((message, index) => {
                const date = new Date(message.created_at).toLocaleString('zh-CN');
                messagesHTML += `
                    <div class="message-item">
                        <div class="message-content">${message.content}</div>
                        <div class="message-date">${date}</div>
                    </div>
                    ${index < data.length - 1 ? '<hr class="message-separator">' : ''}
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
    if (!supabase) {
        showStatus('Supabase 客户端未初始化', 'error');
        return;
    }

    const content = messageInput.value.trim();
    
    // 检查输入是否为空
    if (!content) {
        showStatus('请输入要保存的内容', 'error');
        return;
    }
    
    // 禁用按钮并显示保存状态
    saveButton.disabled = true;
    saveButton.textContent = '保存中...';
    
    try {
        const { error } = await supabase
            .from('messages')
            .insert([{ 
                content,
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

// 显示状态信息
function showStatus(message, type) {
    statusElement.textContent = message;
    statusElement.className = type || '';
    
    // 3秒后清除状态信息
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = '';
    }, 3000);
}

// 绑定保存按钮点击事件
saveButton.addEventListener('click', saveMessage);

// 支持按 Ctrl+Enter 快捷保存
messageInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        saveMessage();
    }
});