# Playwright

**技能名**: `playwright`  
**作者**: @ivangdavila  
**下载量**: 10.5k ⭐ **Stars**: 18  
**版本**: 4  
**来源**: [ClawHub](https://clawhub.ai/ivangdavila/playwright)

---

## 📖 技能介绍

Playwright 技能提供浏览器自动化能力，支持 Chrome、Firefox、Safari，用于网页测试和数据抓取。

### 核心功能

- 🌐 **浏览器控制** - 控制多种浏览器
- 🧪 **自动化测试** - E2E 测试支持
- 📥 **数据抓取** - 网页数据提取
- 📸 **截图录屏** - 页面截图和录制

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install playwright
```

### 2. 安装浏览器

```bash
# 安装浏览器内核
playwright install
```

---

## 💡 使用示例

### 基础操作

```bash
# 打开网页
playwright open --url https://example.com

# 点击元素
playwright click --selector "#submit-button"

# 输入文本
playwright type --selector "#username" --text "hello"
```

### 数据抓取

```bash
# 提取内容
playwright scrape --url https://example.com --selector ".article"

# 批量抓取
playwright scrape --urls urls.txt --output data.json

# 截图
playwright screenshot --url https://example.com --output page.png
```

### 自动化测试

```bash
# 运行测试
playwright test --spec login.spec.js

# 生成报告
playwright test --reporter html
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| open | 打开网页 | `playwright open --url x.com` |
| click | 点击 | `playwright click --selector x` |
| type | 输入 | `playwright type --text "hello"` |
| scrape | 抓取 | `playwright scrape --selector x` |
| screenshot | 截图 | `playwright screenshot --output x.png` |

### 脚本示例

```javascript
// 自动化工作流
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.click('#login');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```

---

## ⚠️ 注意事项

### 最佳实践

1. **使用选择器** - 优先使用 data-testid
2. **添加等待** - 处理异步加载
3. **错误处理** - 处理元素找不到
4. **反爬规避** - 合理设置请求间隔

### 避免踩坑

1. **不要频繁请求** - 遵守 robots.txt
2. **注意登录态** - 处理 Cookie/Token
3. **动态内容** - 等待 JS 加载完成

---

## 📊 效果评估

### 支持浏览器

| 浏览器 | 支持 | 版本 |
|--------|------|------|
| Chrome | ✅ | Latest |
| Firefox | ✅ | Latest |
| Safari | ✅ | Latest |
| Edge | ✅ | Latest |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/ivangdavila/playwright)
- [Playwright 文档](https://playwright.dev/)
- [自动化测试指南](https://clawhub.ai/docs/playwright)

---

## 💬 用户评价

> "E2E 测试神器，比 Selenium 好用"  
> —— 测试工程师

> "数据抓取很稳定"  
> —— 数据工程师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
