# Tavily 搜索技能

**评级**: ⭐⭐⭐⭐⭐  
**类别**: 搜索工具  
**来源**: [ClawHub](https://clawhub.ai/)

---

## 📖 详细介绍

Tavily 搜索技能使用 Tavily API 进行网络搜索，获取实时信息和最新数据。

### 核心功能

- ✅ 实时网络搜索
- ✅ 智能结果筛选
- ✅ 内容摘要生成
- ✅ 多语言支持
- ✅ 可信来源优先

---

## 📥 安装方式

```bash
clawhub install tavily-search
```

### 配置 API Key

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "skills": {
    "tavily-search": {
      "enabled": true,
      "config": {
        "apiKey": "tvly-xxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## 🔧 使用方法

```bash
# 搜索最新信息
@agent 帮我搜索最新的 AI 新闻

# 搜索特定主题
@agent 搜索 OpenClaw 的使用教程

# 获取实时数据
@agent 搜索今天的科技热点
```

---

## 🔗 下载链接

| 来源 | 链接 |
|------|------|
| **ClawHub** | [clawhub.ai/skills/tavily-search](https://clawhub.ai/skills/tavily-search) |
| **GitHub** | [github.com/openclaw/skill-tavily-search](https://github.com/openclaw/skill-tavily-search) |

---

**最后更新**: 2026-03-21
