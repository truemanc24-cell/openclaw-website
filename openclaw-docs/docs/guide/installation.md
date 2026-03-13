# 安装指南

## 系统要求

- Node.js >= 18
- npm >= 9
- macOS / Linux / Windows

## 安装步骤

### 1. 安装 Node.js

```bash
# macOS
brew install node

# Linux
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# 下载 https://nodejs.org/
```

### 2. 安装 OpenClaw

```bash
npm install -g openclaw
```

### 3. 验证安装

```bash
openclaw --version
```

### 4. 初始化配置

```bash
openclaw init
```

## 配置飞书

1. 访问 https://open.feishu.cn/
2. 创建企业自建应用
3. 配置机器人权限
4. 获取 App ID 和 Secret
5. 添加到 `openclaw.json`

## 启动 Gateway

```bash
openclaw gateway start
```

## 验证

访问 http://127.0.0.1:18789/ 查看 Dashboard。
