---
title: customer service kb
description: customer service kb 页面
---

# 🤖 AI 客服知识库

**最后更新**: 2026-03-29  
**版本**: v1.0

---

## 一、常见问题 (FAQ)

### 安装配置类

#### Q1: OpenClaw 是什么？
**A**: OpenClaw 是一个本地优先的 AI 助手框架，让你能在自己的电脑上运行强大的 AI 助手，同时连接到各种聊天平台（飞书、微信、Telegram 等）。

**核心特点**:
- 🏠 本地优先，数据隐私可控
- 🔌 多渠道支持
- 🧠 多 Agent 协作
- 🛠 可扩展技能系统

#### Q2: 如何安装 OpenClaw？
**A**: 
```bash
# 1. 确保 Node.js 22+ 已安装
node --version

# 2. 克隆项目
git clone https://github.com/openclaw/openclaw.git

# 3. 安装依赖
cd openclaw
npm install

# 4. 配置并启动
npm run dev
```

详细教程：[安装指南](/tutorials/02-installation.md)

#### Q3: 需要什么样的系统配置？
**A**: 
| 系统 | 要求 |
|------|------|
| macOS | 12.0+ (M 系列芯片推荐) |
| Linux | Ubuntu 20.04+ |
| Windows | 10/11 (PowerShell 管理员) |
| Node.js | 22 LTS 或更高 |
| 内存 | 最低 8GB，推荐 16GB+ |

#### Q4: 如何配置第一个聊天渠道？
**A**: 以飞书为例：
1. 创建飞书应用
2. 获取 App ID 和 App Secret
3. 配置机器人
4. 添加到配置文件

详细教程：[配置飞书渠道](/tutorials/102-configure-first-channel.md)

---

### Agent 相关

#### Q5: 什么是 Agent？
**A**: Agent 是 OpenClaw 中的智能体单元，每个 Agent 都有独立的身份、记忆、技能和配置。

**可用 Agent**:
- Main: 通用助手
- Dev: 代码开发
- Social: 社媒运营
- Learning: 学习助手
- Sales: 销售支持
- Cece: 增长策略

#### Q6: 如何创建新的 Agent？
**A**: 
```bash
# 1. 复制模板
cp -r ~/.openclaw/agents/main/agent ~/.openclaw/agents/my-agent/agent

# 2. 修改配置
# 编辑 SOUL.md, IDENTITY.md 等文件

# 3. 在 openclaw.json 中注册
```

#### Q7: Agent 之间如何通信？
**A**: 使用 `sessions_send` 或 `sessions_spawn` 进行 Agent 间通信。

---

### 技能系统

#### Q8: 什么是技能？
**A**: 技能是 OpenClaw 的可扩展功能模块，每个技能提供特定的能力（如搜索、文件处理、API 调用等）。

#### Q9: 如何安装技能？
**A**: 
```bash
# 使用 clawhub 安装
clawhub install skill-name

# 或手动安装
# 将技能文件夹放到 ~/.openclaw/skills/
```

#### Q10: 如何开发自己的技能？
**A**: 
1. 创建技能文件夹
2. 编写 SKILL.md 说明文档
3. 实现 index.ts 入口文件
4. 测试并分享

详细教程：[技能开发指南](/skills/github.md)

---

### 记忆系统

#### Q11: 记忆系统如何工作？
**A**: OpenClaw 使用两层记忆系统：
- **短期记忆**: 当前会话上下文
- **长期记忆**: MEMORY.md 文件，跨会话共享

#### Q12: 如何查看记忆？
**A**: 
```bash
# 查看长期记忆
cat ~/.openclaw/agents/main/agent/MEMORY.md

# 查看每日记忆
cat ~/.openclaw/agents/main/agent/memory/YYYY-MM-DD.md
```

---

### 故障排除

#### Q13: 启动失败怎么办？
**A**: 
1. 检查 Node.js 版本：`node --version`
2. 检查依赖：`npm install`
3. 查看日志：`npm run dev` 输出
4. 清除缓存：`rm -rf node_modules && npm install`

#### Q14: Agent 不响应怎么办？
**A**: 
1. 检查 Gateway 是否运行
2. 检查飞书 bot 配置
3. 查看日志文件
4. 重启 Gateway：`openclaw gateway restart`

#### Q15: 如何更新 OpenClaw？
**A**: 
```bash
# 拉取最新代码
git pull

# 更新依赖
npm install

# 重启 Gateway
openclaw gateway restart
```

---

## 二、快速链接

| 主题 | 链接 |
|------|------|
| 快速开始 | /tutorials/101-quick-start-guide.md |
| 安装指南 | /tutorials/02-installation.md |
| 配置渠道 | /tutorials/102-configure-first-channel.md |
| 核心概念 | /tutorials/103-core-concepts.md |
| 技能市场 | /skills/ |
| 关于 | /about.md |

---

## 三、联系支持

- **GitHub Issues**: https://github.com/openclaw/openclaw/issues
- **Discord**: https://discord.gg/clawd
- **邮箱**: openclaw.adsense@gmail.com

---

**客服知识库由 AI 自动维护，定期更新。**
