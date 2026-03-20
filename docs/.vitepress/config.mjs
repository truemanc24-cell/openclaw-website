import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenClaw',
  description: 'OpenClaw - 强大的 AI 助手平台',
  
  ignoreDeadLinks: true,
  
  // 使用自定义主题
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/introduction' },
      { text: 'AI 新闻', link: '/news/' },
      { text: '技能', link: '/skills/' },
      { text: '关于', link: '/about' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '配置', link: '/guide/configuration' }
        ]
      },
      {
        text: '技能市场',
        items: [
          { text: '📋 技能列表', link: '/skills/' },
          { text: '📄 Feishu 文档', link: '/skills/feishu-doc/' },
          { text: '💻 GitHub', link: '/skills/github/' },
          { text: '🔍 Tavily 搜索', link: '/skills/tavily-search/' },
          { text: '🌤️ 天气', link: '/skills/weather/' },
          { text: '🌐 浏览器自动化', link: '/skills/browser/' },
          { text: '📄 PDF 编辑', link: '/skills/nano-pdf/' },
          { text: '🧠 自我改进', link: '/skills/self-improving-agent/' },
          { text: '💡 技能推荐', link: '/skills/skill-vetter/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/openclaw/openclaw' }
    ]
  }
})
