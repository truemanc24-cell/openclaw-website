<template>
  <div class="cs-button-container">
    <button class="cs-button" @click="openCustomerService" title="联系客服">
      <svg class="cs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="cs-badge">新</span>
    </button>
    
    <div v-if="isOpen" class="cs-dropdown" @click.stop>
      <div class="cs-dropdown-header">
        <h4>💬 在线客服</h4>
        <button class="cs-close" @click="closeCustomerService">×</button>
      </div>
      <div class="cs-dropdown-content">
        <p class="cs-welcome">你好！有什么可以帮你的吗？</p>
        
        <div class="cs-options">
          <a href="https://openclaw.feishu.cn/wiki/GRhCwyzlDiJcS9kzXy9cq7XhnKg" 
             class="cs-option" 
             target="_blank"
             rel="noopener noreferrer">
            <span class="cs-option-icon">📚</span>
            <span>查看文档</span>
          </a>
          
          <a href="https://github.com/openclaw/openclaw/issues" 
             class="cs-option" 
             target="_blank"
             rel="noopener noreferrer">
            <span class="cs-option-icon">🐛</span>
            <span>提交 Issue</span>
          </a>
          
          <a href="https://discord.gg/clawd" 
             class="cs-option" 
             target="_blank"
             rel="noopener noreferrer">
            <span class="cs-option-icon">💬</span>
            <span>加入 Discord</span>
          </a>
        </div>
        
        <div class="cs-divider"></div>
        
        <p class="cs-tip">💡 提示：紧急情况可通过飞书联系</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const openCustomerService = () => {
  isOpen.value = true
}

const closeCustomerService = () => {
  isOpen.value = false
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
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.cs-dropdown {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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

.cs-dropdown-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cs-dropdown-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.cs-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cs-dropdown-content {
  padding: 16px;
}

.cs-welcome {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #333;
}

.cs-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cs-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}

.cs-option:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.cs-option-icon {
  font-size: 18px;
}

.cs-divider {
  height: 1px;
  background: #e9ecef;
  margin: 16px 0;
}

.cs-tip {
  margin: 0;
  font-size: 12px;
  color: #666;
  text-align: center;
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
  
  .cs-dropdown {
    width: 260px;
    right: -10px;
  }
}
</style>
