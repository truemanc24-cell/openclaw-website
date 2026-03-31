---
title: wizard
description: wizard 页面
---

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw onboard
```

<Info>
  最快开始聊天：打开控制界面（无需设置渠道）。运行
  `openclaw dashboard` 并在浏览器中聊天。文档：[控制面板](/web/dashboard)。
</Info>

后续重新配置：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw configure
openclaw agents add <name>
```

<Note>
  `--json` 并不意味着非交互模式。对于脚本，请使用 `--non-interactive`。
</Tip>

<Tip>
  CLI 入职引导包含一个网络搜索步骤，你可以选择提供商
  （Perplexity、Brave、Gemini、Grok 或 Kimi）并粘贴你的 API 密钥，以便代理能够
  使用 `web_search`。你也可以稍后使用
  `openclaw configure --section web` 进行配置。文档：[网络工具](/tools/web)。
</Tip>

## 快速开始 vs 高级模式

入职引导从**快速开始**（默认设置）或**高级模式**（完全控制）开始。

<Tabs>
  <Tab title="快速开始（默认）">
    * 本地网关（回环）
    * 工作区默认（或现有工作区）
    * 网关端口 **18789**
    * 网关认证 **Token**（自动生成，即使在回环模式下）
    * 新本地设置的工具策略默认：`tools.profile: "coding"`（现有明确配置会保留）
    * DM 隔离默认：本地入职引导在未设置时写入 `session.dmScope: "per-channel-peer"`。详情请参阅：[CLI 设置参考](/start/wizard-cli-reference#outputs-and-internals)
    * Tailscale 暴露 **关闭**
    * Telegram + WhatsApp DM 默认为**白名单**（系统会提示你输入手机号码）
  </Tab>

  <Tab title="高级模式（完全控制）">
    * 暴露每一步（模式、工作区、网关、渠道、守护进程、技能）。
  </Tab>
</Tabs>

## 入职引导配置的内容

**本地模式（默认）** 引导你完成以下步骤：

1. **模型/认证** — 选择任何支持的提供商/认证流程（API 密钥、OAuth 或设置 Token），包括自定义提供商
   （OpenAI 兼容、Anthropic 兼容或未知自动检测）。选择默认模型。
   安全提示：如果此代理将运行工具或处理 webhook/hooks 内容，请优先选择最强的最新一代模型，并保持严格的工具策略。较弱/较老的层级更容易受到提示注入。
   对于非交互式运行，`--secret-input-mode ref` 将 env 支持的引用存储在认证配置文件中，而不是明文 API 密钥值。
   在非交互式 `ref` 模式下，必须设置提供商环境变量；未设置该环境变量而传递内联密钥标志会快速失败。
   在交互式运行中，选择 secret reference 模式让你可以指向环境变量或配置的提供商引用（`file` 或 `exec`），并在保存前进行快速预验证。
2. **工作区** — 代理文件的位置（默认 `~/.openclaw/workspace`）。填充引导文件。
3. **网关** — 端口、绑定地址、认证模式、Tailscale 暴露。
   在交互式 token 模式中，选择默认明文 token 存储或选择加入 SecretRef。
   非交互式 token SecretRef 路径：`--gateway-token-ref-env <ENV_VAR>`。
4. **渠道** — WhatsApp、Telegram、Discord、Google Chat、Mattermost、Signal、BlueBubbles 或 iMessage。
5. **守护进程** — 安装 LaunchAgent（macOS）或 systemd 用户单元（Linux/WSL2）。
   如果 token 认证需要 token 且 `gateway.auth.token` 由 SecretRef 管理，守护进程安装会验证它但不会将解析后的 token 持久化到监管服务环境元数据中。
   如果 token 认证需要 token 且配置的 token SecretRef 未解析，守护进程安装会被阻止，并提供可操作的指导。
   如果同时配置了 `gateway.auth.token` 和 `gateway.auth.password` 且 `gateway.auth.mode` 未设置，守护进程安装会被阻止，直到模式被明确设置。
6. **健康检查** — 启动网关并验证其运行状态。
7. **技能** — 安装推荐的技能和可选依赖项。

<Note>
  重新运行入职引导**不会**清除任何内容，除非你明确选择**重置**（或传递 `--reset`）。
  CLI `--reset` 默认重置配置、凭据和会话；使用 `--reset-scope full` 可包含工作区。
  如果配置无效或包含遗留密钥，入职引导会要求你首先运行 `openclaw doctor`。
</Note>

**远程模式** 仅配置本地客户端连接到其他地方的网关。
它**不会**在远程主机上安装或更改任何内容。

## 添加另一个代理

使用 `openclaw agents add <name>` 创建一个具有独立工作区、
会话和认证配置文件的单独代理。运行时不带 `--workspace` 会启动入职引导。

设置内容：

* `agents.list[].name`
* `agents.list[].workspace`
* `agents.list[].agentDir`

注意：

* 默认工作区遵循 `~/.openclaw/workspace-<agentId>`。
* 添加 `bindings` 来路由入站消息（入职引导可以完成）。
* 非交互式标志：`--model`、`--agent-dir`、`--bind`、`--non-interactive`。

## 完整参考

有关详细的分步分解和配置输出，请参阅
[CLI 设置参考](/start/wizard-cli-reference)。
有关非交互式示例，请参阅 [CLI 自动化](/start/wizard-cli-automation)。
有关更深入的技术参考（包括 RPC 详情），请参阅
[入职引导参考](/reference/wizard)。

## 相关文档

* CLI 命令参考：[`openclaw onboard`](/cli/onboard)
* 入职引导概述：[入职引导概述](/start/onboarding-overview)
* macOS 应用入职引导：[入职引导](/start/onboarding)
* 代理首次运行仪式：[代理引导](/start/bootstrapping)


Built with [Mintlify](https://mintlify.com).