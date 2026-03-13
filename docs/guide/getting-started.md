# 快速开始

## 安装

### 前置要求
- Node.js 18+ 
- npm 或 yarn
- macOS / Linux / Windows

### 安装 OpenClaw

```bash
# 使用 npm 全局安装
npm install -g openclaw

# 验证安装
openclaw --version
```

## 初始化配置

```bash
# 初始化配置目录
openclaw init

# 编辑配置文件
openclaw config edit
```

## 配置模型

在 `~/.openclaw/openclaw.json` 中配置你的 AI 模型：

```json
{
  "model": "your-preferred-model",
  "apiKey": "your-api-key"
}
```

## 启动

```bash
# 启动 Gateway 服务
openclaw gateway start

# 查看状态
openclaw gateway status
```

## 验证安装

启动后，你可以通过 Web 界面或 API 与 OpenClaw 交互。

## 下一步

- [配置指南](/guide/configuration) - 详细配置选项
- [技能开发](/guide/skills) - 创建自定义技能
