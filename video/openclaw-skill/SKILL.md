# AI 内容生成技能

为社交媒体免费生成图片和视频内容。

## 功能

- 🖼️ 图片生成：支持 Playground AI、Leonardo.ai 等免费服务
- 🎬 视频生成：支持智谱 AI CogVideo、Replicate 等
- 📊 配额查询：查看各服务商剩余额度
- 🔄 自动轮换：优先使用免费额度

## 使用方式

### 生成图片

```
帮我生成一张图片：一只可爱的猫咪在窗台上晒太阳
生成图片：赛博朋克城市夜景，霓虹灯闪烁
```

### 生成视频

```
生成视频：海浪拍打沙滩，4K 高清
创建视频：樱花花瓣随风飘落
```

### 查看配额

```
查看 AI 生成配额
还剩多少免费生成次数
```

## 配置

需要配置以下 API 密钥（在 CLI 工具目录的 `.env` 文件中）：

- `PLAYGROUND_API_KEY` - Playground AI（500 张/天）
- `LEONARDO_API_KEY` - Leonardo.ai（150 张/天）
- `ZHIPU_API_KEY` - 智谱 AI CogVideo（新用户赠送）
- `REPLICATE_API_TOKEN` - Replicate（$5 试用）

## 输出位置

生成的内容保存在：
```
~/Desktop/Mark/2026-03-12_OpenClaw_Website/video/ai-content-generator/outputs/
├── images/
│   └── YYYY-MM-DD/
└── videos/
    └── YYYY-MM-DD/
```

## 技术实现

基于 `ai-content-generator` CLI 工具，通过 `exec` 调用。

## 限制

- 免费额度有限，超出后需要等待次日重置或充值
- 视频生成可能需要较长时间（1-5 分钟）
- 高峰期免费服务可能需要排队

## 故障排除

如遇到 API 调用失败：
1. 检查 `.env` 文件中的 API 密钥是否正确
2. 运行 `python main.py quota` 查看配额状态
3. 尝试切换到其他服务商

---
**技能版本**: 0.1.0  
**创建日期**: 2026-03-14  
**依赖**: ai-content-generator CLI
