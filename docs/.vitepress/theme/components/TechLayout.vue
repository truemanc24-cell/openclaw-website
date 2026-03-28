<template>
  <div class="tech-layout">
    <!-- 动态渐变背景 -->
    <div class="gradient-bg"></div>
    
    <!-- 光效层 -->
    <div class="glow-effect"></div>
    
    <!-- 网格背景 -->
    <div class="grid-overlay"></div>
    
    <!-- 粒子容器插槽 -->
    <slot name="particles"></slot>
    
    <!-- 主要内容 -->
    <div class="content-wrapper">
      <slot></slot>
    </div>
    
    <!-- 页脚二维码预留位 -->
    <footer class="tech-footer">
      <div class="footer-content">
        <div class="footer-left">
          <p class="copyright">© 2026 Trueworld Labs. All rights reserved.</p>
        </div>
        <div class="footer-center">
          <!-- 二维码预留位置 -->
          <div class="wechat-qr-placeholder" v-if="showQRPlaceholder">
            <div class="qr-frame">
              <span class="qr-text">微信二维码</span>
              <span class="qr-subtext">扫码关注我们</span>
            </div>
          </div>
          <div class="wechat-qr-image" v-else-if="qrImage">
            <img :src="qrImage" alt="WeChat QR Code" class="qr-code" />
          </div>
        </div>
        <div class="footer-right">
          <div class="social-links">
            <a href="https://github.com/openclaw/openclaw" target="_blank" class="social-link">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-4.442 0-.981.351-1.806.931-2.541-.371-1.096-1.622-5.409.351-5.634 0 0 1.253-.401 4.113 1.533 1.195-.33 2.471-.496 3.741-.501 1.27.005 2.546.171 3.741.501 2.86-1.934 4.113-1.533 4.113-1.533 1.973.225.722 4.538.351 5.634.58.735.931 1.56.931 2.541 0 3.119-2.807 4.136-5.479 4.432.439.377.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 配置项
const showQRPlaceholder = ref(true) // 设置为 false 并传入 qrImage 来显示真实二维码
const qrImage = ref(null) // 传入二维码图片路径

// 暴露方法供外部调用
const setQRCode = (imagePath) => {
  qrImage.value = imagePath
  showQRPlaceholder.value = false
}

defineExpose({
  setQRCode
})
</script>

<style scoped>
.tech-layout {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 动态渐变背景 - 增强版 */
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(135deg, 
      #050508 0%, 
      #0a0a12 15%,
      #0f0f1a 30%,
      #1a1a2e 50%, 
      #0f0f1a 70%,
      #0a0a12 85%,
      #050508 100%
    ),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(0, 217, 255, 0.015) 2px,
      rgba(0, 217, 255, 0.015) 4px
    );
  background-size: 400% 400%, 200% 200%;
  animation: gradientShift 15s ease infinite, patternMove 30s linear infinite;
  z-index: -3;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%, 0% 50%;
  }
  50% {
    background-position: 100% 50%, 100% 50%;
  }
  100% {
    background-position: 0% 50%, 0% 50%;
  }
}

@keyframes patternMove {
  0% {
    background-position: 0% 0%, 0% 0%;
  }
  100% {
    background-position: 0% 0%, 200% 200%;
  }
}

/* 光效层 - 增强版 */
.glow-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    /* 主光源 */
    radial-gradient(ellipse at var(--light-1-x, 20%) var(--light-1-y, 30%), 
      rgba(0, 217, 255, 0.12) 0%, 
      rgba(0, 217, 255, 0.06) 25%,
      transparent 50%),
    /* 辅助光源 */
    radial-gradient(ellipse at var(--light-2-x, 80%) var(--light-2-y, 70%), 
      rgba(123, 44, 191, 0.12) 0%, 
      rgba(123, 44, 191, 0.06) 25%,
      transparent 50%),
    /* 强调光源 */
    radial-gradient(ellipse at var(--light-3-x, 50%) var(--light-3-y, 50%), 
      rgba(0, 255, 136, 0.1) 0%, 
      rgba(0, 255, 136, 0.05) 25%,
      transparent 50%),
    /* 边缘光晕 */
    radial-gradient(ellipse at 10% 90%, rgba(255, 0, 110, 0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 90% 10%, rgba(58, 134, 255, 0.08) 0%, transparent 40%);
  animation: glowPulse 8s ease-in-out infinite;
  z-index: -2;
  pointer-events: none;
  mix-blend-mode: screen;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.6;
    filter: hue-rotate(0deg);
  }
  50% {
    opacity: 1;
    filter: hue-rotate(10deg);
  }
}

/* 增强网格背景 */
.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    /* 主网格 */
    linear-gradient(rgba(0, 217, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 217, 255, 0.04) 1px, transparent 1px),
    /* 细网格 */
    linear-gradient(rgba(0, 255, 136, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.02) 1px, transparent 1px),
    /* 对角线 */
    linear-gradient(45deg, rgba(0, 217, 255, 0.015) 1px, transparent 1px),
    linear-gradient(-45deg, rgba(123, 44, 191, 0.015) 1px, transparent 1px);
  background-size: 
    50px 50px,
    50px 50px,
    25px 25px,
    25px 25px,
    100px 100px,
    100px 100px;
  z-index: -1;
  pointer-events: none;
  animation: gridGlow 6s ease-in-out infinite;
}

@keyframes gridGlow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

/* 添加扫描线效果 */
.grid-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 217, 255, 0.01) 2px,
    rgba(0, 217, 255, 0.01) 4px
  );
  animation: scanline 8s linear infinite;
  pointer-events: none;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50px);
  }
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* 页脚样式 */
.tech-footer {
  position: relative;
  margin-top: 80px;
  padding: 40px 24px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(10, 10, 15, 0.95) 100%
  );
  border-top: 1px solid rgba(0, 217, 255, 0.2);
  backdrop-filter: blur(10px);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 24px;
  }
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

/* 二维码预留位置 */
.wechat-qr-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-frame {
  width: 120px;
  height: 120px;
  border: 2px dashed rgba(0, 217, 255, 0.5);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 217, 255, 0.05);
  transition: all 0.3s ease;
}

.qr-frame:hover {
  border-color: rgba(0, 217, 255, 0.8);
  background: rgba(0, 217, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
}

.qr-text {
  color: rgba(0, 217, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

.qr-subtext {
  color: rgba(0, 217, 255, 0.5);
  font-size: 10px;
}

/* 真实二维码图片 */
.wechat-qr-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
  transition: all 0.3s ease;
}

.qr-code:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
}

/* 社交链接 */
.social-links {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.social-link:hover {
  color: #00d9ff;
  border-color: rgba(0, 217, 255, 0.3);
  background: rgba(0, 217, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.2);
}

.icon {
  width: 20px;
  height: 20px;
}

/* 内容区域增强 */
:deep(.VPHome) {
  position: relative;
}

:deep(.VPHome .hero) {
  background: transparent !important;
}

:deep(.VPHome .hero .main) {
  text-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
}

:deep(.VPHome .hero .name) {
  background: linear-gradient(135deg, #00d9ff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.VPHome .hero .text) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.VPHome .hero .tagline) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.VPNavBar) {
  background: rgba(10, 10, 15, 0.8) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
}

:deep(.VPSidebar) {
  background: rgba(10, 10, 15, 0.95) !important;
  backdrop-filter: blur(20px);
}

:deep(.VPContent) {
  background: transparent !important;
}

:deep(.VPDoc) {
  background: transparent !important;
}

:deep(.VPLocalNav) {
  background: rgba(10, 10, 15, 0.8) !important;
  backdrop-filter: blur(20px);
}

/* 链接和按钮增强 */
:deep(a) {
  color: #00d9ff;
  transition: all 0.3s ease;
}

:deep(a:hover) {
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

:deep(.VPButton) {
  position: relative;
  overflow: hidden;
}

:deep(.VPButton::before) {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(0, 217, 255, 0.2),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

:deep(.VPButton:hover::before) {
  left: 100%;
}
</style>
