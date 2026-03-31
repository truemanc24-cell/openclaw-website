---
title: multi search engine
description: multi search engine 页面
---

# Multi Search Engine v2.0.1

集成 17 个搜索引擎，无需 API 密钥即可进行网页抓取。

## 搜索引擎

### 国内（8 个）
- **百度**: `https://www.baidu.com/s?wd={keyword}`
- **必应国内**: `https://cn.bing.com/search?q={keyword}&ensearch=0`
- **必应国际**: `https://cn.bing.com/search?q={keyword}&ensearch=1`
- **360**: `https://www.so.com/s?q={keyword}`
- **搜狗**: `https://sogou.com/web?query={keyword}`
- **微信**: `https://wx.sogou.com/weixin?type=2&query={keyword}`
- **头条**: `https://so.toutiao.com/search?keyword={keyword}`
- **集思录**: `https://www.jisilu.cn/explore/?keyword={keyword}`

### 国际（9 个）
- **Google**: `https://www.google.com/search?q={keyword}`
- **Google 香港**: `https://www.google.com.hk/search?q={keyword}`
- **DuckDuckGo**: `https://duckduckgo.com/html/?q={keyword}`
- **Yahoo**: `https://search.yahoo.com/search?p={keyword}`
- **Startpage**: `https://www.startpage.com/sp/search?query={keyword}`
- **Brave**: `https://search.brave.com/search?q={keyword}`
- **Ecosia**: `https://www.ecosia.org/search?q={keyword}`
- **Qwant**: `https://www.qwant.com/?q={keyword}`
- **WolframAlpha**: `https://www.wolframalpha.com/input?i={keyword}`

## 快速示例

```javascript
// 基本搜索
web_fetch({"url": "https://www.google.com/search?q=python+tutorial"})

// 站点特定
web_fetch({"url": "https://www.google.com/search?q=site:github.com+react"})

// 文件类型
web_fetch({"url": "https://www.google.com/search?q=machine+learning+filetype:pdf"})

// 时间过滤器（过去一周）
web_fetch({"url": "https://www.google.com/search?q=ai+news&tbs=qdr:w"})

// 隐私搜索
web_fetch({"url": "https://duckduckgo.com/html/?q=privacy+tools"})

// DuckDuckGo Bangs
web_fetch({"url": "https://duckduckgo.com/html/?q=!gh+tensorflow"})

// 知识计算
web_fetch({"url": "https://www.wolframalpha.com/input?i=100+USD+to+CNY"})
```

## 高级运算符

| 运算符 | 示例 | 描述 |
|----------|---------|-------------|
| `site:` | `site:github.com python` | 在站点内搜索 |
| `filetype:` | `filetype:pdf report` | 特定文件类型 |
| `""` | `"machine learning"` | 精确匹配 |
| `-` | `python -snake` | 排除术语 |
| `OR` | `cat OR dog` | 任一术语 |

## 时间过滤器

| 参数 | 描述 |
|-----------|-------------|
| `tbs=qdr:h` | 过去一小时 |
| `tbs=qdr:d` | 过去一天 |
| `tbs=qdr:w` | 过去一周 |
| `tbs=qdr:m` | 过去一个月 |
| `tbs=qdr:y` | 过去一年 |

## 隐私搜索引擎

- **DuckDuckGo**：无追踪
- **Startpage**：Google 结果 + 隐私
- **Brave**：独立索引
- **Qwant**：符合欧盟 GDPR

## Bangs 快捷方式（DuckDuckGo）

| Bang | 目标 |
|------|-------------|
| `!g` | Google |
| `!gh` | GitHub |
| `!so` | Stack Overflow |
| `!w` | Wikipedia |
| `!yt` | YouTube |

## WolframAlpha 查询

- 数学：`integrate x^2 dx`
- 转换：`100 USD to CNY`
- 股票：`AAPL stock`
- 天气：`weather in Beijing`

## 文档

- `references/advanced-search.md` - 国内搜索指南
- `references/international-search.md` - 国际搜索指南
- `CHANGELOG.md` - 版本历史

## 许可证

MIT