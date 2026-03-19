# OAuth

# OAuth

OpenClaw 通过 OAuth 支持提供商的"订阅认证"（特别是 **OpenAI Codex (ChatGPT OAuth)**。对于 Anthropic 订阅，请使用 **setup-token** 流程。Anthropic 订阅在 Claude Code 之外的 Usage 在过去对一些用户有限制，所以将其视为用户选择的风险，并自行验证当前的 Anthropic 策略。OpenAI Codex OAuth 明确支持在 OpenClaw 等外部工具中使用。本页解释：

对于生产环境中的 Anthropic，API 密钥认证是比订阅 setup-token 认证更安全的推荐路径。

* OAuth **令牌交换**的工作原理（PKCE）
* 令牌**存储**的位置（以及为什么）
* 如何处理**多个账户**（配置文件 + 每会话覆盖）

OpenClaw 还支持**提供商插件**，它们自带 OAuth 或 API 密钥流程。通过以下方式运行它们：

```bash
openclaw models auth login --provider <id>
```

## 令牌接收器（为什么存在）

OAuth 提供商在登录/刷新流程中通常会生成**新的刷新令牌**。某些提供商（或 OAuth 客户端）可以在为同一用户/应用发布新令牌时使旧的刷新令牌失效。

实际症状：
* 通过 OpenClaw 和 Claude Code / Codex CLI 登录 → 之后随机"注销"其中一个

为减少这种情况，OpenClaw 将 `auth-profiles.json` 视为**令牌接收器**：
* 运行时从**一个地方**读取凭据
* 我们可以保留多个配置文件并确定性路由

## 存储（令牌存储的位置）

机密按代理存储：

* 认证配置文件（OAuth + API 密钥 + 可选的值级引用）：`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`
* 旧版兼容文件：`~/.openclaw/agents/<agentId>/agent/auth.json`（静态 `api_key` 条目在发现时被清理）

旧版仅导入文件（仍支持，但不是主要存储）：
* `~/.openclaw/credentials/oauth.json`（首次使用时导入到 `auth-profiles.json`）

以上都尊重 `$OPENCLAW_STATE_DIR`（状态目录覆盖）。完整参考：[/网关配置](/gateway/configuration#auth-storage-oauth--api-keys)

关于静态机密引用和运行时快照激活行为，请参见[机密管理](/gateway/secrets)。

## Anthropic setup-token（订阅认证）

<Warning>
  Anthropic setup-token 支持是技术兼容性，不是策略保证。
  Anthropic 过去曾阻止 Claude Code 之外的某些订阅使用。
  决定是否使用订阅认证，并自行验证 Anthropic 的当前条款。
</Warning>

在任何机器上运行 `claude setup-token`，然后粘贴到 OpenClaw：

```bash
openclaw models auth setup-token --provider anthropic
```

如果在其他地方生成了令牌，请手动粘贴：

```bash
openclaw models auth paste-token --provider anthropic
```

验证：

```bash
openclaw models status
```

## OAuth 交换（登录如何工作）

OpenClaw 的交互式登录流程在 `@mariozechner/pi-ai` 中实现，并接入向导/命令。

### Anthropic setup-token

流程：
1. 运行 `claude setup-token`
2. 将令牌粘贴到 OpenClaw
3. 存储为令牌认证配置文件（无刷新）

向导路径是 `openclaw onboard` → 认证选择 `setup-token`（Anthropic）。

### OpenAI Codex (ChatGPT OAuth)

OpenAI Codex OAuth 明确支持在 Codex CLI 之外使用，包括 OpenClaw 工作流。

流程（PKCE）：

1. 生成 PKCE 验证器/挑战器 + 随机 `state`
2. 打开 `https://auth.openai.com/oauth/authorize?...`
3. 尝试在 `http://127.0.0.1:1455/auth/callback` 捕获回调
4. 如果回调无法绑定（或您是远程/无头） → 粘贴重定向 URL/代码
5. 在 `https://auth.openai.com/oauth/token` 交换
6. 从访问令牌提取 `accountId` 并存储 `{ access, refresh, expires, accountId }`

向导路径是 `openclaw onboard` → 认证选择 `openai-codex`。

## 刷新 + 过期

配置文件存储 `expires` 时间戳。

在运行时：
* 如果 `expires` 在未来 → 使用存储的访问令牌
* 如果已过期 → 刷新（在文件锁下）并覆盖存储的凭据

刷新是自动的；您通常不需要手动管理令牌。

## 多个账户（配置文件）+ 路由

两种模式：

### 1）首选：分离代理

如果希望"个人"和"工作"永不交互 → 使用隔离代理（独立会话 + 凭据 + 工作空间）：

```bash
openclaw agents add work
openclaw agents add personal
```

然后为每个代理配置认证（使用向导）并将聊天路由到正确的代理。

### 2）高级：一个代理中的多个配置文件

`auth-profiles.json` 支持同一提供商的多个配置文件 ID。

选择使用哪个配置文件：

* 通过配置顺序全局（`auth.order`）
* 通过 `/model ...@<profileId>` 每会话

示例（会话覆盖）：
* `/model Opus@anthropic:work`

如何查看存在哪些配置文件 ID：
* `openclaw channels list --json`（显示 `auth[]`）

相关文档：

* [/concepts/model-failover]（轮换 + 冷却规则）
* [/tools/slash-commands]（命令表面）