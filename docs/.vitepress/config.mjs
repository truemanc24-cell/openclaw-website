import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenClaw',
  description: 'OpenClaw - 强大的 AI 助手平台',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/introduction' },
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
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/openclaw/openclaw' }
    ]
  }
})
