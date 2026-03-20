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
          { text: '技能概览', link: '/skills/' },
          { text: '🔥 ClawHub Top 50', link: '/skills/clawhub-top50/' },
          { text: '📄 Feishu 文档', link: '/skills/feishu-doc/' },
          { text: '💻 GitHub', link: '/skills/github/' },
          { text: '🌤️ 天气', link: '/skills/weather/' },
          { text: '🌐 浏览器自动化', link: '/skills/browser/' },
          { text: '— ClawHub 热门 —', link: '/skills/clawhub-top50/' },
          { text: '🥇 self-improving-agent', link: '/skills/clawhub/self-improving-agent/' },
          { text: '🥈 ontology', link: '/skills/clawhub/ontology/' },
          { text: '🥉 self-improving', link: '/skills/clawhub/self-improving/' },
          { text: 'Obsidian', link: '/skills/clawhub/obsidian/' },
          { text: 'Nano Banana Pro', link: '/skills/clawhub/nano-banana-pro/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/openclaw/openclaw' }
    ]
  }
})
