# OpenClaw SEO 实施模板

**用途**: 复制这些模板到网站代码中使用  
**更新日期**: 2026-03-14

---

## 1. 首页 Meta 标签模板

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- 基础 SEO -->
  <title>OpenClaw - Open Source AI Agent Automation Platform</title>
  <meta name="description" content="Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers. CLI-driven workflows, local-first architecture.">
  <meta name="keywords" content="AI agent, automation, open source, self-hosted, workflow automation, multi-agent, CLI, local LLM, developer tools">
  <meta name="author" content="OpenClaw Team">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://openclaw.com/">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://openclaw.com/">
  <meta property="og:title" content="OpenClaw - Open Source AI Agent Automation Platform">
  <meta property="og:description" content="Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers.">
  <meta property="og:image" content="https://openclaw.com/images/og-home.png">
  <meta property="og:image:alt" content="OpenClaw AI Agent Platform">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="OpenClaw">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@openclaw">
  <meta name="twitter:creator" content="@openclaw">
  <meta name="twitter:url" content="https://openclaw.com/">
  <meta name="twitter:title" content="OpenClaw - Open Source AI Agent Automation Platform">
  <meta name="twitter:description" content="Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers.">
  <meta name="twitter:image" content="https://openclaw.com/images/twitter-home.png">
  <meta name="twitter:image:alt" content="OpenClaw AI Agent Platform">
  
  <!-- 结构化数据 (Schema.org) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "OpenClaw",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Cross-platform (macOS, Linux, Windows)",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "OpenClaw is an open-source AI agent automation platform for developers. Build, deploy, and manage AI agents with CLI-driven workflows and local-first architecture.",
    "url": "https://openclaw.com",
    "downloadUrl": "https://github.com/openclaw/openclaw",
    "author": {
      "@type": "Organization",
      "name": "OpenClaw Team"
    },
    "keywords": "AI agent, automation, open source, workflow, self-hosted, CLI, local LLM",
    "softwareVersion": "1.0.0"
  }
  </script>
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  
  <!-- 主题色 -->
  <meta name="theme-color" content="#FF6B35">
  
  <!-- GA4 (部署时取消注释并替换 ID) -->
  <!--
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  -->
</head>
```

---

## 2. 关于页 Meta 标签模板

```html
<head>
  <!-- 基础 SEO -->
  <title>About OpenClaw - Open Source AI Agent Platform Mission</title>
  <meta name="description" content="Learn about OpenClaw's mission: democratizing AI agent automation. Open-source, privacy-first, developer-friendly tools for building autonomous agents.">
  <meta name="keywords" content="about OpenClaw, open source AI, AI agent mission, privacy-first AI, local AI, developer community">
  <link rel="canonical" href="https://openclaw.com/about">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://openclaw.com/about">
  <meta property="og:title" content="About OpenClaw - Our Mission">
  <meta property="og:description" content="Learn about OpenClaw's mission: democratizing AI agent automation with open-source tools.">
  <meta property="og:image" content="https://openclaw.com/images/og-about.png">
  <meta property="og:site_name" content="OpenClaw">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://openclaw.com/about">
  <meta name="twitter:title" content="About OpenClaw - Our Mission">
  <meta name="twitter:description" content="Learn about OpenClaw's mission: democratizing AI agent automation with open-source tools.">
  <meta name="twitter:image" content="https://openclaw.com/images/twitter-about.png">
  
  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About OpenClaw",
    "description": "Learn about OpenClaw's mission to democratize AI agent automation",
    "url": "https://openclaw.com/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "OpenClaw",
      "url": "https://openclaw.com",
      "logo": "https://openclaw.com/images/logo.png",
      "sameAs": [
        "https://github.com/openclaw",
        "https://twitter.com/openclaw",
        "https://discord.gg/openclaw"
      ]
    }
  }
  </script>
</head>
```

---

## 3. 教程列表页 Meta 标签模板

```html
<head>
  <!-- 基础 SEO -->
  <title>OpenClaw Tutorials - Learn AI Agent Automation</title>
  <meta name="description" content="Step-by-step OpenClaw tutorials: build your first AI agent, automate workflows, integrate tools. Beginner to advanced guides for developers.">
  <meta name="keywords" content="OpenClaw tutorial, AI agent tutorial, automation guide, workflow automation, how to build AI agent, developer tutorials">
  <link rel="canonical" href="https://openclaw.com/docs/tutorials">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://openclaw.com/docs/tutorials">
  <meta property="og:title" content="OpenClaw Tutorials - Learn AI Agent Automation">
  <meta property="og:description" content="Step-by-step guides to build AI agents and automate workflows with OpenClaw.">
  <meta property="og:image" content="https://openclaw.com/images/og-tutorials.png">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://openclaw.com/docs/tutorials">
  <meta name="twitter:title" content="OpenClaw Tutorials - Learn AI Agent Automation">
  <meta name="twitter:description" content="Step-by-step guides to build AI agents and automate workflows with OpenClaw.">
  <meta name="twitter:image" content="https://openclaw.com/images/twitter-tutorials.png">
  
  <!-- Schema.org - ItemList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "OpenClaw Tutorials",
    "description": "Step-by-step tutorials for building AI agents with OpenClaw",
    "url": "https://openclaw.com/docs/tutorials",
    "numberOfItems": 20,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Build Your First AI Agent",
        "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Workflow Automation Guide",
        "url": "https://openclaw.com/docs/tutorials/workflow-automation"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Multi-Agent Orchestration",
        "url": "https://openclaw.com/docs/tutorials/multi-agent-orchestration"
      }
    ]
  }
  </script>
</head>
```

---

## 4. 博客文章 Meta 标签模板

```html
<head>
  <!-- 基础 SEO -->
  <title>{文章标题} | OpenClaw Blog</title>
  <meta name="description" content="{文章摘要，150-160 字符}">
  <meta name="keywords" content="{3-5 个相关关键词，逗号分隔}">
  <meta name="author" content="{作者名}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://openclaw.com/blog/{文章 slug}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://openclaw.com/blog/{文章 slug}">
  <meta property="og:title" content="{文章标题} | OpenClaw Blog">
  <meta property="og:description" content="{文章摘要}">
  <meta property="og:image" content="https://openclaw.com/images/blog/{文章 slug}.png">
  <meta property="og:site_name" content="OpenClaw">
  <meta property="article:published_time" content="{发布日期 ISO 8601}">
  <meta property="article:modified_time" content="{修改日期 ISO 8601}">
  <meta property="article:author" content="{作者名}">
  <meta property="article:section" content="{分类}">
  <meta property="article:tag" content="{标签 1}">
  <meta property="article:tag" content="{标签 2}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://openclaw.com/blog/{文章 slug}">
  <meta name="twitter:title" content="{文章标题}">
  <meta name="twitter:description" content="{文章摘要}">
  <meta name="twitter:image" content="https://openclaw.com/images/blog/{文章 slug}.png">
  
  <!-- Schema.org - BlogPosting -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{文章标题}",
    "datePublished": "{发布日期 ISO 8601}",
    "dateModified": "{修改日期 ISO 8601}",
    "author": {
      "@type": "Person",
      "name": "{作者名}",
      "url": "https://openclaw.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OpenClaw",
      "logo": {
        "@type": "ImageObject",
        "url": "https://openclaw.com/images/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "description": "{文章摘要}",
    "image": {
      "@type": "ImageObject",
      "url": "https://openclaw.com/images/blog/{文章 slug}.png",
      "width": 1200,
      "height": 630
    },
    "url": "https://openclaw.com/blog/{文章 slug}",
    "wordCount": "{字数}",
    "timeRequired": "PT{阅读时间}M",
    "keywords": "{关键词 1}, {关键词 2}, {关键词 3}",
    "articleBody": "{文章前 200 字符}"
  }
  </script>
</head>
```

---

## 5. 通用页面 Meta 标签模板（其他页面）

```html
<head>
  <!-- 基础 SEO -->
  <title>{页面标题} | OpenClaw</title>
  <meta name="description" content="{页面描述，150-160 字符}">
  <meta name="keywords" content="{3-5 个关键词}">
  <link rel="canonical" href="https://openclaw.com/{页面路径}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://openclaw.com/{页面路径}">
  <meta property="og:title" content="{页面标题} | OpenClaw">
  <meta property="og:description" content="{页面描述}">
  <meta property="og:image" content="https://openclaw.com/images/og-{页面}.png">
  <meta property="og:site_name" content="OpenClaw">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://openclaw.com/{页面路径}">
  <meta name="twitter:title" content="{页面标题}">
  <meta name="twitter:description" content="{页面描述}">
  <meta name="twitter:image" content="https://openclaw.com/images/twitter-{页面}.png">
</head>
```

---

## 6. 全局 Schema.org 模板（放在首页或页脚）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OpenClaw",
  "url": "https://openclaw.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://openclaw.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "description": "Open-source AI agent automation platform for developers",
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": "OpenClaw Team",
    "logo": {
      "@type": "ImageObject",
      "url": "https://openclaw.com/images/logo.png",
      "width": 600,
      "height": 60
    }
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OpenClaw",
  "url": "https://openclaw.com",
  "logo": "https://openclaw.com/images/logo.png",
  "sameAs": [
    "https://github.com/openclaw",
    "https://twitter.com/openclaw",
    "https://discord.gg/openclaw",
    "https://www.linkedin.com/company/openclaw"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@openclaw.com"
  }
}
</script>
```

---

## 7. FAQ Schema 模板（常见问题页面）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is OpenClaw?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "OpenClaw is an open-source AI agent automation platform for developers. It provides CLI-driven tools to build, deploy, and manage AI agents with local-first architecture."
      }
    },
    {
      "@type": "Question",
      "name": "Is OpenClaw free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, OpenClaw is completely free and open-source under the MIT license. You can self-host it or use our cloud service."
      }
    },
    {
      "@type": "Question",
      "name": "What programming languages does OpenClaw support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "OpenClaw primarily supports JavaScript/TypeScript and Python. You can write agents in either language and integrate with any API."
      }
    }
  ]
}
</script>
```

---

## 8. HowTo Schema 模板（教程页面）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Build Your First AI Agent with OpenClaw",
  "description": "Learn how to build your first AI agent using OpenClaw's CLI tools",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "OpenClaw CLI",
      "url": "https://openclaw.com/docs/installation"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Install OpenClaw",
      "text": "Install OpenClaw CLI using npm: npm install -g @openclaw/cli",
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent#install"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Create Agent",
      "text": "Initialize a new agent project: openclaw init my-agent",
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent#create"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Configure Agent",
      "text": "Edit the agent configuration file to define behaviors and tools",
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent#configure"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Run Agent",
      "text": "Start your agent: openclaw run",
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent#run"
    }
  ]
}
</script>
```

---

## 9. 图片尺寸规范

```
Open Graph 图片:
- 尺寸：1200 x 630 px
- 比例：1.91:1
- 格式：PNG 或 JPG
- 文件大小：< 5MB
- 命名：og-{page}.png

Twitter Card 图片:
- 尺寸：1200 x 600 px
- 比例：2:1
- 格式：PNG 或 JPG
- 文件大小：< 5MB
- 命名：twitter-{page}.png

Favicon:
- 32x32 px (favicon-32x32.png)
- 16x16 px (favicon-16x16.png)
- 180x180 px (apple-touch-icon.png)

博客文章封面:
- 尺寸：1200 x 630 px
- 格式：PNG
- 命名：blog-{slug}.png
```

---

## 10. 部署检查清单

```markdown
## 上线前检查

- [ ] 所有页面 Meta 标签已配置
- [ ] sitemap.xml 放置在网站根目录
- [ ] robots.txt 放置在网站根目录
- [ ] GA4 代码已部署（生产环境）
- [ ] Google Search Console 已验证
- [ ] Schema.org 数据已验证（Rich Results Test）
- [ ] Open Graph 图片已生成
- [ ] Twitter Card 图片已生成
- [ ] 所有页面 canonical URL 已设置
- [ ] 404 页面已自定义
- [ ] HTTPS 已启用
- [ ] 移动端响应式已测试
- [ ] 页面速度已优化（PageSpeed > 90）

## 验证工具

- Google Search Console: https://search.google.com/search-console
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/
- Open Graph Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
```

---

**模板维护**:
- 更新日期：2026-03-14
- 负责人：SEO Team
- 下次审查：2026-04-14
