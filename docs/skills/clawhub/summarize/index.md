---
title: index
description: index 页面
---

# Summarize

**技能名**: `summarize`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Summarize 技能提供内容摘要功能，支持文章、视频、播客等多种内容类型的摘要提取。

### 核心功能

- 📝 **文章摘要** - 提取文章要点
- 🎧 **播客摘要** - 音频内容摘要
- 📺 **视频摘要** - 视频内容摘要
- 📄 **文档摘要** - PDF/文档摘要

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install summarize
```

### 2. 无需配置

本技能无需额外配置，直接使用。

---

## 💡 使用示例

### 文章摘要

```bash
# 摘要网页
summarize url --url https://example.com/article

# 指定长度
summarize url --url https://example.com/article --length short

# 提取要点
summarize url --url https://example.com/article --format bullets
```

### 视频摘要

```bash
# YouTube 视频摘要
summarize video --url https://youtube.com/watch?v=xxx

# 带时间戳
summarize video --url https://youtube.com/watch?v=xxx --timestamps

# 指定语言
summarize video --url https://youtube.com/watch?v=xxx --language zh
```

### 文档摘要

```bash
# PDF 摘要
summarize pdf --file document.pdf

# 长文档摘要
summarize pdf --file report.pdf --chapters

# 提取关键信息
summarize pdf --file contract.pdf --extract key-points
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| url | 网页摘要 | `summarize url --url x` |
| video | 视频摘要 | `summarize video --url x` |
| pdf | PDF 摘要 | `summarize pdf --file x.pdf` |
| audio | 音频摘要 | `summarize audio --file x.mp3` |
| batch | 批量摘要 | `summarize batch --files x,y,z` |

### 摘要长度

| 长度 | 字数 | 适用场景 |
|------|------|----------|
| short | 100-200 | 快速浏览 |
| medium | 300-500 | 常规阅读 |
| long | 500-800 | 深度理解 |
| detailed | 800+ | 完整摘要 |

---

## ⚠️ 注意事项

### 最佳实践

1. **选择长度** - 根据需求选择摘要长度
2. **验证准确性** - 重要内容人工验证
3. **保留来源** - 记录原始来源
4. **版权尊重** - 遵守版权规定

### 避免踩坑

1. **不要完全依赖** - 摘要可能遗漏细节
2. **注意上下文** - 某些内容需要上下文
3. **专业内容** - 专业内容需专家审核

---

## 📊 效果评估

### 支持类型

| 类型 | 支持 | 准确率 |
|------|------|--------|
| 新闻文章 | ✅ | 95%+ |
| 技术文档 | ✅ | 90%+ |
| YouTube 视频 | ✅ | 90%+ |
| 播客 | ✅ | 85%+ |
| PDF 文档 | ✅ | 90%+ |

---

## 🔗 相关资源

- [内容摘要指南](https://clawhub.ai/docs/summarization)
- [AI 摘要最佳实践](https://clawhub.ai/docs/ai-summarization)
- [视频摘要技巧](https://clawhub.ai/docs/video-summary)

---

## 💬 用户评价

> "快速了解内容要点，节省时间"  
> —— 研究员

> "视频摘要很准确"  
> —— 学生

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
