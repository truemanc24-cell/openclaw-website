# 快速开始

**目标**：从零开始，最短时间内完成首次聊天

> 💡 **最快的聊天方式**：打开控制面板（无需配置渠道）
> 
> 运行 `openclaw dashboard` 然后在浏览器中聊天，或在网关主机上访问 `http://127.0.0.1:18789/`
> 
> 文档：[控制面板](/web/dashboard) 和 [Web 界面](/web/control-ui)

---

## 前置要求

- **Node 24** 推荐（Node 22 LTS，目前 `22.16+`，仍支持兼容）

> 💡 如果不确定 Node 版本，运行 `node --version` 检查

---

## 快速设置（CLI）

### 步骤 1：安装 OpenClaw（推荐）

**macOS/Linux**:
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell)**:
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

> 📝 其他安装方法和要求：[安装指南](/install)

### 步骤 2：运行引导向导

```bash
openclaw onboard --install-daemon
```

向导会配置认证、网关设置和可选渠道。  
详情：[引导向导](/start/wizard)

### 步骤 3：检查网关

如果安装了服务，它应该已经在运行：

```bash
openclaw gateway status
```

### 步骤 4：打开控制面板

```bash
openclaw dashboard
```

✅ **检查**：如果控制面板加载成功，你的 Gateway 已经可以使用了

---

## 可选检查和额外功能

### 前台运行网关

用于快速测试或故障排除：

```bash
openclaw gateway --port 18789
```

### 发送测试消息

需要已配置的渠道：

```bash
openclaw message send --target +15555550123 --message "Hello from OpenClaw"
```

---

## 有用的环境变量

如果你以服务账户运行 OpenClaw 或想要自定义配置/状态位置：

| 变量 | 说明 |
|------|------|
| `OPENCLAW_HOME` | 设置用于内部路径解析的主目录 |
| `OPENCLAW_STATE_DIR` | 覆盖状态目录 |
| `OPENCLAW_CONFIG_PATH` | 覆盖配置文件路径 |

完整环境变量参考：[环境变量](/help/environment)

---

## 深入了解

### 📖 引导向导（详情）
[完整 CLI 向导参考和高级选项](/start/wizard)

### 🍎 macOS 应用引导
[macOS 应用首次运行流程](/start/onboarding)

---

## 你将拥有

- ✅ 运行中的 Gateway
- ✅ 配置好的认证
- ✅ 控制面板访问或已连接的渠道

---

## 下一步

- 📋 **DM 安全和审批**: [配对指南](/channels/pairing)
- 📱 **连接更多渠道**: [渠道配置](/channels)
- 🔧 **高级工作流和源码安装**: [设置指南](/start/setup)

---

**翻译完成时间**: 2026-03-15 00:30  
**来源**: https://docs.openclaw.ai/start/getting-started  
**状态**: ✅ 已完成
