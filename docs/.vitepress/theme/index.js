import DefaultTheme from 'vitepress/theme'
import CustomerServiceButton from './components/CustomerServiceButton.vue'
import AdUnit from './components/AdUnit.vue'
import AdSense from './components/AdSense.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import TechLayout from './components/TechLayout.vue'
import './styles/vars.css'
import './styles/base.css'

// Google Analytics 4 配置
const GA4_MEASUREMENT_ID = 'G-SDJFLSFFWD' // ✅ Trueworld Labs 真实世界实验室

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册客服按钮组件
    app.component('CustomerServiceButton', CustomerServiceButton)
    // 全局注册广告组件
    app.component('AdUnit', AdUnit)
    // 全局注册 AdSense 组件
    app.component('AdSense', AdSense)
    // 全局注册粒子背景组件
    app.component('ParticleBackground', ParticleBackground)
    // 全局注册科技布局组件
    app.component('TechLayout', TechLayout)
  },
  setup() {
    // Google Analytics 4 初始化
    if (typeof window !== 'undefined' && GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      // 加载 GA4 脚本
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`
      document.head.appendChild(script)

      // 初始化 gtag
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', GA4_MEASUREMENT_ID, {
        page_path: window.location.pathname
      })

      console.log('[GA4] Initialized with ID:', GA4_MEASUREMENT_ID)
    } else {
      console.warn('[GA4] Measurement ID not configured. Please update GA4_MEASUREMENT_ID in index.js')
    }
  }
}
