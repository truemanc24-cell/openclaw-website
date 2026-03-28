<template>
  <div class="cs-button-container">
    <button class="cs-button" @click="toggleCustomerService" title="联系客服">
      <svg class="cs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span v-if="unreadCount > 0" class="cs-badge">{{ unreadCount }}</span>
    </button>
    
    <div v-if="isOpen" class="cs-chat-window" @click.stop>
      <!-- 聊天窗口头部 -->
      <div class="cs-chat-header">
        <div class="cs-header-info">
          <h4>🤖 AI 智能客服</h4>
          <p class="cs-status">🟢 在线 - 基于 OpenClaw Agent</p>
        </div>
        <div class="cs-header-actions">
          <button @click="clearChat" class="cs-clear-btn" title="清除对话">🗑️</button>
          <button class="cs-close" @click="closeCustomerService">×</button>
        </div>
      </div>
      
      <!-- 聊天消息区域 -->
      <div class="cs-messages" ref="messagesContainer">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="cs-welcome-message">
          <p>👋 你好！我是 OpenClaw AI 客服</p>
          <p>基于真实 Agent 对话，可以帮你：</p>
          <ul class="cs-capabilities">
            <li>✅ 查找网站文档和教程</li>
            <li>✅ 解答配置和使用问题</li>
            <li>✅ 支持多轮对话</li>
          </ul>
          <p class="cs-hint">💡 试试问我："如何安装 OpenClaw？" 或 "怎么配置多 Agent？"</p>
        </div>
        
        <!-- 消息列表 -->
        <div v-for="(msg, index) in messages" :key="index" 
             :class="['cs-message', msg.type]">
          <div class="cs-message-avatar">
            {{ msg.type === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="cs-message-content">
            <p>{{ msg.text }}</p>
            <!-- 搜索结果 -->
            <div v-if="msg.results && msg.results.length > 0" class="cs-search-results">
              <p class="cs-results-title">📚 相关文档：</p>
              <a v-for="(result, i) in msg.results" 
                 :key="i"
                 :href="result.link"
                 target="_blank"
                 class="cs-result-item">
                <span class="cs-result-icon">📄</span>
                <span class="cs-result-title">{{ result.title }}</span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="cs-message bot">
          <div class="cs-message-avatar">🤖</div>
          <div class="cs-message-content">
            <div class="cs-typing">
              <span></span><span></span><span></span>
            </div>
            <p class="cs-loading-text">正在思考中...</p>
          </div>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="cs-input-area">
        <!-- 快捷问题 -->
        <div v-if="messages.length === 0" class="cs-quick-questions">
          <p class="cs-quick-title">💡 常见问题：</p>
          <button @click="selectQuickQuestion('如何安装 OpenClaw？')" class="cs-quick-btn">
            ⚡ 如何安装？
          </button>
          <button @click="selectQuickQuestion('怎么配置多 Agent？')" class="cs-quick-btn">
            🤖 多 Agent 配置
          </button>
          <button @click="selectQuickQuestion('如何连接飞书？')" class="cs-quick-btn">
            💬 连接飞书
          </button>
          <button @click="selectQuickQuestion('ClawHub 是什么？')" class="cs-quick-btn">
            📦 ClawHub
          </button>
        </div>
        
        <!-- 输入框 -->
        <div class="cs-input-wrapper">
          <input 
            v-model="userInput"
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="输入你的问题..."
            class="cs-input"
            ref="inputField"
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="!userInput.trim() || isLoading" class="cs-send-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const messages = ref([])
const unreadCount = ref(0)
const messagesContainer = ref(null)
const inputField = ref(null)
const sessionId = ref(null)

// API 地址
const API_BASE = 'http://localhost:3456'

/**
 * 加载会话历史
 */
const loadSessionHistory = async () => {
  if (!sessionId.value) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/session?id=${sessionId.value}&limit=10`);
    if (response.ok) {
      const data = await response.json();
      if (data.history && data.history.length > 0) {
        messages.value = data.history.map(msg => ({
          type: msg.role === 'user' ? 'user' : 'bot',
          text: msg.content,
          results: msg.results || []
        }));
      }
    }
  } catch (error) {
    console.error('加载会话历史失败:', error);
  }
};

/**
 * 切换客服窗口
 */
const toggleCustomerService = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    // 如果有会话 ID，加载历史
    if (sessionId.value) {
      loadSessionHistory();
    }
  }
};

/**
 * 打开客服
 */
const openCustomerService = () => {
  isOpen.value = true;
  unreadCount.value = 0;
};

/**
 * 关闭客服
 */
const closeCustomerService = () => {
  isOpen.value = false;
};

/**
 * 清除对话
 */
const clearChat = async () => {
  if (sessionId.value) {
    try {
      await fetch(`${API_BASE}/api/session?id=${sessionId.value}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('清除会话失败:', error);
    }
  }
  
  messages.value = [];
  sessionId.value = null;
};

/**
 * 选择快捷问题
 */
const selectQuickQuestion = (question) => {
  userInput.value = question;
  sendMessage();
};

/**
 * 发送消息
 */
const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text || isLoading.value) return;
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    text: text
  });
  
  userInput.value = '';
  isLoading.value = true;
  
  scrollToBottom();
  
  try {
    // 调用客服 API
    const response = await fetch(`${API_BASE}/api/customer-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: text,
        sessionId: sessionId.value
      })
    });
    
    if (!response.ok) {
      throw new Error('API 请求失败');
    }
    
    const data = await response.json();
    
    // 保存会话 ID
    if (data.sessionId) {
      sessionId.value = data.sessionId;
    }
    
    // 添加机器人回复
    messages.value.push({
      type: 'bot',
      text: data.answer || '抱歉，回答生成失败',
      results: data.results || []
    });
    
  } catch (error) {
    console.error('客服 API 调用失败:', error);
    
    // 错误消息
    messages.value.push({
      type: 'bot',
      text: '抱歉，服务暂时不可用，请稍后再试。\n\n如果问题紧急，请查看完整文档或提交 GitHub Issue。',
      results: [
        { title: '完整文档', link: '/guide/introduction.html' },
        { title: 'GitHub Issues', link: 'https://github.com/openclaw/openclaw/issues' }
      ]
    });
  }
  
  isLoading.value = false;
  scrollToBottom();
};

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

/**
 * 点击外部关闭
 */
const handleClickOutside = (event) => {
  if (!event.target.closest('.cs-button-container')) {
    isOpen.value = false;
  }
};

// 生命周期
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }
});
</script>

<style scoped>
.cs-button-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.cs-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cs-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.cs-icon {
  width: 24px;
  height: 24px;
}

.cs-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
}

/* 聊天窗口 */
.cs-chat-window {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头部 */
.cs-chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cs-header-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.cs-status {
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.cs-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cs-clear-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.cs-clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.cs-close {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 消息区域 */
.cs-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
}

.cs-welcome-message {
  text-align: center;
  padding: 30px 20px;
  color: #666;
}

.cs-welcome-message p {
  margin: 8px 0;
  font-size: 14px;
}

.cs-capabilities {
  text-align: left;
  margin: 16px auto;
  max-width: 280px;
  padding: 0;
  list-style: none;
}

.cs-capabilities li {
  margin: 8px 0;
  font-size: 13px;
}

.cs-hint {
  font-size: 13px;
  color: #999;
  font-style: italic;
  margin-top: 16px;
}

.cs-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.cs-message.user {
  flex-direction: row-reverse;
}

.cs-message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.cs-message-content {
  max-width: 300px;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cs-message.user .cs-message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cs-message-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}

/* 搜索结果 */
.cs-search-results {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.cs-results-title {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.cs-result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  font-size: 13px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.cs-result-item:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.cs-result-icon {
  font-size: 14px;
}

/* 加载动画 */
.cs-typing {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.cs-typing span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.cs-typing span:nth-child(1) { animation-delay: -0.32s; }
.cs-typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.cs-loading-text {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* 输入区域 */
.cs-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e9ecef;
}

/* 快捷问题 */
.cs-quick-questions {
  margin-bottom: 12px;
}

.cs-quick-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  text-align: left;
}

.cs-quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cs-quick-btn {
  padding: 8px 14px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cs-quick-btn:hover {
  background: #e9ecef;
  border-color: #667eea;
}

/* 输入框 */
.cs-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cs-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.cs-input:focus {
  border-color: #667eea;
}

.cs-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.cs-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.cs-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.cs-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cs-send-btn svg {
  width: 18px;
  height: 18px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cs-button-container {
    bottom: 16px;
    right: 16px;
  }
  
  .cs-button {
    width: 48px;
    height: 48px;
  }
  
  .cs-chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 200px);
    min-height: 400px;
    bottom: 64px;
    right: -10px;
  }
}
</style>
