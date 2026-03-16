# Xurl

**技能名**: `xurl`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Xurl 技能提供 X (Twitter) API 访问能力，支持发帖、回复、搜索、DM 等功能。

### 核心功能

- 📝 **发帖** - 发布推文
- 💬 **互动** - 回复/转发/点赞
- 🔍 **搜索** - 搜索推文
- 📬 **DM** - 发送私信

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install xurl
```

### 2. 配置认证

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置：

```json
{
  "x": {
    "apiKey": "YOUR_X_API_KEY",
    "apiSecret": "YOUR_X_API_SECRET",
    "accessToken": "YOUR_ACCESS_TOKEN",
    "accessSecret": "YOUR_ACCESS_SECRET"
  }
}
```

---

## 💡 使用示例

### 发帖

```bash
# 发布推文
xurl tweet --text "Hello, World!"

# 发布带图片
xurl tweet --text "Check this!" --image photo.jpg

# 发布线程
xurl thread --tweets "第一句","第二句","第三句"
```

### 互动

```bash
# 回复推文
xurl reply --tweet "tweet_id" --text "Good point!"

# 转发
xurl retweet --tweet "tweet_id"

# 点赞
xurl like --tweet "tweet_id"
```

### 搜索

```bash
# 搜索推文
xurl search --query "OpenClaw" --limit 10

# 搜索用户
xurl search --query "@username" --type user

# 趋势话题
xurl trends --location "US"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| tweet | 发帖 | `xurl tweet --text "hello"` |
| reply | 回复 | `xurl reply --tweet id --text x` |
| retweet | 转发 | `xurl retweet --tweet id` |
| search | 搜索 | `xurl search --query x` |
| dm | 私信 | `xurl dm --user @x --text y` |

### 自动化发帖

```javascript
// 定时发帖
cron.add({
  schedule: { kind: "cron", cron: "0 9 * * *" },
  payload: { 
    kind: "x", 
    action: "tweet",
    text: "早安！新的一天开始了！"
  }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **内容质量** - 发布有价值内容
2. **互动适度** - 避免过度互动
3. **遵守规则** - 遵守 X 平台规则
4. **频率控制** - 控制发帖频率

### 避免踩坑

1. **不要 spam** - 避免垃圾内容
2. **注意敏感话题** - 避免敏感内容
3. **API 限制** - 遵守 API 速率限制

---

## 📊 效果评估

### API 限制

| 操作 | 限制 |
|------|------|
| 发帖 | 300/3 小时 |
| 搜索 | 300/15 分钟 |
| DM | 1000/天 |
| 用户信息 | 300/15 分钟 |

---

## 🔗 相关资源

- [X API 文档](https://developer.twitter.com/en/docs)
- [Xurl 使用指南](https://clawhub.ai/docs/xurl)
- [社交媒体最佳实践](https://clawhub.ai/docs/social-media)

---

## 💬 用户评价

> "自动化发帖很方便"  
> —— 社交媒体运营

> "搜索功能很强大"  
> —— 市场研究员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
