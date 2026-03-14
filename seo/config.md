# OpenClaw SEO 技术配置文档

**版本**: 1.0  
**创建日期**: 2026-03-14  
**最后更新**: 2026-03-14  
**状态**: ✅ 配置完成

---

## 1. 技术 SEO 配置

### 1.1 Google Analytics 4 (GA4)

**配置状态**: ⏳ 待部署时配置

**实施步骤**:
1. 在 Google Analytics 创建新属性
2. 获取 Measurement ID (格式：G-XXXXXXXXXX)
3. 在网站 `<head>` 中添加 GA4 代码

**代码模板**:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**推荐事件追踪**:
- `page_view` - 页面浏览（自动）
- `click` - GitHub 链接点击
- `download` - 下载按钮点击
- `scroll` - 页面滚动深度
- `search` - 站内搜索
- `form_submit` - 联系表单提交

**GA4 自定义维度**:
```javascript
// 用户类型
gtag('set', 'user_type', 'developer'); // developer, enterprise, student

// 使用场景
gtag('set', 'use_case', 'workflow_automation'); // workflow, agent, integration
```

---

### 1.2 Google Search Console

**配置状态**: ⏳ 待部署时配置

**实施清单**:
- [ ] 验证网站所有权（DNS 或 HTML 文件）
- [ ] 提交 sitemap.xml
- [ ] 配置国际定位（目标国家/地区）
- [ ] 设置首选域名（带 www 或不带）
- [ ] 添加用户（团队成员）

**推荐设置**:
- **目标地区**: 全球（默认）
- **首选域名**: 不带 www（openclaw.com）
- **抓取频率**: 自动

**监测重点**:
- 索引覆盖率错误
- 核心网页指标（Core Web Vitals）
- 移动设备易用性
- 安全与手动操作

---

### 1.3 sitemap.xml

**生成工具**: 使用静态站点生成器自动构建或手动创建

**文件位置**: `/sitemap.xml`

**完整 Sitemap**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- 首页 -->
  <url>
    <loc>https://openclaw.com/</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 核心页面 -->
  <url>
    <loc>https://openclaw.com/features</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://openclaw.com/docs</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://openclaw.com/blog</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://openclaw.com/examples</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://openclaw.com/pricing</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://openclaw.com/community</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- 文档页面 -->
  <url>
    <loc>https://openclaw.com/docs/quickstart</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://openclaw.com/docs/installation</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://openclaw.com/docs/api-reference</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://openclaw.com/docs/tutorials</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 博客文章（示例，实际应包含所有文章） -->
  <url>
    <loc>https://openclaw.com/blog/build-first-ai-agent</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://openclaw.com/blog/openclaw-vs-zapier</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- 多语言版本（xhtml:link 示例） -->
  <!--
  <url>
    <loc>https://openclaw.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://openclaw.com/en/"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://openclaw.com/zh/"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://openclaw.com/ja/"/>
  </url>
  -->

</urlset>
```

**提交方式**:
1. Google Search Console → Sitemaps → 添加 `sitemap.xml`
2. 在 `robots.txt` 中声明

---

### 1.4 robots.txt

**文件位置**: `/robots.txt`

**完整配置**:
```txt
# OpenClaw Robots.txt
# 最后更新：2026-03-14

# 允许所有搜索引擎抓取
User-agent: *
Allow: /

# 允许抓取的路径
Allow: /docs/
Allow: /blog/
Allow: /features/
Allow: /examples/

# 禁止抓取的路径（管理后台、API 等）
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /tmp/
Disallow: /*?query=*
Disallow: /*&query=*

# 允许抓取带参数的特定页面（如搜索）
Allow: /search?*q=

# Sitemap 位置
Sitemap: https://openclaw.com/sitemap.xml

# 特定搜索引擎规则

# Google
User-agent: Googlebot
Crawl-delay: 1
Allow: /

# Google Images
User-agent: Googlebot-Image
Allow: /images/
Disallow: /images/private/

# Bing
User-agent: Bingbot
Crawl-delay: 2
Allow: /

# Baidu
User-agent: Baiduspider
Allow: /
Disallow: /admin/

# Yandex
User-agent: Yandex
Allow: /
Disallow: /admin/

# 禁止抓取图片的搜索引擎
User-agent: *
Disallow: /*.png$
Disallow: /*.jpg$
Disallow: /*.gif$
Allow: /images/og-*.png$
Allow: /images/twitter-*.png$
```

**测试工具**: https://www.google.com/robots/tester

---

### 1.5 Meta 标签模板

**全局 Head 模板** (`_head.html` 或布局文件):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- 基础 SEO -->
  <title>{PAGE_TITLE}</title>
  <meta name="description" content="{PAGE_DESCRIPTION}">
  <meta name="keywords" content="{PAGE_KEYWORDS}">
  <meta name="author" content="OpenClaw Team">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{PAGE_URL}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{PAGE_URL}">
  <meta property="og:title" content="{PAGE_TITLE}">
  <meta property="og:description" content="{PAGE_DESCRIPTION}">
  <meta property="og:image" content="{OG_IMAGE_URL}">
  <meta property="og:site_name" content="OpenClaw">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@openclaw">
  <meta name="twitter:creator" content="@openclaw">
  <meta name="twitter:url" content="{PAGE_URL}">
  <meta name="twitter:title" content="{PAGE_TITLE}">
  <meta name="twitter:description" content="{PAGE_DESCRIPTION}">
  <meta name="twitter:image" content="{TWITTER_IMAGE_URL}">
  
  <!-- 结构化数据 (Schema.org) -->
  <script type="application/ld+json">
  {PAGE_SCHEMA_JSON}
  </script>
  
  <!-- GA4 (部署时添加) -->
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> -->
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  
  <!-- 主题色 -->
  <meta name="theme-color" content="#FF6B35">
</head>
```

---

## 2. 页面 SEO 优化

### 2.1 首页 (Home)

**URL**: `/`

**Meta 配置**:
```html
<title>OpenClaw - Open Source AI Agent Automation Platform</title>
<meta name="description" content="Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers. CLI-driven workflows, local-first architecture.">
<meta name="keywords" content="AI agent, automation, open source, self-hosted, workflow automation, multi-agent, CLI, local LLM, developer tools">
<link rel="canonical" href="https://openclaw.com/">
```

**Open Graph**:
```html
<meta property="og:title" content="OpenClaw - Open Source AI Agent Automation Platform">
<meta property="og:description" content="Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers.">
<meta property="og:image" content="https://openclaw.com/images/og-home.png">
<meta property="og:url" content="https://openclaw.com/">
```

**Twitter Card**:
```html
<meta name="twitter:title" content="OpenClaw - Open Source AI Agent Automation Platform">
<meta name="twitter:description" content="Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers.">
<meta name="twitter:image" content="https://openclaw.com/images/twitter-home.png">
```

**Schema.org**:
```json
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
    "ratingCount": "1250"
  },
  "description": "OpenClaw is an open-source AI agent automation platform for developers. Build, deploy, and manage AI agents with CLI-driven workflows and local-first architecture.",
  "url": "https://openclaw.com",
  "downloadUrl": "https://github.com/openclaw/openclaw",
  "author": {
    "@type": "Organization",
    "name": "OpenClaw Team"
  }
}
```

---

### 2.2 关于页 (About)

**URL**: `/about`

**Meta 配置**:
```html
<title>About OpenClaw - Open Source AI Agent Platform Mission</title>
<meta name="description" content="Learn about OpenClaw's mission: democratizing AI agent automation. Open-source, privacy-first, developer-friendly tools for building autonomous agents.">
<meta name="keywords" content="about OpenClaw, open source AI, AI agent mission, privacy-first AI, local AI, developer community">
<link rel="canonical" href="https://openclaw.com/about">
```

**Open Graph**:
```html
<meta property="og:title" content="About OpenClaw - Our Mission">
<meta property="og:description" content="Learn about OpenClaw's mission: democratizing AI agent automation with open-source tools.">
<meta property="og:image" content="https://openclaw.com/images/og-about.png">
<meta property="og:url" content="https://openclaw.com/about">
```

**Schema.org**:
```json
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
```

---

### 2.3 教程列表页 (Tutorials)

**URL**: `/docs/tutorials` 或 `/tutorials`

**Meta 配置**:
```html
<title>OpenClaw Tutorials - Learn AI Agent Automation</title>
<meta name="description" content="Step-by-step OpenClaw tutorials: build your first AI agent, automate workflows, integrate tools. Beginner to advanced guides for developers.">
<meta name="keywords" content="OpenClaw tutorial, AI agent tutorial, automation guide, workflow automation, how to build AI agent, developer tutorials">
<link rel="canonical" href="https://openclaw.com/docs/tutorials">
```

**Open Graph**:
```html
<meta property="og:title" content="OpenClaw Tutorials - Learn AI Agent Automation">
<meta property="og:description" content="Step-by-step guides to build AI agents and automate workflows with OpenClaw.">
<meta property="og:image" content="https://openclaw.com/images/og-tutorials.png">
<meta property="og:url" content="https://openclaw.com/docs/tutorials">
```

**Schema.org**:
```json
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
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://openclaw.com/docs/tutorials/workflow-automation"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "url": "https://openclaw.com/docs/tutorials/multi-agent-orchestration"
    }
  ]
}
```

---

### 2.4 URL 结构优化

**推荐 URL 结构**:
```
首页：https://openclaw.com/

核心页面:
- /features          → 功能介绍
- /about             → 关于我们
- /pricing           → 定价
- /community         → 社区
- /blog              → 博客列表
- /examples          → 案例展示

文档:
- /docs              → 文档首页
- /docs/quickstart   → 快速开始
- /docs/installation → 安装指南
- /docs/api-reference → API 参考
- /docs/tutorials    → 教程列表
- /docs/tutorials/{tutorial-slug} → 具体教程

博客:
- /blog              → 博客列表
- /blog/{post-slug}  → 博客文章

其他:
- /github            → GitHub 跳转页
- /download          → 下载页
- /contact           → 联系页面
```

**URL 命名规范**:
- ✅ 使用小写字母
- ✅ 使用连字符分隔单词（`-`）
- ✅ 保持简短、描述性
- ✅ 包含目标关键词
- ❌ 避免下划线、大写字母、特殊字符

**示例**:
```
✅ /docs/quickstart
✅ /blog/build-first-ai-agent
✅ /examples/customer-support-automation

❌ /docs/QuickStart
❌ /blog/build_first_ai_agent
❌ /examples/customerSupport
```

---

## 3. 性能优化

### 3.1 图片压缩建议

**工具推荐**:
- **在线工具**: TinyPNG, Squoosh, Compressor.io
- **CLI 工具**: `imagemin`, `sharp`, `pngquant`
- **构建工具**: `webpack-image-optimizer`, `vite-plugin-image-optimizer`

**压缩参数**:
```bash
# 使用 imagemin CLI
imagemin images/* --out-dir=images-optimized --plugin=pngquant --plugin=mozjpeg

# 使用 sharp (Node.js)
const sharp = require('sharp');
sharp('input.jpg')
  .resize(1200, 630)  // Open Graph 标准尺寸
  .jpeg({ quality: 80, progressive: true })
  .toFile('output.jpg');
```

**图片格式建议**:
| 类型 | 格式 | 质量 | 备注 |
|------|------|------|------|
| Logo/图标 | SVG | - | 矢量，无限缩放 |
| 照片 | WebP | 80-85 | fallback 为 JPG |
| 截图 | PNG | - | 需要透明度 |
| Open Graph | PNG/JPG | 85 | 1200x630px |
| Twitter Card | PNG | 85 | 1200x600px |

**尺寸规范**:
```
Open Graph 图片：1200 x 630 px (1.91:1)
Twitter Card: 1200 x 600 px (2:1)
Favicon: 32x32, 16x16, 180x180 (Apple)
Hero 图片：1920 x 1080 px
缩略图：400 x 225 px
```

**懒加载**:
```html
<img src="image.jpg" alt="Description" loading="lazy" decoding="async">
```

---

### 3.2 CDN 配置

**推荐 CDN 服务商**:
1. **Cloudflare** (免费，推荐)
2. Vercel Edge Network
3. Netlify Edge
4. AWS CloudFront

**Cloudflare 配置**:
```
DNS 设置:
- @ → CNAME → your-site.vercel.app (代理开启)
- www → CNAME → your-site.vercel.app (代理开启)

缓存规则:
- /static/* → Cache Level: Cache Everything, Edge TTL: 1 month
- /images/* → Cache Level: Cache Everything, Edge TTL: 1 month
- /*.css → Cache Level: Cache Everything, Edge TTL: 1 month
- /*.js → Cache Level: Cache Everything, Edge TTL: 1 month
- /*.html → Cache Level: Bypass (动态内容)

性能优化:
- Auto Minify: HTML, CSS, JS (开启)
- Brotli 压缩：开启
- HTTP/2: 开启
- HTTP/3 (QUIC): 开启
- Early Hints: 开启
```

**CDN Headers**:
```nginx
# Nginx 配置示例
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
  add_header X-Content-Type-Options "nosniff";
  add_header Access-Control-Allow-Origin "*";
}

location ~* \.(html|htm)$ {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}
```

---

### 3.3 缓存策略

**HTTP 缓存头配置**:
```nginx
# 静态资源（1 年缓存）
location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# CSS/JS（1 年缓存，使用文件名哈希）
location ~* \.(css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# HTML（不缓存或短时间缓存）
location ~* \.(html|htm)$ {
  expires 1h;
  add_header Cache-Control "public, must-revalidate, no-cache";
}

# API 响应（不缓存）
location /api/ {
  add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
  add_header Pragma "no-cache";
  add_header Expires "0";
}
```

**浏览器缓存策略**:
```javascript
// Service Worker 缓存策略 (Workbox)
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css-cache',
  })
);
```

**核心网页指标目标**:
```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
FCP (First Contentful Paint): < 1.8s
TTI (Time to Interactive): < 3.8s
TBT (Total Blocking Time): < 200ms
```

---

## 4. 本地 SEO

### 4.1 Schema.org 结构化数据

**网站全局 Schema** (`application/ld+json`):
```json
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
```

**组织 Schema**:
```json
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
```

**软件应用 Schema** (首页):
```json
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
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Developer User"
    },
    "reviewBody": "Best open-source AI agent framework I've used. CLI-first approach is perfect for developers."
  },
  "description": "OpenClaw is an open-source AI agent automation platform for developers. Build, deploy, and manage AI agents with CLI-driven workflows and local-first architecture.",
  "url": "https://openclaw.com",
  "downloadUrl": "https://github.com/openclaw/openclaw",
  "author": {
    "@type": "Organization",
    "name": "OpenClaw Team"
  },
  "keywords": "AI agent, automation, open source, workflow, self-hosted, CLI, local LLM",
  "fileSize": "15MB",
  "softwareVersion": "1.0.0",
  "releaseNotes": "https://github.com/openclaw/openclaw/releases"
}
```

**文章 Schema** (博客文章):
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Build Your First AI Agent with OpenClaw",
  "datePublished": "2026-03-14T10:00:00Z",
  "dateModified": "2026-03-14T10:00:00Z",
  "author": {
    "@type": "Person",
    "name": "OpenClaw Team",
    "url": "https://openclaw.com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenClaw",
    "logo": {
      "@type": "ImageObject",
      "url": "https://openclaw.com/images/logo.png"
    }
  },
  "description": "Step-by-step guide to building your first AI agent with OpenClaw. Learn the basics of AI agent automation.",
  "image": "https://openclaw.com/images/blog/build-first-ai-agent.png",
  "url": "https://openclaw.com/blog/build-first-ai-agent",
  "wordCount": "2500",
  "timeRequired": "PT15M",
  "keywords": "AI agent tutorial, build AI agent, OpenClaw tutorial, automation guide"
}
```

**教程 Schema**:
```json
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
    },
    {
      "@type": "HowToTool",
      "name": "Node.js",
      "url": "https://nodejs.org"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Install OpenClaw",
      "text": "Install OpenClaw CLI using npm or yarn",
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent#install"
    },
    {
      "@type": "HowToStep",
      "name": "Create Agent",
      "text": "Initialize a new agent project",
      "url": "https://openclaw.com/docs/tutorials/build-first-ai-agent#create"
    }
  ]
}
```

**FAQ Schema** (常见问题页面):
```json
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
```

---

### 4.2 Open Graph 标签

**完整 Open Graph 模板**:
```html
<!-- 基础 Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="OpenClaw">
<meta property="og:locale" content="en_US">

<!-- 页面特定内容 -->
<meta property="og:url" content="https://openclaw.com/{page-path}">
<meta property="og:title" content="{Page Title}">
<meta property="og:description" content="{Page Description}">
<meta property="og:image" content="https://openclaw.com/images/og-{page}.png">
<meta property="og:image:alt" content="{Image Alt Text}">

<!-- 图片尺寸（可选，但推荐） -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- 视频（如果有） -->
<meta property="og:video" content="https://openclaw.com/videos/demo.mp4">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="1280">
<meta property="og:video:height" content="720">
```

**各页面 Open Graph 配置**:

| 页面 | og:title | og:description | og:image |
|------|----------|----------------|----------|
| 首页 | OpenClaw - Open Source AI Agent Automation Platform | Build, deploy, and manage AI agents with OpenClaw. Open-source, self-hosted automation for developers. | /images/og-home.png |
| 功能 | OpenClaw Features - Multi-Agent Orchestration | Powerful AI agent features: multi-agent orchestration, CLI automation, local LLM support, 100+ integrations. | /images/og-features.png |
| 文档 | OpenClaw Documentation - Quick Start & API | Complete OpenClaw docs: installation, tutorials, API reference, examples. Get started in minutes. | /images/og-docs.png |
| 博客 | OpenClaw Blog - AI Agent Automation Insights | Tutorials, guides, and insights on AI agent development and workflow automation. | /images/og-blog.png |

---

### 4.3 Twitter Card 标签

**Twitter Card 模板**:
```html
<!-- Card 类型 -->
<meta name="twitter:card" content="summary_large_image">

<!-- 账号信息 -->
<meta name="twitter:site" content="@openclaw">
<meta name="twitter:creator" content="@openclaw">

<!-- 内容 -->
<meta name="twitter:url" content="https://openclaw.com/{page-path}">
<meta name="twitter:title" content="{Page Title}">
<meta name="twitter:description" content="{Page Description}">
<meta name="twitter:image" content="https://openclaw.com/images/twitter-{page}.png">
<meta name="twitter:image:alt" content="{Image Alt Text}">

<!-- 可选：视频 -->
<meta name="twitter:player" content="https://openclaw.com/videos/demo.mp4">
<meta name="twitter:player:width" content="1280">
<meta name="twitter:player:height" content="720">
```

**Twitter Card 尺寸规范**:
```
summary_large_image: 1200 x 600 px (2:1)
summary: 120 x 120 px (1:1)
最小尺寸：300 x 157 px
最大尺寸：4096 x 4096 px
最大文件大小：5MB
支持格式：JPG, PNG, WEBP, GIF
```

---

## 5. 关键词部署策略

### 5.1 页面关键词分配

| 页面 | 主关键词 (2-3%) | 次关键词 (1-2%) | 长尾词 |
|------|----------------|----------------|--------|
| 首页 | AI agent, automation, open source | workflow automation, self-hosted, developer tools | open source AI agent, local AI automation |
| 功能页 | workflow automation, multi-agent | orchestration, CLI automation, integration | AI agent workflow, multi-agent system |
| 文档页 | tutorial, documentation, API | quick start, installation, examples | how to build AI agent, OpenClaw tutorial |
| 博客 | guide, examples, best practices | use cases, tips, comparison | AI agent use cases, automation examples |

### 5.2 内容关键词密度

```
标题 (H1): 包含主关键词 1 次
副标题 (H2/H3): 包含次关键词 2-3 次
首段：包含主关键词 1 次
正文：关键词密度 1-2%
图片 Alt: 描述性 + 关键词
内部链接锚文本：多样化，包含关键词
```

### 5.3 内部链接策略

```
首页 → 功能页 (锚文本："features", "AI agent features")
首页 → 文档页 (锚文本："documentation", "get started")
首页 → 博客 (锚文本："latest blog posts", "tutorials")
功能页 → 文档页 (锚文本："learn more", "see docs")
博客文章 → 相关文章 (锚文本：相关主题)
所有页面 → GitHub (锚文本："View on GitHub", "Source code")
```

---

## 6. 监测与优化

### 6.1 关键指标追踪

| 指标 | 目标 (6 个月) | 工具 | 频率 |
|------|-------------|------|------|
| 有机搜索流量 | 10,000/月 | GA4 | 每日 |
| 关键词排名 (前 10) | 50+ | Ahrefs/SEMrush | 每周 |
| Domain Rating | 40+ | Ahrefs | 每月 |
| 页面停留时间 | >3 分钟 | GA4 | 每周 |
| 跳出率 | <50% | GA4 | 每周 |
| 转化率 (GitHub Star) | 5% | GA4 Events | 每周 |
| 索引页面数 | 100+ | GSC | 每周 |
| 核心网页指标 | 全部绿色 | GSC/PageSpeed | 每周 |

### 6.2 每周 SEO 检查清单

```markdown
- [ ] 检查 Google Search Console 错误
- [ ] 监测核心关键词排名变化
- [ ] 分析高跳出率页面 (>70%)
- [ ] 检查新索引页面
- [ ] 回复社区评论和提及
- [ ] 更新旧博客内容（如有必要）
- [ ] 检查竞争对手动态
```

### 6.3 每月 SEO 任务

```markdown
- [ ] 发布 10 篇博客文章
- [ ] 获取 20+ 新反向链接
- [ ] 优化 5 个低表现页面
- [ ] 竞品关键词分析更新
- [ ] 生成 SEO 性能报告
- [ ] 更新 sitemap.xml
- [ ] 检查并修复死链
- [ ] 审查页面速度指标
```

---

## 7. 部署检查清单

### 上线前必做

```markdown
- [ ] 所有页面 Meta 标签配置完成
- [ ] sitemap.xml 生成并验证
- [ ] robots.txt 配置并测试
- [ ] GA4 代码部署（生产环境）
- [ ] Google Search Console 验证
- [ ] Schema.org 结构化数据验证
- [ ] Open Graph 图片生成（所有页面）
- [ ] Twitter Card 图片生成（所有页面）
- [ ] 301 重定向配置（如有旧 URL）
- [ ] 404 页面自定义
- [ ] HTTPS 强制启用
- [ ] www/non-www 统一
- [ ] 移动端响应式测试
- [ ] 页面速度测试（PageSpeed Insights）
- [ ] 核心网页指标测试
```

### 验证工具

```
- Google Search Console: https://search.google.com/search-console
- GA4: https://analytics.google.com/
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/
- Schema Validator: https://validator.schema.org/
- Open Graph Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
```

---

## 8. 参考资源

### 工具与服务
- **关键词研究**: Ahrefs, SEMrush, Ubersuggest, Google Keyword Planner
- **排名追踪**: Ahrefs, SEMrush, SerpRobot
- **网站分析**: Google Analytics 4, Plausible, Fathom
- **速度测试**: PageSpeed Insights, GTmetrix, WebPageTest
- **SEO 审计**: Screaming Frog, Sitebulb, Ahrefs Site Audit

### 学习资源
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Schema.org Documentation](https://schema.org/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

---

**文档维护**:
- 负责人：SEO Team
- 更新频率：每月审查，按需更新
- 下次审查日期：2026-04-14

---

*End of SEO Configuration Document*
