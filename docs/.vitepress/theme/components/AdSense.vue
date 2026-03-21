<template>
  <!-- AdSense 自动广告 -->
</template>

<script setup>
import { onMounted } from 'vue'

const ADSENSE_CLIENT_ID = 'ca-pub-8650398521051691'

onMounted(() => {
  // 创建 AdSense 脚本
  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
  
  // 添加到页面头部
  document.head.appendChild(script)
  
  // 配置广告
  script.onload = () => {
    if (window.adsbygoogle) {
      // 启用自动广告
      window.adsbygoogle.push({})
    }
  }
  
  console.log('✅ AdSense 已加载')
})
</script>

<style scoped>
/* AdSense 样式由 Google 自动管理 */
</style>
