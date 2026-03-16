# Browser

**技能名**: `browser`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Browser 技能提供浏览器自动化能力，支持网页导航、截图、元素操作等功能。

### 核心功能

- 🌐 **网页导航** - 打开和导航网页
- 📸 **截图捕获** - 网页截图
- 🖱️ **元素操作** - 点击/输入/选择
- 📄 **内容提取** - 提取网页内容

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install browser
```

### 2. 启动浏览器

```bash
# 启动浏览器
browser start

# 检查状态
browser status
```

---

## 💡 使用示例

### 网页导航

```bash
# 打开网页
browser open --url https://example.com

# 导航到新页面
browser navigate --url https://github.com

# 前进/后退
browser back
browser forward
```

### 截图

```bash
# 全屏截图
browser screenshot --output page.png --fullPage

# 可见区域截图
browser screenshot --output visible.png

# 特定元素截图
browser screenshot --output element.png --selector ".header"
```

### 元素操作

```bash
# 点击元素
browser click --selector "#submit-button"

# 输入文本
browser type --selector "#username" --text "hello"

# 选择选项
browser select --selector "#dropdown" --value "option1"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| open | 打开网页 | `browser open --url x.com` |
| screenshot | 截图 | `browser screenshot --output x.png` |
| click | 点击 | `browser click --selector x` |
| type | 输入 | `browser type --text "hello"` |
| evaluate | 执行 JS | `browser evaluate --script "..."` |

### 自动化流程

```javascript
// 自动化工作流
await browser.open('https://example.com');
await browser.click('#login');
await browser.type('#username', 'user');
await browser.type('#password', 'pass');
await browser.click('#submit');
await browser.screenshot({ output: 'logged-in.png' });
```

---

## ⚠️ 注意事项

### 最佳实践

1. **等待加载** - 操作前等待页面加载
2. **错误处理** - 处理元素找不到
3. **资源清理** - 使用后关闭浏览器
4. **隐私保护** - 不保存敏感信息

### 避免踩坑

1. **反爬机制** - 注意网站反爬
2. **速率限制** - 避免频繁请求
3. **Cookie 管理** - 妥善管理登录态

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 网页测试 | 高 | 高 |
| 数据抓取 | 高 | 高 |
| 自动化操作 | 中 | 高 |
| 截图存档 | 中 | 中 |

---

## 🔗 相关资源

- [OpenClaw Browser 文档](https://clawhub.ai/docs/browser)
- [浏览器自动化指南](https://clawhub.ai/docs/browser-automation)
- [Playwright 对比](https://clawhub.ai/docs/browser-vs-playwright)

---

## 💬 用户评价

> "网页自动化很方便"  
> —— 测试工程师

> "截图功能很实用"  
> —— 产品经理

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
