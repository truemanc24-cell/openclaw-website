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
        text: '📖 完整教程',
        items: [
          { text: '📋 教程索引', link: '/tutorials/' },
          { text: '⚡ 快速开始', link: '/start/getting-started' },
          { text: '🤖 什么是 OpenClaw', link: '/tutorials/00-introduction' },
          { text: '📥 安装指南', link: '/tutorials/02-installation' },
          { text: '⚙️ 配置指南', link: '/tutorials/03-configuration' },
          { text: '💬 WhatsApp', link: '/tutorials/04-whatsapp' },
          { text: '📱 Telegram', link: '/tutorials/05-telegram' }
        ]
      },
      {
        text: '🛠️ 技能市场',
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
      },
      {
        text: '📚 核心概念',
        items: [
          { text: '架构', link: '/concepts/architecture' },
          { text: 'Agent', link: '/concepts/agent' },
          { text: '会话', link: '/concepts/session' },
          { text: '记忆', link: '/concepts/memory' },
          { text: '模型', link: '/concepts/models' },
          { text: '消息', link: '/concepts/messages' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/openclaw/openclaw' }
    ],

    footer: {
      message: 'Released under MIT License',
      copyright: 'Copyright © 2026 OpenClaw',
      items: [
        {
          text: '隐私政策',
          link: '/privacy'
        }
      ]
    }
  }
})
