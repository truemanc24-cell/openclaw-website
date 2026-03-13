import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "OpenClaw 中文技术网",
  description: "让你的 AI Agent 团队真正工作起来",
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/quickstart' },
      { text: '技能', link: '/guide/skills' }
    ],
    
    sidebar: [
      {
        text: '快速开始',
        items: [
          { text: '5 分钟上手', link: '/guide/quickstart' },
          { text: '安装指南', link: '/guide/installation' }
        ]
      },
      {
        text: '核心概念',
        items: [
          { text: 'Agent 配置', link: '/guide/agents' },
          { text: '技能开发', link: '/guide/skills' },
          { text: '记忆系统', link: '/guide/memory' },
          { text: 'Hook 系统', link: '/guide/hooks' }
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/openclaw/openclaw' }
    ]
  }
})
