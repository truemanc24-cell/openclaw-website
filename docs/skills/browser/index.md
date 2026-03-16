# 浏览器自动化技能

**技能名称**: `browser`  
**版本**: 1.0.0  
**来源**: [ClawHub](https://clawhub.ai/)

---

## 📖 技能介绍

浏览器自动化技能让你可以通过自然语言控制浏览器，实现网页操作、数据抓取、自动化测试等功能。

### 核心功能

- 🌐 **网页浏览** - 打开、导航、截图
- 🖱️ **交互操作** - 点击、输入、选择
- 📸 **截图录制** - 页面截图、录屏
- 📊 **数据抓取** - 提取网页内容
- 🤖 **自动化** - 执行重复任务

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install browser
```

### 2. 安装浏览器扩展

```bash
# 安装 Chrome 扩展
openclaw browser extension install
```

### 3. 配置浏览器

在 `~/.openclaw/openclaw.json` 中配置：

```json
{
  "skills": {
    "browser": {
      "enabled": true,
      "config": {
        "profile": "chrome",
        "headless": false
      }
    }
  }
}
```

---

## 💡 使用示例

### 打开网页

```
@main 打开 https://github.com
```

### 截图

```
@main 给当前页面截个图
```

### 点击元素

```
@main 点击"Sign in"按钮
```

### 填写表单

```
@main 在用户名框输入 myuser，密码框输入 mypass
```

### 提取内容

```
@main 提取这个页面的所有标题
```

---

## 🔧 高级用法

### 自动化流程

```javascript
// 自动登录 GitHub
browser.navigate("https://github.com/login");
browser.type("#login_field", "username");
browser.type("#password", "password");
browser.click("input[type=submit]");
```

### 数据抓取

```javascript
// 抓取产品价格
const products = browser.evaluate(() => {
  return document.querySelectorAll(".product").map(p => ({
    name: p.querySelector(".name").textContent,
    price: p.querySelector(".price").textContent
  }));
});
```

### 等待元素

```javascript
// 等待元素出现后操作
browser.wait({ selector: "#loaded-content", timeout: 10000 });
browser.click("#action-button");
```

---

## ⚠️ 注意事项

### 浏览器配置

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| `profile` | `chrome` | 使用 Chrome 扩展 |
| `headless` | `false` | 可见模式更稳定 |
| `timeout` | `30000` | 操作超时时间 |

### 反爬虫策略

- ⚠️ 部分网站有反爬虫机制
- ⚠️ 避免高频访问
- ⚠️ 添加随机延迟

### 常见问题

**Q: 扩展无法连接？**  
A: 确保 Chrome 扩展已启用，且已附加到标签页

**Q: 元素找不到？**  
A: 使用正确的选择器，或改用 aria-ref

**Q: 操作超时？**  
A: 增加 timeout，或检查页面加载状态

---

## 📊 最佳实践

### ✅ 推荐做法

1. **使用稳定选择器** - 优先使用 aria-ref
2. **添加等待逻辑** - 确保元素加载完成
3. **错误处理** - 捕获异常并记录
4. **日志记录** - 便于调试

### ❌ 避免踩坑

1. **不要硬编码选择器** - 页面变更会失效
2. **不要忽略等待** - 操作可能失败
3. **不要高频访问** - 可能被封禁

---

## 🎯 使用场景

### 数据抓取

- 📊 竞品价格监控
- 📈 市场数据分析
- 📝 内容聚合

### 自动化测试

- ✅ 回归测试
- ✅ UI 测试
- ✅ 端到端测试

### 日常任务

- 📧 自动填写表单
- 📅 预约抢号
- 🛒 自动下单

---

## 🔗 相关资源

- [Playwright 文档](https://playwright.dev/)
- [ClawHub 技能页面](https://clawhub.ai/skills/browser)
- [GitHub 源码](https://github.com/openclaw/skills/browser)

---

## 💬 用户反馈

> "用这个技能自动抓取竞品价格，省了大量时间！"  
> —— 电商运营

> "自动化测试太好用了，回归测试完全自动化"  
> —— QA 工程师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
