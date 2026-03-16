<template>
  <div class="ad-container">
    <!-- 顶部横幅广告 -->
    <div class="ad-banner-top">
      <div class="ad-placeholder">
        <span class="ad-label">广告</span>
        <p>728×90 横幅广告位</p>
        <p class="ad-contact">广告合作：ad@openclaw.ai</p>
      </div>
    </div>

    <!-- 侧边栏广告 -->
    <div class="ad-sidebar">
      <div class="ad-placeholder-square">
        <span class="ad-label">广告</span>
        <p>300×250 方形广告</p>
      </div>
    </div>

    <!-- 内容插页广告 -->
    <div class="ad-in-content">
      <div class="ad-placeholder">
        <span class="ad-label">广告</span>
        <p>970×90 插页广告</p>
      </div>
    </div>

    <!-- 底部广告 -->
    <div class="ad-footer">
      <div class="ad-placeholder">
        <span class="ad-label">广告</span>
        <p>728×90 底部广告</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 广告组件
// 后续可接入 Google AdSense 或其他广告平台
</script>

<style scoped>
.ad-container {
  margin: 20px 0;
}

.ad-banner-top {
  max-width: 728px;
  margin: 20px auto;
  text-align: center;
}

.ad-sidebar {
  position: fixed;
  right: 20px;
  top: 100px;
  width: 300px;
  z-index: 100;
}

.ad-in-content {
  max-width: 970px;
  margin: 40px auto;
  text-align: center;
}

.ad-footer {
  max-width: 728px;
  margin: 40px auto;
  text-align: center;
}

.ad-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.ad-placeholder:hover {
  transform: scale(1.02);
}

.ad-placeholder-square {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
  width: 300px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.ad-placeholder-square:hover {
  transform: scale(1.02);
}

.ad-label {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
}

.ad-contact {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
}

/* 移动端隐藏侧边栏广告 */
@media (max-width: 1200px) {
  .ad-sidebar {
    display: none;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ad-banner-top,
  .ad-footer,
  .ad-in-content {
    max-width: 100%;
    margin: 10px auto;
  }

  .ad-placeholder {
    min-height: 50px;
    padding: 10px;
  }

  .ad-placeholder p {
    font-size: 12px;
  }
}
</style>
