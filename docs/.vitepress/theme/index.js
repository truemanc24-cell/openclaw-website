import DefaultTheme from 'vitepress/theme'
import CustomerServiceButton from './components/CustomerServiceButton.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册客服按钮组件
    app.component('CustomerServiceButton', CustomerServiceButton)
  }
}
