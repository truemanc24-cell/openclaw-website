---
title: 04 browser automation
description: 04 browser automation 页面
---
  - 浏览器自动化
  - OpenClaw 教程
  - 网页控制
  - 自动化任务
  - 浏览器控制
  - RPA
lastUpdated: 2026-03-24
contributors:
  - Trueman
---

# 浏览器自动化：用 OpenClaw 控制你的浏览器

> 📅 更新时间：2026-03-22  
> ⏰ 阅读时长：18 分钟  
> 💡 难度：进阶

---

## 写在前面

想象一下：当你告诉 AI「帮我查一下北京今天的天气」，它不仅能搜索，还能打开浏览器、自动访问天气网站、截图给你看——这就是浏览器自动化的魅力。

OpenClaw 内置了强大的浏览器控制能力，让 AI 能够模拟人类操作浏览器，完成各种自动化任务。

本文将带你深入了解浏览器自动化，从基础操作到实战案例，让你真正解放双手！

---

## 一、浏览器控制能力概述

### 1.1 什么是浏览器自动化？

浏览器自动化是通过编程让 AI 控制浏览器自动执行操作：

| 操作类型 | 说明 | 示例 |
|----------|------|------|
| **导航** | 打开网页、点击链接 | 访问百度、点击搜索 |
| **填表** | 输入文本、选择选项 | 登录网站、填表单 |
| **截图** | 截图、快照 | 记录页面状态 |
| **提取** | 提取数据、文本 | 爬取商品信息 |

### 1.2 OpenClaw 浏览器架构

```
OpenClaw Gateway
    │
    ├── Browser Profile (浏览器配置)
    │   ├── openclaw    → OpenClaw 管理的独立浏览器
    │   ├── user        → 你的现有 Chrome 会话
    │   └── custom      → 自定义 CDP 配置
    │
    └── Browser Actions (浏览器操作)
        ├── 快照/screenshot
        ├── 点击/输入/navigate
        └── 标签页管理
```

### 1.3 支持的功能

| 功能 | 命令 | 说明 |
|------|------|------|
| 打开页面 | `openclaw browser open <url>` | 在新标签页打开 |
| 截图 | `openclaw browser screenshot` | 截图保存 |
| 快照 | `openclaw browser snapshot` | 获取页面快照 |
| 点击 | `openclaw browser click <ref>` | 点击元素 |
| 输入 | `openclaw browser type <ref> <text>` | 输入文本 |
| 导航 | `openclaw browser navigate <url>` | 导航到 URL |
| 标签页 | `openclaw browser tabs` | 列出所有标签页 |

---

## 二、配置浏览器环境

### 2.1 基础配置

OpenClaw 开箱即用，支持多种浏览器配置：

```bash
# 查看可用的浏览器配置
openclaw browser profiles

# 输出示例：
# - openclaw    (OpenClaw 管理的独立浏览器)
# - user       (当前登录的 Chrome)
# - custom     (自定义 CDP 配置)
```

### 2.2 使用 OpenClaw 管理的浏览器

默认使用 `openclaw` profile，它会启动一个独立的 Chrome 实例：

```bash
# 启动 OpenClaw 浏览器
openclaw browser --browser-profile openclaw start

# 打开网页
openclaw browser --browser-profile openclaw open https://www.google.com

# 截图
openclaw browser --browser-profile openclaw screenshot
```

### 2.3 使用现有的 Chrome 会话

如果想控制你已登录的 Chrome，使用 `user` profile：

```bash
# 列出当前 Chrome 标签页
openclaw browser --browser-profile user tabs

# 在现有 Chrome 中打开页面
openclaw browser --browser-profile user open https://github.com

# 获取快照
openclaw browser --browser-profile user snapshot
```

**⚠️ 注意事项：**
- 需要 Chrome 已安装并运行
- macOS 上可能会有权限提示
- 需要批准 Chrome DevTools 访问

### 2.4 自定义浏览器配置

可以创建自定义的浏览器配置：

```bash
# 创建自定义配置
openclaw browser create-profile \
  --name work \
  --color "#FF5A36" \
  --headless false

# 使用自定义配置
openclaw browser --browser-profile work open https://example.com
```

---

## 三、基础操作详解

### 3.1 打开和导航

```bash
# 在新标签页打开网页（默认配置）
openclaw browser open https://www.baidu.com

# 使用指定配置
openclaw browser --browser-profile openclaw open https://www.google.com

# 导航到 URL（替换当前页面）
openclaw browser navigate https://github.com
```

### 3.2 标签页管理

```bash
# 列出所有标签页
openclaw browser tabs

# 聚焦到指定标签页
openclaw browser focus <targetId>

# 关闭指定标签页
openclaw browser close <targetId>
```

### 3.3 截图和快照

```bash
# 截图（保存到文件）
openclaw browser screenshot

# 指定输出路径
openclaw browser screenshot --path ~/Desktop/screenshot.png

# 快照（获取页面内容用于 AI 分析）
openclaw browser snapshot

# 完整页面截图
openclaw browser screenshot --full-page true
```

### 3.4 元素交互

使用 `ref` 引用页面元素：

```bash
# 点击元素（通过 ref 引用）
openclaw browser click <ref>

# 输入文本
openclaw browser type <ref> "要输入的内容"

# 清除输入框
openclaw browser type <ref> "" --clear true

# 按键盘
openclaw browser press <ref> Enter
```

---

## 四、自动化场景实战

### 4.1 场景一：自动搜索并截图

**需求**：让 AI 自动搜索「OpenClaw」并截图结果

**步骤 1：打开搜索引擎**
```bash
openclaw browser open https://www.google.com
```

**步骤 2：等待页面加载**
```bash
openclaw browser snapshot
# 查看页面结构，找到搜索框的 ref
```

**步骤 3：输入搜索词**
```bash
# 假设搜索框的 ref 是 "search"
openclaw browser type search "OpenClaw"
```

**步骤 4：提交搜索**
```bash
openclaw browser press search Enter
```

**步骤 5：截图保存结果**
```bash
openclaw browser screenshot --path ~/Desktop/openclaw-search.png
```

### 4.2 场景二：自动登录网站

**需求**：自动登录一个网站

**完整脚本：**
```bash
#!/bin/bash

# 配置
URL="https://example.com/login"
USERNAME="your-username"
PASSWORD="your-password"

# 打开登录页
openclaw browser navigate "$URL"

# 等待页面加载
sleep 2

# 输入用户名
openclaw browser type username "$USERNAME"

# 输入密码
openclaw browser type password "$PASSWORD"

# 点击登录按钮
openclaw browser click login-button

# 等待登录结果
sleep 3

# 截图确认
openclaw browser screenshot --path ~/Desktop/login-result.png
```

### 4.3 场景三：爬取商品信息

**需求**：打开电商网站，提取商品信息

```javascript
// 这是一个 Agent 可以执行的 JavaScript 代码
// 用于在浏览器中提取数据

// 方法 1：使用 snapshot 获取完整页面
const snapshot = await browser.snapshot();

// 方法 2：在页面中执行脚本提取
const products = await browser.evaluate({
  javaScript: `
    // 选择所有商品元素
    const items = document.querySelectorAll('.product-item');
    
    // 提取数据
    const data = Array.from(items).map(item => ({
      title: item.querySelector('.title')?.textContent,
      price: item.querySelector('.price')?.textContent,
      image: item.querySelector('img')?.src
    }));
    
    JSON.stringify(data);
  `
});

console.log('提取的商品数据：', products);
```

### 4.4 场景四：批量处理表单

**需求**：提交多份表单

```bash
#!/bin/bash

# 准备数据文件
DATA_FILE="data.csv"

# 逐行读取并提交
while IFS=',' read -r name email message; do
  echo "正在提交: $name"
  
  # 打开表单页面
  openclaw browser navigate "https://example.com/form"
  
  # 填写表单
  openclaw browser type name-input "$name"
  openclaw browser type email-input "$email"
  openclaw browser type message-input "$message"
  
  # 提交
  openclaw browser click submit-button
  
  # 等待处理
  sleep 2
  
  # 截图确认
  openclaw browser screenshot --path "~/Desktop/result-$name.png"
  
done < "$DATA_FILE"
```

---

## 五、进阶技巧

### 5.1 等待策略

自动化中最常见的问题是**时机**——操作太快，页面还没加载完。

**解决方案 1：固定等待**
```bash
sleep 3  # 等待 3 秒
```

**解决方案 2：智能等待（推荐）**
```bash
# 等待元素出现后再操作
openclaw browser wait-for-selector ".search-results"
openclaw browser click .result:first-child
```

**解决方案 3：重试机制**
```bash
# 最多重试 3 次
for i in {1..3}; do
  if openclaw browser snapshot | grep -q "目标内容"; then
    echo "找到目标"
    break
  fi
  echo "重试 $i/3"
  sleep 2
done
```

### 5.2 元素定位

如何找到要操作的元素？

**方法 1：使用 snapshot 的 ref**

运行 `openclaw browser snapshot` 后，输出会包含元素引用：
```
📷 Snapshot
  ref: search-box - 输入框
  ref: submit-btn - 提交按钮
```

然后使用 ref：
```bash
openclaw browser click search-box
```

**方法 2：使用 CSS 选择器**
```bash
openclaw browser click "#login-button"
openclaw browser type ".search-input" "OpenClaw"
```

**方法 3：使用 XPath**
```bash
openclaw browser click "//button[@type='submit']"
```

### 5.3 处理弹窗

**alert/confirm 弹窗**
```bash
# 自动接受
openclaw browser evaluate --javaScript "
  window.alert = () => {};
  window.confirm = () => true;
"
```

**iframe 内容**
```bash
# 切换到 iframe
openclaw browser evaluate --javaScript "
  document.querySelector('iframe').contentWindow
"
```

### 5.4 滚动和截图

**滚动到特定位置**
```bash
openclaw browser evaluate --javaScript "
  window.scrollTo(0, document.body.scrollHeight);
"
```

**截取长图**
```bash
# 先滚动到底部（触发懒加载）
openclaw browser evaluate --javaScript "
  window.scrollTo(0, document.body.scrollHeight);
"

# 等待加载
sleep 2

# 截图
openclaw browser screenshot --full-page true
```

---

## 六、最佳实践

### 6.1 稳定性技巧

1. **总是等待页面加载**
   ```bash
   # 不要直接操作，先快照确认
   openclaw browser snapshot
   ```

2. **使用唯一选择器**
   ```html
   <!-- 推荐：使用 id 或 data-testid -->
   <button id="submit-form" data-testid="submit">提交</button>
   
   <!-- 避免：使用复杂的 CSS 选择器 -->
   <button class="btn primary large rounded">提交</button>
   ```

3. **添加重试逻辑**
   ```bash
   retry() {
     for i in {1..3}; do
       if command; then
         return 0
       fi
       sleep 2
     done
     return 1
   }
   ```

### 6.2 性能优化

1. **减少不必要的等待**
   - 使用条件等待而非固定等待
   
2. **复用浏览器实例**
   - 不要每次操作都启动新浏览器

3. **批量操作**
   ```bash
   # 连续操作使用同一会话
   openclaw browser navigate "https://site.com/page1"
   openclaw browser click ".link-to-page2"
   openclaw browser screenshot  # 而不是重新打开
   ```

### 6.3 调试技巧

**查看详细日志：**
```bash
# 跟踪所有浏览器操作
openclaw logs --follow | grep -i browser
```

**在浏览器控制台调试：**
```bash
# 在页面中执行调试代码
openclaw browser evaluate --javaScript "
  console.log('Debug:', document.title);
"
```

**查看网络请求：**
```bash
# 打开 Chrome DevTools
openclaw browser console
```

---

## 七、集成 AI 能力

### 7.1 AI 驱动的自动化

最强大的用法是让 AI 自己决定操作：

```
User: 帮我查一下 iPhone 15 Pro 在京东的最低价

Agent:
1. 打开京东搜索 iPhone 15 Pro
2. 等待页面加载
3. 提取价格信息
4. 截图并返回结果
```

### 7.2 代码示例

```python
# 这是一个 Agent 可以调用的 Python 脚本
# 功能：搜索并提取信息

import subprocess
import json

def search_and_extract(query):
    # 1. 打开搜索引擎
    subprocess.run([
        "openclaw", "browser", "open", 
        f"https://www.google.com/search?q={query}"
    ])
    
    # 2. 等待加载
    subprocess.run(["sleep", "3"])
    
    # 3. 获取快照
    result = subprocess.run(
        ["openclaw", "browser", "snapshot"],
        capture_output=True, text=True
    )
    
    # 4. AI 分析内容
    # ... 这里 AI 会分析 snapshot 内容
    
    # 5. 截图保存
    subprocess.run([
        "openclaw", "browser", "screenshot",
        "--path", f"~/Desktop/{query}.png"
    ])
    
    return "截图已保存"

# 使用
result = search_and_extract("OpenClaw AI")
print(result)
```

### 7.3 实际工作流

```
用户输入
    ↓
AI 分析意图（需要浏览网页）
    ↓
生成浏览器操作序列
    ↓
执行操作 + 截图
    ↓
分析结果
    ↓
返回给用户
```

---

## 八、完整示例：自动比价工具

让我们创建一个完整的自动比价工具：

### 8.1 功能设计

1. 输入商品名称
2. 自动打开多个电商网站
3. 提取价格信息
4. 生成比价报告

### 8.2 实现代码

```bash
#!/bin/bash

# 配置
PRODUCT="$1"
OUTPUT_DIR="~/Desktop/price-check"
mkdir -p "$OUTPUT_DIR"

# 价格提取 JavaScript
EXTRACT_PRICE_JS='
  (() => {
    const priceEl = document.querySelector(".price, .product-price, [class*=\"price\"]");
    return priceEl ? priceEl.textContent.trim() : "未找到";
  })()
'

# 网站列表
SITES=(
  "https://www.jd.com/search?keyword=$PRODUCT"
  "https://www.taobao.com/search?q=$PRODUCT"
  "https://search.baidu.com/s?wd=$PRODUCT"
)

echo "📊 开始比价：$PRODUCT"
echo "================================"

for i in "${!SITES[@]}"; do
  site="${SITES[$i]}"
  site_name=("京东" "淘宝" "百度")
  
  echo ""
  echo "🌐 访问 ${site_name[$i]}..."
  
  # 打开网站
  openclaw browser open "$site"
  
  # 等待加载
  sleep 3
  
  # 提取价格（通过 JavaScript）
  price=$(openclaw browser evaluate --javaScript "$EXTRACT_PRICE_JS")
  
  # 截图
  openclaw browser screenshot --path "$OUTPUT_DIR/${site_name[$i]}.png"
  
  echo "💰 ${site_name[$i]} 价格: $price"
done

echo ""
echo "✅ 比价完成！结果保存在 $OUTPUT_DIR"
```

### 8.3 使用方法

```bash
# 赋予执行权限
chmod +x price-check.sh

# 运行
./price-check.sh "iPhone 15 Pro"
```

---

## 总结

浏览器自动化是 OpenClaw 最强大的能力之一：

1. ✅ **解放双手**：自动化重复性浏览器操作
2. ✅ **AI 驱动**：让 AI 自己决定需要做什么
3. ✅ **截图可视**：每一步都能看到结果
4. ✅ **灵活定位**：多种元素定位方式

**下一步**：
- 尝试基础浏览器操作
- 让 Agent 为你自动搜索并截图
- 开发自己的自动化脚本

---

> 📍 **相关文档**
> - [Browser CLI 命令](/docs/cli/browser.md)
> - [Browser 工具详解](/docs/tools/browser.md)
> - [Remote Access 远程访问](/docs/gateway/remote.md)

---

*[配图：浏览器控制界面 - 展示操作界面]*
*[配图：自动化流程图 - 展示自动搜索流程]*
*[配图：比价结果示例 - 展示多网站比价截图]*

---

## 结构化数据（SEO）

<!--
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "浏览器自动化教程 - 用 OpenClaw 控制浏览器",
  "description": "学完这个教程，你将能够使用 OpenClaw 控制浏览器完成自动化任务。包含浏览器配置、网页操作、截图录制实战示例。",
  "image": "https://trueworld-web.vercel.app/images/browser-automation.jpg",
  "author": {
    "@type": "Person",
    "name": "Trueman",
    "url": "https://trueworld-web.vercel.app/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenClaw 中文技术网",
    "logo": {
      "@type": "ImageObject",
      "url": "https://trueworld-web.vercel.app/logo.png"
    }
  },
  "datePublished": "2026-03-22",
  "dateModified": "2026-03-24",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://trueworld-web.vercel.app/tutorials/advanced/browser-automation"
  },
  "articleSection": "教程",
  "keywords": ["浏览器自动化", "网页控制", "RPA", "自动化任务"],
  "wordCount": "4500",
  "timeRequired": "PT18M",
  "difficulty": "Intermediate",
  "educationalLevel": "Intermediate",
  "learningResourceType": "Tutorial"
}
</script>
-->

---

## 📚 相关内容

- [Canvas 指南](/tutorials/advanced/03-canvas-guide)
- [浏览器工具](/tools/browser/)
- [自动化任务](/concepts/features)
- [技能开发](/skills/)
- [高级教程](/tutorials/advanced/)
