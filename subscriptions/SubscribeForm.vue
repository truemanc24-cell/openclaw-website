<template>
  <div class="subscribe-form-container">
    <div class="subscribe-form">
      <h3>📬 订阅 OpenClaw 更新</h3>
      <p>获取最新的 AI 代理开发技巧、自动化教程和产品更新。</p>
      
      <!-- ConvertKit 表单 - 替换 FORM_ACTION_URL 为实际的 ConvertKit 表单 URL -->
      <form 
        action="https://app.kit.com/forms/YOUR_FORM_ID/subscriptions" 
        method="post" 
        target="_blank"
        class="ck-form"
      >
        <div class="form-group">
          <label for="email">邮箱地址</label>
          <input 
            type="email" 
            id="email" 
            name="email_address" 
            placeholder="your@email.com" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="name">姓名（可选）</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="你的名字" 
          />
        </div>
        
        <button type="submit" class="subscribe-btn">
          立即订阅
        </button>
        
        <p class="form-note">
          🔒 我们尊重隐私，绝不发送垃圾邮件。随时可以取消订阅。
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
// ConvertKit 表单配置
// 需要在 ConvertKit 后台创建表单后替换 FORM_ID
const CONFIG = {
  formId: 'YOUR_FORM_ID', // 替换为实际的表单 ID
  formAction: 'https://app.kit.com/forms/YOUR_FORM_ID/subscriptions'
}
</script>

<style scoped>
.subscribe-form-container {
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.subscribe-form h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: white;
}

.subscribe-form > p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: white;
  background: white;
}

.subscribe-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.form-note {
  margin-top: 1rem;
  font-size: 0.85rem;
  opacity: 0.8;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subscribe-form-container {
    padding: 1.5rem;
  }
  
  .subscribe-form h3 {
    font-size: 1.3rem;
  }
}
</style>
