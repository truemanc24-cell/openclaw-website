<template>
  <div class="ad-container">
    <!-- 顶部横幅广告 -->
    <div class="ad-banner-top">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="1234567890"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>

    <!-- 侧边栏广告 -->
    <div class="ad-sidebar">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="2345678901"
           data-ad-format="auto"
           data-full-width-responsive="false"></ins>
    </div>

    <!-- 内容插页广告 -->
    <div class="ad-in-content">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="3456789012"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>

    <!-- 底部广告 -->
    <div class="ad-footer">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-8650398521051691"
           data-ad-slot="4567890123"
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
        console.log('✅ AdSense 广告已推送')
      } catch (e) {
        console.warn('AdSense 推送失败:', e)
      }
    } else {
      console.warn('⚠️ AdSense 脚本未加载')
    }
  }, 2000)
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
.adsbygoogle[data-ad-status="unfilled"] {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  position: relative;
  min-height: 90px;
}

.adsbygoogle[data-ad-status="unfilled"]::before {
  content: '广告位（审核通过后显示广告）';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  text-align: center;
}

.adsbygoogle[data-ad-status="filled"] {
  background: transparent;
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
