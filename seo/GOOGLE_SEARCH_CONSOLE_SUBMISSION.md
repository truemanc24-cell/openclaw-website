# Google Search Console 提交指南

**网站 URL**: https://opc-web-five.vercel.app (或自定义域名 openclaw.com)

**完成时间**: 2026-03-28

---

## ✅ 已完成的 SEO 配置

### 1. Sitemap.xml
- **位置**: https://opc-web-five.vercel.app/sitemap.xml
- **包含页面**: 165+ 个页面
- **更新频率**: 每日/每周/每月（根据页面类型）
- **最后更新**: 2026-03-28

### 2. Robots.txt
- **位置**: https://opc-web-five.vercel.app/robots.txt
- **配置**: 允许所有主流搜索引擎抓取
- **Sitemap 引用**: 已包含

### 3. 结构化数据 (Schema.org)
已添加三种类型的结构化数据：
- **SoftwareApplication**: 软件应用信息
- **Organization**: 组织信息
- **WebSite**: 网站信息（含搜索功能）

### 4. Meta 标签优化
- **Title**: OpenClaw 中文网 - 你的个人 AI 助手平台 | 3 分钟快速开始
- **Description**: OpenClaw 是强大的个人 AI 助手平台，支持多渠道集成 (WhatsApp/Telegram/Discord)、多 Agent 协作、技能市场扩展。开源、自托管、数据可控，3 分钟快速上手。
- **Keywords**: OpenClaw,AI 助手，自动化工具，多 Agent 协作，技能市场，自托管 AI,WhatsApp 机器人，Telegram 机器人
- **Open Graph**: 已配置（Facebook/LinkedIn 分享）
- **Twitter Card**: 已配置（Twitter 分享）
- **Canonical URL**: 已设置

---

## 📋 Google Search Console 提交步骤

### 步骤 1: 访问 Google Search Console
打开 https://search.google.com/search-console

### 步骤 2: 添加网站
1. 点击"添加资源"
2. 选择"URL 前缀"方式
3. 输入：`https://opc-web-five.vercel.app`
   - 如果有自定义域名，使用：`https://openclaw.com`

### 步骤 3: 验证网站所有权

**推荐方法：HTML 标签验证**

1. 在 GSC 验证页面选择"HTML 标签"
2. 复制 meta 标签代码，格式类似：
   ```html
   <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxx" />
   ```
3. 将标签添加到 `docs/.vitepress/config.mjs` 的 `head` 数组中：
   ```javascript
   head: [
     ['meta', { name: 'google-site-verification', content: 'xxxxxxxxxxxxxxxxxxxxx' }],
     // ... 其他 head 标签
   ]
   ```
4. 重新部署网站：
   ```bash
   cd ~/Desktop/Mark/2026-03-12_OpenClaw_Website
   vercel --prod
   ```
5. 回到 GSC 点击"验证"

### 步骤 4: 提交 Sitemap
1. 验证成功后，进入 GSC 仪表板
2. 左侧菜单点击"站点地图"
3. 在"添加新站点地图"中输入：`sitemap.xml`
4. 点击"提交"
5. 状态应显示为"成功"

### 步骤 5: 请求索引（可选）
1. 在 GSC 顶部搜索栏输入首页 URL：`https://opc-web-five.vercel.app/`
2. 点击"请求索引"
3. 等待 Google 抓取（通常 1-3 天）

---

## 🔍 验证工具

### 1. Rich Results Test（结构化数据测试）
- URL: https://search.google.com/test/rich-results
- 输入网站 URL，验证结构化数据是否正确

### 2. Mobile-Friendly Test（移动端友好测试）
- URL: https://search.google.com/test/mobile-friendly
- 验证网站在移动设备上的表现

### 3. Robots.txt Tester
- URL: https://www.google.com/robots/tester
- 验证 robots.txt 配置

---

## 📊 后续监控

### 每日检查（第一周）
- [ ] GSC 索引状态
- [ ] 抓取错误
- [ ] 搜索表现（展示次数、点击次数）

### 每周检查
- [ ] 关键词排名
- [ ] 索引页面数量
- [ ] 核心 Web 指标

### 每月检查
- [ ] 整体 SEO 表现
- [ ] 更新 sitemap.xml（如有新页面）
- [ ] 检查死链

---

## 🎯 预期时间线

| 时间 | 预期结果 |
|------|---------|
| 1-3 天 | Google 开始抓取网站 |
| 1 周 | 主要页面被索引 |
| 2-4 周 | 开始在搜索结果中出现 |
| 1-3 月 | 获得稳定的搜索流量 |

---

## ⚠️ 注意事项

1. **自定义域名**: 如果使用 openclaw.com，需要在 Vercel 配置域名，并在 GSC 使用域名验证
2. **HTTPS**: 已自动启用（Vercel 提供）
3. **网站速度**: VitePress 构建的静态站点速度很快，Core Web Vitals 应该表现良好
4. **内容更新**: 每次更新内容后重新构建部署，sitemap.xml 会自动更新

---

## 📞 需要帮助？

- Google Search Console 帮助：https://support.google.com/webmasters
- VitePress SEO 指南：https://vitepress.dev/guide/seo

---

**最后更新**: 2026-03-28
**部署版本**: https://opc-web-five.vercel.app
