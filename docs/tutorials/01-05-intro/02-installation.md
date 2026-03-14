# 环境准备和安装 - 从零开始部署 OpenClaw

**教程编号**: 02  
**优先级**: P0  
**预估阅读时间**: 12 分钟  
**目标读者**: 准备安装 OpenClaw 的新手

---

## 2.1 系统要求

### 操作系统支持

OpenClaw 支持主流操作系统，但不同平台的安装体验有所差异。

| 操作系统 | 版本要求 | 支持程度 | 推荐度 |
|----------|----------|----------|--------|
| **macOS** | 12.0+ (Monterey) | ⭐⭐⭐⭐⭐ | 强烈推荐 |
| **Linux** | Ubuntu 20.04+ / Debian 11+ | ⭐⭐⭐⭐⭐ | 强烈推荐 |
| **Windows** | 10/11 (WSL2) | ⭐⭐⭐⭐ | 推荐（WSL2） |
| **Windows** | 10/11 (原生 PowerShell) | ⭐⭐⭐ | 可用 |

**为什么 macOS/Linux 更推荐？**

OpenClaw 的守护进程（daemon）使用系统原生的服务管理工具：
- **macOS**: LaunchAgent（launchctl）
- **Linux**: systemd
- **Windows**: 需要额外配置，建议使用 WSL2

### 硬件最低配置

| 组件 | 最低要求 | 推荐配置 | 说明 |
|------|----------|----------|------|
| **CPU** | Intel i5 / Apple M1 | M2 / i7+ | 本地模型需要更强 CPU |
| **内存** | 8 GB | 16 GB+ | 多 Agent 需要更多内存 |
| **存储** | 10 GB 可用空间 | 50 GB+ | 会话历史、缓存、模型 |
| **网络** | 宽带连接 | 稳定宽带 | API 调用需要网络 |

**检查你的配置**：

```bash
# macOS/Linux - 检查内存
free -h

# macOS - 检查存储
df -h ~

# Linux - 检查存储
df -h /home

# 所有平台 - 检查 Node.js 版本
node --version
```

### 特殊场景配置

#### 场景 1：仅使用云模型（推荐新手）

如果你只使用 Claude、GPT-4 等云模型：
- **CPU**: 任意双核
- **内存**: 4 GB 足够
- **存储**: 5 GB 可用空间
- **网络**: 稳定互联网连接

#### 场景 2：运行本地模型

如果你想运行 Ollama、vLLM 等本地模型：
- **CPU**: M2 / i7+（8 核+）
- **内存**: 16 GB+（32 GB 推荐）
- **存储**: 50 GB+（模型文件很大）
- **GPU**: 可选（NVIDIA/Apple Silicon 加速）

#### 场景 3：企业部署

生产环境部署：
- **CPU**: 8 核+
- **内存**: 32 GB+
- **存储**: SSD，100 GB+
- **网络**: 固定 IP，开放必要端口
- **备份**: 独立存储或云存储

---

## 2.2 前置依赖安装

### Node.js 22+ 安装

OpenClaw 基于 Node.js 开发，需要 Node.js 22 或更高版本。

#### macOS 安装（推荐：Homebrew）

```bash
# 1. 安装 Homebrew（如果还没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装 Node.js 22
brew install node@22

# 3. 验证安装
node --version
# 应该输出：v22.x.x

npm --version
# 应该输出：10.x.x
```

#### Linux 安装（推荐：nvm）

```bash
# 1. 安装 nvm（Node 版本管理器）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. 重新加载配置
source ~/.bashrc
# 或
source ~/.zshrc

# 3. 安装 Node.js 22
nvm install 22

# 4. 设为默认版本
nvm alias default 22

# 5. 验证安装
node --version
npm --version
```

#### Windows 安装（WSL2 推荐）

**方法 1：WSL2（推荐）**

```bash
# 1. 安装 WSL2（在 PowerShell 管理员模式）
wsl --install

# 2. 重启电脑后，进入 WSL2
wsl

# 3. 在 WSL2 中安装 Node.js（参考 Linux 步骤）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm alias default 22

# 4. 验证
node --version
```

**方法 2：原生 Windows**

```powershell
# 1. 下载 Node.js 22 LTS
# 访问：https://nodejs.org/

# 2. 运行安装程序，按照向导完成

# 3. 重启 PowerShell，验证
node --version
npm --version
```

#### 验证安装成功

运行以下命令，确认所有依赖就绪：

```bash
# 检查 Node.js 版本（应该 >= 22.0.0）
node --version

# 检查 npm 版本（应该 >= 10.0.0）
npm --version

# 检查全局包安装权限
npm config get prefix

# 如果是 /usr，可能需要修复权限
# macOS/Linux:
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### 常见问题：权限问题

#### 问题 1：npm install 提示权限错误

**错误信息**：
```
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/openclaw'
```

**解决方案**：

```bash
# 方法 1：修复 npm 权限（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 方法 2：使用 nvm（最推荐）
# 参考上面的 nvm 安装步骤

# 方法 3：临时使用 sudo（不推荐，但可行）
sudo npm install -g openclaw
```

#### 问题 2：Node.js 版本冲突

**错误信息**：
```
Error: OpenClaw requires Node.js 22 or higher. Current version: v18.17.0
```

**解决方案**：

```bash
# 如果使用 nvm
nvm install 22
nvm use 22
nvm alias default 22

# 如果使用 Homebrew
brew upgrade node@22

# 如果使用官方安装包
# 卸载旧版本，重新安装 v22
```

#### 问题 3：网络问题导致安装失败

**错误信息**：
```
npm ERR! network request failed
npm ERR! code ECONNRESET
```

**解决方案**：

```bash
# 使用国内镜像（中国大陆推荐）
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry

# 重试安装
npm install -g openclaw
```

---

## 2.3 一键安装

### macOS/Linux 安装命令详解

**标准安装命令**：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**命令拆解**：

| 部分 | 说明 |
|------|------|
| `curl` | 下载工具 |
| `-f` | 失败时静默（fail silently） |
| `-s` | 静默模式（silent） |
| `-S` | 显示错误（show errors） |
| `-L` | 跟随重定向（follow redirects） |
| `https://openclaw.ai/install.sh` | 安装脚本 URL |
| `| bash` | 管道传递给 bash 执行 |

**安装过程逐行解读**：

```bash
# 1. 检查 Node.js 版本
Checking Node.js version...
✓ Node.js v22.11.0 is installed

# 2. 检查 npm 权限
Checking npm permissions...
✓ npm prefix: /home/user/.npm-global

# 3. 下载 OpenClaw
Downloading OpenClaw...
✓ Downloaded openclaw@1.2.3

# 4. 全局安装
Installing globally...
✓ Installed openclaw to /home/user/.npm-global/bin

# 5. 验证安装
Verifying installation...
✓ OpenClaw v1.2.3 installed successfully

# 6. 创建主目录
Creating home directory...
✓ Created ~/.openclaw

# 7. 生成默认配置
Generating default configuration...
✓ Created ~/.openclaw/openclaw.json

# 8. 完成
Installation complete!

Next steps:
1. Run 'openclaw onboard' to configure
2. Or run 'openclaw --help' to see all commands
```

### Windows PowerShell 安装

**标准安装命令**：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**命令拆解**：

| 部分 | 说明 |
|------|------|
| `iwr` | Invoke-WebRequest（PowerShell 的 curl） |
| `-useb` | UseBasicParsing（简化输出） |
| `https://openclaw.ai/install.ps1` | 安装脚本 URL |
| `|` | 管道 |
| `iex` | Invoke-Expression（执行脚本） |

**安装过程**：

```powershell
# PowerShell 输出示例
OpenClaw Installer for Windows
==============================

Checking prerequisites...
✓ Node.js v22.11.0 found
✓ npm 10.2.4 found

Downloading OpenClaw...
Installing...

✓ OpenClaw installed successfully!

Add OpenClaw to PATH:
  $env:Path += ";C:\Users\Trueman\AppData\Roaming\npm"

Run 'openclaw --help' to get started.
```

### 安装目录结构说明

安装完成后，OpenClaw 会创建以下目录结构：

```
~/.openclaw/
├── openclaw.json           # 主配置文件
├── auth-profiles.json      # 认证信息（API Keys 等）
├── agents/                 # Agent 配置目录
│   └── main/
│       └── agent/
│           ├── SOUL.md
│           ├── AGENTS.md
│           ├── TOOLS.md
│           └── memory/
├── workspace/              # 默认工作空间
│   ├── sessions/           # 会话历史
│   └── files/              # 工作文件
├── skills/                 # 已安装的技能
└── logs/                   # 日志文件
```

**重要文件说明**：

| 文件/目录 | 用途 | 是否可手动编辑 |
|-----------|------|----------------|
| `openclaw.json` | 主配置 | ✅ 是（推荐用 CLI） |
| `auth-profiles.json` | 敏感认证信息 | ⚠️ 谨慎编辑 |
| `agents/main/` | 主 Agent 配置 | ✅ 是 |
| `workspace/` | 会话和文件 | ✅ 是 |
| `skills/` | 扩展技能 | ⚠️ 自动管理 |
| `logs/` | 运行日志 | ❌ 只读查看 |

### 自定义安装路径

默认情况下，OpenClaw 安装在 `~/.openclaw/`。如需自定义：

```bash
# 方法 1：使用环境变量（安装前设置）
export OPENCLAW_HOME=~/MyOpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# 方法 2：安装后移动（不推荐）
# 需要修改所有配置文件中的路径引用
```

**环境变量说明**：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `OPENCLAW_HOME` | 主目录 | `~/.openclaw` |
| `OPENCLAW_STATE_DIR` | 状态目录 | `$OPENCLAW_HOME/state` |
| `OPENCLAW_CONFIG_PATH` | 配置文件路径 | `$OPENCLAW_HOME/openclaw.json` |

---

## 2.4 验证安装

### 检查 OpenClaw 版本

```bash
# 检查版本
openclaw --version
# 输出：1.2.3

# 检查详细版本信息
openclaw --version --verbose
# 输出：
# OpenClaw CLI: 1.2.3
# Node.js: v22.11.0
# Platform: darwin arm64
# Build: 2026-03-10
```

### 检查网关状态

```bash
# 检查网关状态（首次安装应该是 stopped）
openclaw gateway status

# 输出示例：
# Gateway Status: stopped
# Port: 18789
# Bind: 127.0.0.1
# Auth: token (configured)
# Daemon: not installed
```

**状态说明**：

| 状态 | 说明 | 下一步 |
|------|------|--------|
| `stopped` | 网关未运行 | 运行 `openclaw onboard` |
| `running` | 网关正在运行 | 可以开始使用 |
| `error` | 网关启动失败 | 查看日志排查 |

### 第一个测试命令

```bash
# 查看帮助
openclaw --help

# 输出示例：
# OpenClaw CLI - AI Gateway for Everyone
#
# Usage: openclaw <command> [options]
#
# Commands:
#   onboard       运行配置向导
#   gateway       管理网关服务
#   dashboard     打开控制面板
#   channels      管理聊天渠道
#   agents        管理 AI 智能体
#   nodes         管理设备节点
#   skills        管理扩展技能
#   configure     重新运行配置
#   doctor        诊断问题
#
# Run 'openclaw <command> --help' for more information.
```

### 测试命令执行

```bash
# 测试基本功能
openclaw doctor

# 输出示例：
# OpenClaw Health Check
# =====================
#
# ✓ Node.js version: v22.11.0 (required: >=22.0.0)
# ✓ OpenClaw CLI: v1.2.3
# ✓ Home directory: ~/.openclaw (writable)
# ✓ Configuration: ~/.openclaw/openclaw.json (valid)
# ✓ Workspace: ~/.openclaw/workspace (exists)
# ⚠ Gateway: not running
# ⚠ Channels: not configured
#
# Recommendations:
# 1. Run 'openclaw onboard' to complete setup
# 2. Configure at least one channel for messaging
```

### 故障排查：安装失败的常见原因

#### 问题 1：命令未找到

**错误信息**：
```
bash: openclaw: command not found
```

**原因**：npm 全局 bin 目录不在 PATH 中

**解决方案**：

```bash
# 1. 查找 openclaw 安装位置
npm bin -g
# 输出：/home/user/.npm-global/bin

# 2. 添加到 PATH（临时）
export PATH=$(npm bin -g):$PATH

# 3. 添加到 PATH（永久）
echo 'export PATH=$(npm bin -g):$PATH' >> ~/.bashrc
source ~/.bashrc

# 4. 验证
openclaw --version
```

#### 问题 2：权限拒绝

**错误信息**：
```
Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
```

**解决方案**：参考 2.2 节的"常见问题：权限问题"

#### 问题 3：网络超时

**错误信息**：
```
npm ERR! code ETIMEDOUT
npm ERR! syscall connect
npm ERR! errno ETIMEDOUT
```

**解决方案**：

```bash
# 1. 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 2. 增加超时时间
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

# 3. 重试安装
npm install -g openclaw

# 4. 如果还不行，手动下载
curl -fsSL https://openclaw.ai/install.sh -o install.sh
bash install.sh
```

#### 问题 4：配置文件损坏

**错误信息**：
```
Error: Invalid configuration file: ~/.openclaw/openclaw.json
```

**解决方案**：

```bash
# 1. 备份损坏的配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# 2. 删除配置，重新生成
rm ~/.openclaw/openclaw.json

# 3. 运行向导重新配置
openclaw onboard
```

---

## 2.5 环境变量配置

### 何时需要自定义环境变量？

大多数用户不需要设置环境变量，使用默认配置即可。

**需要自定义的场景**：

| 场景 | 需要设置的变量 | 说明 |
|------|----------------|------|
| 自定义安装路径 | `OPENCLAW_HOME` | 不想用 `~/.openclaw` |
| 多实例部署 | `OPENCLAW_CONFIG_PATH` | 运行多个独立 OpenClaw |
| 企业部署 | `OPENCLAW_STATE_DIR` | 状态数据存储到独立磁盘 |
| 开发测试 | 全部 | 隔离测试环境 |

### OPENCLAW_HOME - 自定义主目录

**默认值**：`~/.openclaw`

**设置方法**：

```bash
# 临时设置（当前终端会话有效）
export OPENCLAW_HOME=~/MyOpenClaw

# 永久设置（添加到 shell 配置）
echo 'export OPENCLAW_HOME=~/MyOpenClaw' >> ~/.bashrc
source ~/.bashrc

# 验证
echo $OPENCLAW_HOME
# 输出：/home/user/MyOpenClaw

# 安装 OpenClaw（会使用新的主目录）
curl -fsSL https://openclaw.ai/install.sh | bash
```

**使用场景**：
- 主目录空间不足，想安装到其他磁盘
- 多用户共享一台机器，各自独立配置
- 开发环境隔离

### OPENCLAW_STATE_DIR - 状态目录

**默认值**：`$OPENCLAW_HOME/state`

**用途**：存储会话历史、缓存、临时文件

**设置方法**：

```bash
# 设置到独立磁盘（性能更好）
export OPENCLAW_STATE_DIR=/mnt/ssd/openclaw-state

# 设置到内存盘（极致性能，重启丢失）
export OPENCLAW_STATE_DIR=/dev/shm/openclaw-state
```

**使用场景**：
- 会话数据量大，想存储到高速磁盘
- 主目录是网络存储，性能差
- 测试场景，使用内存盘加速

### OPENCLAW_CONFIG_PATH - 配置文件路径

**默认值**：`$OPENCLAW_HOME/openclaw.json`

**用途**：指定配置文件位置

**设置方法**：

```bash
# 使用独立配置文件
export OPENCLAW_CONFIG_PATH=~/.openclaw-configs/work.json

# 多配置切换
alias openclaw-work='OPENCLAW_CONFIG_PATH=~/.openclaw-configs/work.json openclaw'
alias openclaw-personal='OPENCLAW_CONFIG_PATH=~/.openclaw-configs/personal.json openclaw'
```

**使用场景**：
- 多套配置快速切换（工作/个人）
- 配置文件版本控制（Git 管理）
- 企业部署，集中管理配置

### 完整配置示例

```bash
# ~/.bashrc 或 ~/.zshrc

# 工作环境的 OpenClaw 配置
export OPENCLAW_HOME=~/OpenClaw-Work
export OPENCLAW_STATE_DIR=/mnt/nvme/openclaw-work-state
export OPENCLAW_CONFIG_PATH=~/.openclaw-configs/work.json

# 个人环境的 OpenClaw 配置（通过别名切换）
alias openclaw-personal='OPENCLAW_HOME=~/OpenClaw-Personal OPENCLAW_CONFIG_PATH=~/.openclaw-configs/personal.json openclaw'
```

**使用方式**：

```bash
# 使用工作配置
openclaw gateway status

# 切换到个人配置
openclaw-personal gateway status
```

### 环境变量优先级

OpenClaw 读取配置的优先级：

```
1. 命令行参数（最高优先级）
   openclaw --config /path/to/config.json

2. 环境变量
   OPENCLAW_CONFIG_PATH=/path/to/config.json openclaw

3. 默认路径（最低优先级）
   ~/.openclaw/openclaw.json
```

---

## 小结

### 安装检查清单

- [ ] Node.js 22+ 已安装（`node --version`）
- [ ] npm 10+ 已安装（`npm --version`）
- [ ] OpenClaw CLI 已安装（`openclaw --version`）
- [ ] 主目录已创建（`~/.openclaw/`）
- [ ] 配置文件已生成（`~/.openclaw/openclaw.json`）
- [ ] 命令可以正常执行（`openclaw --help`）

### 下一步

安装完成后，需要运行配置向导完成初始设置：

**阅读下一篇**：[教程 03: 运行向导配置 - 10 分钟完成初始设置](./03-wizard.md)

---

## 配图建议

### 图 1：安装流程图

**内容**：
```
1. 检查 Node.js → 2. 下载安装脚本 → 3. 执行安装 → 4. 验证安装
     ↓                    ↓                   ↓                  ↓
 node --version      curl install.sh      | bash          openclaw --version
```

**用途**：2.3 节开头，概览安装步骤

### 图 2：目录结构树状图

**内容**：
```
~/.openclaw/
├── openclaw.json (配置)
├── auth-profiles.json (认证)
├── agents/ (Agent 配置)
├── workspace/ (工作空间)
├── skills/ (技能)
└── logs/ (日志)
```

**用途**：2.3 节，解释安装后的目录结构

### 图 3：终端截图集合

**内容**：
- 截图 1：`openclaw --version` 输出
- 截图 2：`openclaw gateway status` 输出
- 截图 3：`openclaw doctor` 输出
- 截图 4：`openclaw --help` 输出

**用途**：2.4 节，展示实际命令输出

### 图 4：环境变量配置示意图

**内容**：
- 左侧：默认配置（单一路径）
- 右侧：多配置切换（工作/个人）
- 用箭头标注环境变量如何影响配置加载

**用途**：2.5 节，解释环境变量的作用

---

## 代码示例汇总

### 1. macOS 安装 Node.js
```bash
brew install node@22
node --version
```

### 2. Linux 安装 Node.js（nvm）
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm alias default 22
```

### 3. Windows WSL2 安装
```powershell
wsl --install
```
```bash
# 在 WSL2 中
nvm install 22
```

### 4. 一键安装 OpenClaw
```bash
# macOS/Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### 5. 验证安装
```bash
openclaw --version
openclaw gateway status
openclaw doctor
openclaw --help
```

### 6. 配置环境变量
```bash
# 临时设置
export OPENCLAW_HOME=~/MyOpenClaw

# 永久设置
echo 'export OPENCLAW_HOME=~/MyOpenClaw' >> ~/.bashrc
source ~/.bashrc
```

### 7. 修复 npm 权限
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 8. 使用国内镜像
```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
```

---

**字数统计**: 约 5,200 字  
**完成时间**: 2026-03-14  
**作者**: OpenClaw 文档团队  
**审阅状态**: 初稿
