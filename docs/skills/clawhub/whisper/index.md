# Whisper

**技能名**: `whisper`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Whisper 技能使用本地 Whisper 模型进行语音转文字，无需 API Key，保护隐私。

### 核心功能

- 🎤 **本地转写** - 本地运行无需 API
- 🔒 **隐私保护** - 数据不出本地
- 🌍 **多语言** - 支持多种语言
- 📝 **多种格式** - 支持多种输出格式

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install whisper
```

### 2. 安装模型

```bash
# 安装基础模型
whisper install-model --size base

# 安装大模型（更高精度）
whisper install-model --size large
```

---

## 💡 使用示例

### 基础转写

```bash
# 转写音频
whisper transcribe --file audio.mp3

# 指定语言
whisper transcribe --file audio.mp3 --language zh

# 输出为 SRT
whisper transcribe --file audio.mp3 --output-format srt
```

### 批量处理

```bash
# 批量转写
whisper transcribe --files recordings/*.mp3 --output transcripts/

# 从视频提取音频并转写
whisper transcribe --file video.mp4 --extract-audio
```

### 实时转写

```bash
# 实时麦克风输入
whisper live --device microphone

# 实时系统音频
whisper live --device system
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| transcribe | 转写 | `whisper transcribe --file x.mp3` |
| live | 实时转写 | `whisper live --device mic` |
| install-model | 安装模型 | `whisper install-model --size base` |
| translate | 翻译 | `whisper translate --file x.mp3` |

### 模型选择

| 模型 | 大小 | 速度 | 精度 |
|------|------|------|------|
| tiny | 39M | 最快 | 一般 |
| base | 74M | 快 | 好 |
| small | 244M | 中 | 很好 |
| medium | 769M | 慢 | 优秀 |
| large | 1550M | 最慢 | 最佳 |

---

## ⚠️ 注意事项

### 最佳实践

1. **选择模型** - 根据需求选择大小
2. **音频质量** - 使用清晰音频
3. **降噪处理** - 预处理降噪
4. **分段处理** - 长音频分段

### 避免踩坑

1. **硬件要求** - 大模型需要 GPU
2. **处理时间** - 长音频耗时较长
3. **方言支持** - 方言识别率可能较低

---

## 📊 效果评估

### 性能指标

| 指标 | 数值 |
|------|------|
| 中文识别准确率 | 95%+ |
| 英文识别准确率 | 98%+ |
| 处理速度 | 实时 0.5x-2x |
| 支持语言 | 100+ |

---

## 🔗 相关资源

- [OpenAI Whisper](https://github.com/openai/whisper)
- [本地 Whisper 部署](https://clawhub.ai/docs/whisper-local)
- [语音识别最佳实践](https://clawhub.ai/docs/speech-recognition)

---

## 💬 用户评价

> "本地转写保护隐私，很放心"  
> —— 企业用户

> "准确率很高，会议记录神器"  
> —— 产品经理

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
