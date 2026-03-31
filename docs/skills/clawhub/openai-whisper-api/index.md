---
title: index
description: index 页面
---

# Openai Whisper Api

**技能名**: `openai-whisper-api`  
**作者**: @steipete  
**下载量**: 14.9k ⭐ **Stars**: 31  
**版本**: 1  
**来源**: [ClawHub](https://clawhub.ai/steipete/openai-whisper-api)

---

## 📖 技能介绍

Openai Whisper Api 技能使用 OpenAI 的 Whisper API 进行语音转文字，支持多语言识别。

### 核心功能

- 🎤 **语音转文字** - 高精度语音识别
- 🌍 **多语言支持** - 支持 100+ 语言
- ⏱️ **时间戳** - 生成带时间戳的转录
- 📝 **翻译** - 支持翻译为英文

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install openai-whisper-api
```

### 2. 配置 API Key

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置：

```json
{
  "openai": {
    "apiKey": "YOUR_OPENAI_API_KEY"
  }
}
```

---

## 💡 使用示例

### 基础转录

```bash
# 转录音频文件
whisper transcribe --file audio.mp3 --output transcript.txt

# 转录视频中的音频
whisper transcribe --file video.mp4 --output transcript.txt
```

### 高级选项

```bash
# 指定语言
whisper transcribe --file audio.mp3 --language zh

# 生成带时间戳
whisper transcribe --file audio.mp3 --timestamps

# 翻译为英文
whisper translate --file audio.mp3 --output translated.txt
```

### 批量处理

```bash
# 批量转录
for file in recordings/*.mp3; do
  whisper transcribe --file "$file" --output "${file%.mp3}.txt"
done
```

---

## 🔧 高级用法

### 模型选择

| 模型 | 速度 | 精度 | 适用场景 |
|------|------|------|----------|
| tiny | 最快 | 一般 | 快速测试 |
| base | 快 | 好 | 日常使用 |
| small | 中 | 很好 | 正式使用 |
| medium | 慢 | 优秀 | 高精度需求 |
| large | 最慢 | 最佳 | 专业场景 |

### API 调用

```javascript
// 使用 API 转录
const transcription = await whisper.transcribe({
  file: 'audio.mp3',
  model: 'whisper-1',
  language: 'zh',
  response_format: 'verbose_json'
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **选择合适模型** - 平衡速度和精度
2. **音频质量** - 使用清晰音频提高精度
3. **分段处理** - 长音频分段处理
4. **成本管控** - 监控 API 使用量

### 避免踩坑

1. **注意时长限制** - 单文件最大 25MB
2. **网络稳定** - 大文件需要稳定网络
3. **隐私保护** - 敏感内容谨慎上传

---

## 📊 效果评估

### 性能指标

| 指标 | 数值 |
|------|------|
| 中文识别准确率 | 95%+ |
| 英文识别准确率 | 98%+ |
| 处理速度 | 1 分钟音频/10 秒 |
| 支持语言 | 100+ |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/openai-whisper-api)
- [Whisper API 文档](https://platform.openai.com/docs/guides/speech-to-text)
- [定价信息](https://openai.com/pricing)

---

## 💬 用户评价

> "转录准确率很高，会议记录神器"  
> —— 产品经理

> "多语言支持很强大"  
> —— 翻译人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
