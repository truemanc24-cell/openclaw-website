import DefaultTheme from 'vitepress/theme'
import CustomerServiceButton from './components/CustomerServiceButton.vue'
import AdUnit from './components/AdUnit.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册客服按钮组件
    app.component('CustomerServiceButton', CustomerServiceButton)
    // 全局注册广告组件
    app.component('AdUnit', AdUnit)
  }
}
