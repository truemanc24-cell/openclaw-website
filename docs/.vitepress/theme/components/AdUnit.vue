<template>
  <div class="ad-container">
    <!-- 顶部横幅广告 -->
    <div class="ad-banner-top">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="TOP_BANNER_SLOT"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>

    <!-- 侧边栏广告 -->
    <div class="ad-sidebar">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="SIDEBAR_SLOT"
           data-ad-format="auto"
           data-full-width-responsive="false"></ins>
    </div>

    <!-- 内容插页广告 -->
    <div class="ad-in-content">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="IN_CONTENT_SLOT"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>

    <!-- 底部广告 -->
    <div class="ad-footer">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="FOOTER_SLOT"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const ADSENSE_CLIENT_ID = 'ca-pub-8650398521051691'

onMounted(() => {
  // 延迟加载广告，避免影响页面性能
  setTimeout(() => {
    if (typeof window.adsbygoogle !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.warn('AdSense 加载失败:', e)
      }
    }
  }, 1000)
})
</script>

<style scoped>
.ad-container {
  margin: 20px 0;
}

.ad-banner-top {
  max-width: 728px;
  margin: 20px auto;
  text-align: center;
  min-height: 90px;
}

.ad-sidebar {
  position: fixed;
  right: 20px;
  top: 100px;
  width: 300px;
  z-index: 100;
  min-height: 250px;
}

.ad-in-content {
  max-width: 970px;
  margin: 40px auto;
  text-align: center;
  min-height: 90px;
}

.ad-footer {
  max-width: 728px;
  margin: 40px auto;
  text-align: center;
  min-height: 90px;
}

/* 广告加载中占位 */
.adsbygoogle {
  display: block;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  min-height: 90px;
  position: relative;
}

.adsbygoogle::before {
  content: '广告加载中...';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
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
}
</style>
