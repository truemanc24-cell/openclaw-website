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
          <h4>💬 智能客服</h4>
          <p class="cs-status">🟢 在线 - 基于网站内容智能回答</p>
        </div>
        <button class="cs-close" @click="closeCustomerService">×</button>
      </div>
      
      <!-- 聊天消息区域 -->
      <div class="cs-messages" ref="messagesContainer">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="cs-welcome-message">
          <p>👋 你好！我是 OpenClaw 智能客服</p>
          <p>我可以帮你查找网站内的文档、教程和常见问题解答</p>
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
              <p class="cs-results-title">📚 相关内容：</p>
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
        <div v-if="isSearching" class="cs-message bot">
          <div class="cs-message-avatar">🤖</div>
          <div class="cs-message-content">
            <div class="cs-typing">
              <span></span><span></span><span></span>
            </div>
            <p class="cs-searching-text">正在检索网站内容...</p>
          </div>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="cs-input-area">
        <!-- 快捷问题 -->
        <div v-if="!showInput" class="cs-quick-questions">
          <button @click="selectQuickQuestion('如何安装 OpenClaw？')" class="cs-quick-btn">
            ⚡ 如何安装？
          </button>
          <button @click="selectQuickQuestion('怎么配置多 Agent？')" class="cs-quick-btn">
            🤖 多 Agent 配置
          </button>
          <button @click="selectQuickQuestion('如何连接飞书？')" class="cs-quick-btn">
            💬 连接飞书
          </button>
          <button @click="startNewChat" class="cs-quick-btn cs-new-chat">
            ➕ 自定义问题
          </button>
        </div>
        
        <!-- 输入框 -->
        <div v-else class="cs-input-wrapper">
          <input 
            v-model="userInput"
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="输入你的问题..."
            class="cs-input"
            ref="inputField"
          />
          <button @click="sendMessage" :disabled="!userInput.trim() || isSearching" class="cs-send-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
          <button @click="cancelInput" class="cs-cancel-btn">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const showInput = ref(false)
const userInput = ref('')
const isSearching = ref(false)
const messages = ref([])
const unreadCount = ref(0)
const messagesContainer = ref(null)
const inputField = ref(null)

// 网站内容知识库（简化版，实际应该调用搜索 API）
const knowledgeBase = [
  {
    keywords: ['安装', 'install', '怎么装', '如何安装'],
    answer: '安装 OpenClaw 非常简单，只需 3 步：\n\n1. 安装 Node.js (v18+)\n2. 运行：npm install -g openclaw\n3. 运行向导：openclaw onboard\n\n完成后就可以开始配置了！',
    results: [
      { title: '快速开始', link: '/tutorials/01-quick-start.html' },
      { title: '安装指南', link: '/tutorials/02-installation.html' },
      { title: '配置指南', link: '/tutorials/03-configuration.html' }
    ]
  },
  {
    keywords: ['多 agent', '多 Agent', 'agent 配置', '协作'],
    answer: '配置多 Agent 协作可以让不同的 Agent 负责不同任务：\n\n1. 在 openclaw.json 中配置 agents.list\n2. 为每个 Agent 分配独立 workspace\n3. 配置不同的技能和模型\n4. 使用 sessions_send 实现 Agent 间通信\n\n建议：工作/生活/学习场景分离',
    results: [
      { title: '多 Agent 配置', link: '/guide/introduction.html' },
      { title: '技能市场', link: '/skills/' }
    ]
  },
  {
    keywords: ['飞书', 'feishu', '连接飞书', '飞书机器人'],
    answer: '连接飞书需要以下步骤：\n\n1. 在飞书开放平台创建应用\n2. 获取 App ID 和 App Secret\n3. 在 openclaw.json 中配置飞书渠道\n4. 发布应用到飞书\n\n配置完成后可通过飞书与 Agent 对话',
    results: [
      { title: '飞书配置', link: '/guide/configuration.html' },
      { title: '快速开始', link: '/tutorials/01-quick-start.html' }
    ]
  },
  {
    keywords: ['技能', 'skill', '安装技能', 'clawhub'],
    answer: '从 ClawHub 安装技能：\n\n1. 访问 https://clawhub.com\n2. 浏览或搜索需要的技能\n3. 点击安装按钮\n4. 技能会自动下载到 ~/.openclaw/skills/\n\n也可以在技能市场查看已安装的技能',
    results: [
      { title: '技能市场', link: '/skills/' },
      { title: 'Feishu 文档', link: '/skills/feishu-doc/' }
    ]
  },
  {
    keywords: ['配置', 'config', '设置', 'openclaw.json'],
    answer: 'OpenClaw 配置文件位于 ~/.openclaw/openclaw.json\n\n主要配置项：\n- models: 模型提供商和 API 密钥\n- channels: 聊天渠道配置\n- agents: Agent 列表和配置\n- tools: 工具权限配置\n\n修改后需重启 gateway',
    results: [
      { title: '配置指南', link: '/tutorials/03-configuration.html' },
      { title: 'Gateway 配置', link: '/guide/configuration.html' }
    ]
  },
  {
    keywords: ['错误', '报错', '失败', 'problem', 'issue'],
    answer: '遇到问题可以：\n\n1. 查看常见问题解答\n2. 检查配置文件是否正确\n3. 查看日志：openclaw gateway logs\n4. 提交 GitHub Issue\n5. 加入 Discord 社区求助',
    results: [
      { title: '关于页面', link: '/about.html' },
      { title: 'GitHub Issues', link: 'https://github.com/openclaw/openclaw/issues' }
    ]
  }
]

const toggleCustomerService = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
  }
}

const openCustomerService = () => {
  isOpen.value = true
  unreadCount.value = 0
}

const closeCustomerService = () => {
  isOpen.value = false
}

const startNewChat = () => {
  showInput.value = true
  nextTick(() => {
    inputField.value?.focus()
  })
}

const selectQuickQuestion = (question) => {
  userInput.value = question
  sendMessage()
}

const cancelInput = () => {
  showInput.value = false
  userInput.value = ''
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isSearching.value) return
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    text: text
  })
  
  userInput.value = ''
  showInput.value = false
  isSearching.value = true
  
  scrollToBottom()
  
  // 模拟搜索延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 搜索匹配的答案
  const matched = searchKnowledgeBase(text)
  
  isSearching.value = false
  
  // 添加机器人回复
  messages.value.push(matched)
  
  scrollToBottom()
}

const searchKnowledgeBase = (query) => {
  // 简单关键词匹配（实际应该用全文搜索）
  const queryLower = query.toLowerCase()
  
  for (const kb of knowledgeBase) {
    if (kb.keywords.some(k => queryLower.includes(k.toLowerCase()))) {
      return {
        type: 'bot',
        text: kb.answer,
        results: kb.results
      }
    }
  }
  
  // 未找到匹配
  return {
    type: 'bot',
    text: '抱歉，我暂时没有找到相关的内容。你可以：\n\n1. 换个问法试试\n2. 查看完整文档\n3. 提交 GitHub Issue\n4. 加入 Discord 社区求助',
    results: [
      { title: '完整文档', link: '/guide/introduction.html' },
      { title: '常见问题', link: '/about.html' },
      { title: 'GitHub Issues', link: 'https://github.com/openclaw/openclaw/issues' }
    ]
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (!event.target.closest('.cs-button-container')) {
    isOpen.value = false
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
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
  width: 380px;
  height: 550px;
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

.cs-hint {
  font-size: 13px;
  color: #999;
  font-style: italic;
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
  max-width: 280px;
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
  border-top: 1px solid #e9ecef;
}

.cs-results-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.cs-result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-size: 13px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.cs-result-item:hover {
  background: #e9ecef;
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

.cs-searching-text {
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

.cs-new-chat {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.cs-new-chat:hover {
  opacity: 0.9;
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

.cs-cancel-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.cs-cancel-btn:hover {
  background: #e9ecef;
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
