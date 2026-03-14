# 安装指南

> ## 文档索引
> 获取完整文档索引：https://docs.openclaw.ai/llms.txt

---

## 系统要求

- **Node 24（推荐）**（Node 22 LTS，目前 `22.16+`，仍支持兼容）
- macOS、Linux 或 Windows
- 仅当从源码构建时需要 `pnpm`

> 💡 **Windows 用户注意**：强烈建议在 [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) 下运行 OpenClaw

---

## 安装方法

> 💡 **安装脚本** 是推荐的安装方式。它一次性处理 Node 检测、安装和引导。

> ⚠️ **VPS/云服务器用户**：避免使用第三方"一键"市场镜像。优先使用干净的基础 OS 镜像（如 Ubuntu LTS），然后用安装脚本自行安装 OpenClaw。

### 方法 1：安装脚本（推荐）

下载 CLI，通过 npm 全局安装，并启动引导向导。

**macOS / Linux / WSL2**:
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell)**:
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

完成！脚本自动处理 Node 检测、安装和引导。

**跳过引导，仅安装二进制文件**：

**macOS / Linux / WSL2**:
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Windows (PowerShell)**:
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

所有标志、环境变量和 CI/自动化选项，查看 [安装器内部](/install/installer)

---

### 方法 2：npm / pnpm

如果你已经自己管理 Node，推荐 Node 24。OpenClaw 仍支持 Node 22 LTS（目前 `22.16+`）以保持兼容：

**npm**:
```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

> 🔧 **遇到 sharp 构建错误？**
> 
> 如果全局安装了 libvips（macOS 通过 Homebrew 常见）且 `sharp` 失败，强制使用预构建二进制：
> 
> ```bash
> SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
> ```
> 
> 如果看到 `sharp: Please add node-gyp to your dependencies`，安装构建工具（macOS: Xcode CLT + `npm install -g node-gyp`）或使用上面的环境变量。

**pnpm**:
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g        # 批准 openclaw, node-llama-cpp, sharp 等
openclaw onboard --install-daemon
```

> 💡 pnpm 需要对有构建脚本的包进行显式批准。首次安装显示 "Ignored build scripts" 警告后，运行 `pnpm approve-builds -g` 并选择列出的包。

---

### 方法 3：从源码

适合贡献者或想从本地签出运行的人。

**步骤 1：克隆并构建**
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

**步骤 2：链接 CLI**
```bash
pnpm link --global
```

或者，跳过链接，在 repo 内通过 `pnpm openclaw ...` 运行命令。

**步骤 3：运行引导**
```bash
openclaw onboard --install-daemon
```

更深层的开发工作流，查看 [设置指南](/start/setup)

---

## 其他安装方法

| 方法 | 说明 |
|------|------|
| 🐳 **Docker** | 容器化或无头部署 |
| 🐳 **Podman** | 无根容器：运行一次 `setup-podman.sh`，然后运行启动脚本 |
| ❄️ **Nix** | 通过 Nix 声明式安装 |
| 🤖 **Ansible** | 自动化集群配置 |
| ⚡ **Bun** | 通过 Bun 运行时仅使用 CLI |

---

## 安装后

验证一切正常：

```bash
openclaw doctor         # 检查配置问题
openclaw status         # 网关状态
openclaw dashboard      # 打开浏览器 UI
```

如果需要自定义运行时路径，使用：

- `OPENCLAW_HOME` - 主目录内部路径
- `OPENCLAW_STATE_DIR` - 可变状态位置
- `OPENCLAW_CONFIG_PATH` - 配置文件位置

查看 [环境变量](/help/environment) 了解优先级和完整详情。

---

## 故障排除：`openclaw` 找不到

### PATH 诊断和修复

**快速诊断**：
```bash
node -v
npm -v
npm prefix -g
echo "$PATH"
```

如果 `$(npm prefix -g)/bin`（macOS/Linux）或 `$(npm prefix -g)`（Windows）**不在** `$PATH` 中，你的 shell 找不到全局 npm 二进制文件（包括 `openclaw`）。

**修复** - 添加到 shell 启动文件（`~/.zshrc` 或 `~/.bashrc`）：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Windows 上，将 `npm prefix -g` 的输出添加到 PATH。

然后打开新终端（或 zsh 中 `rehash` / bash 中 `hash -r`）。

---

## 更新 / 卸载

| 主题 | 链接 |
|------|------|
| 🔄 **更新** | [更新指南](/install/updating) - 保持 OpenClaw 最新 |
| ➡️ **迁移** | [迁移指南](/install/migrating) - 移动到新机器 |
| 🗑️ **卸载** | [卸载指南](/install/uninstall) - 完全移除 OpenClaw |

---

**翻译完成时间**: 2026-03-15 00:32  
**来源**: https://docs.openclaw.ai/install  
**状态**: ✅ 已完成
