import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenClaw 中文网 - 你的个人 AI 助手平台',
  description: '3 分钟快速开始，让你的 AI 助手更智能、更自主。支持多渠道集成、多 Agent 协作、技能市场扩展。开源、自托管、数据可控。',
  
  head: [
    // Google Search Console 验证
    ['meta', { name: 'google-site-verification', content: 'OMzLIVQceg8V8fgvymnxOu0R_rE_13MaPjUdZIWx4ek' }],
    
    // SEO Meta Tags
    ['meta', { name: 'keywords', content: 'OpenClaw,AI 助手，自动化工具，多 Agent 协作，技能市场，自托管 AI,WhatsApp 机器人，Telegram 机器人' }],
    ['meta', { name: 'author', content: 'OpenClaw Team' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['link', { rel: 'canonical', href: 'https://openclaw.com/' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://openclaw.com/' }],
    ['meta', { property: 'og:title', content: 'OpenClaw 中文网 - 你的个人 AI 助手平台' }],
    ['meta', { property: 'og:description', content: '3 分钟快速开始，让你的 AI 助手更智能、更自主。支持多渠道集成、多 Agent 协作、技能市场扩展。' }],
    ['meta', { property: 'og:image', content: 'https://openclaw.com/og-image.png' }],
    
    // Twitter
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:url', content: 'https://openclaw.com/' }],
    ['meta', { property: 'twitter:title', content: 'OpenClaw 中文网 - 你的个人 AI 助手平台' }],
    ['meta', { property: 'twitter:description', content: '3 分钟快速开始，让你的 AI 助手更智能、更自主。' }],
    ['meta', { property: 'twitter:image', content: 'https://openclaw.com/og-image.png' }],
    
    // Schema.org 结构化数据 (JSON-LD)
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "OpenClaw",
      "alternateName": "OpenClaw 中文网",
      "url": "https://openclaw.com",
      "description": "OpenClaw 是一个强大的个人 AI 助手平台，支持多渠道集成、多 Agent 协作、技能市场扩展。",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "macOS, Linux, Windows",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY"
      },
      "author": {
        "@type": "Organization",
        "name": "OpenClaw Team",
        "url": "https://github.com/openclaw/openclaw"
      },
      "keywords": "AI 助手，自动化工具，多 Agent 协作，技能市场，自托管 AI",
      "softwareVersion": "1.0.0",
      "datePublished": "2026-03-12",
      "dateModified": "2026-03-28"
    })],
    
    // Organization 结构化数据
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "OpenClaw",
      "url": "https://openclaw.com",
      "logo": "https://openclaw.com/logo.png",
      "sameAs": [
        "https://github.com/openclaw/openclaw",
        "https://discord.gg/clawd"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "availableLanguage": ["Chinese", "English"]
      }
    })],
    
    // WebSite 结构化数据
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "OpenClaw 中文网",
      "url": "https://openclaw.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://openclaw.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "zh-CN"
    })]
  ],
  
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
