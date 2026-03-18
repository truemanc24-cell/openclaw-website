import DefaultTheme from 'vitepress/theme'
import CustomerServiceButton from './components/CustomerServiceButton.vue'
import AdUnit from './components/AdUnit.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import TechLayout from './components/TechLayout.vue'
import './styles/vars.css'
import './styles/base.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册客服按钮组件
    app.component('CustomerServiceButton', CustomerServiceButton)
    // 全局注册广告组件
    app.component('AdUnit', AdUnit)
    // 全局注册粒子背景组件
    app.component('ParticleBackground', ParticleBackground)
    // 全局注册科技布局组件
    app.component('TechLayout', TechLayout)
  },
  setup() {
    // 可以在这里添加全局逻辑
  }
}
