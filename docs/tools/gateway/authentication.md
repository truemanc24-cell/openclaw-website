# 认证

OpenClaw 支持模型提供商的 OAuth 和 API 密钥。对于永远在线的网关主机，API 密钥通常是最可预测的选项。当它们与你的提供商账户模型匹配时，也支持订阅/OAuth 流程。

请参阅 [/concepts/oauth](/concepts/oauth) 了解完整的 OAuth 流程和存储布局。
对于基于 SecretRef 的认证（`env`/`file`/`exec` 提供商），请参阅 [Secrets Management](/gateway/secrets)。
有关 `models status --probe` 使用的凭据资格/原因代码规则，请参阅 [Auth Credential Semantics](/auth-credential-semantics)。

## 推荐设置（API 密钥，任何提供商）

如果你正在运行长期网关，请从你选择的提供商开始使用 API 密钥。
对于 Anthropic，具体来说，API 密钥认证是安全路径，比订阅 setup-token 认证更推荐。

1. 在你的提供商控制台中创建 API 密钥。
2. 将其放在**网关主机**上（运行 `openclaw gateway` 的机器）。

```bash
export <PROVIDER>_API_KEY="..."
openclaw models status
```

3. 如果网关在 systemd/launchd 下运行，优先将密钥放在 `~/.openclaw/.env` 中，以便守护进程可以读取它：

```bash
cat >> ~/.openclaw/.env <<'EOF'
<PROVIDER>_API_KEY=...
EOF
```

然后重启守护进程（或重启你的网关进程）并重新检查：

```bash
openclaw models status
openclaw doctor
```

如果你不想自己管理环境变量，onboarding 可以为守护进程存储 API 密钥：`openclaw onboard`。

请参阅 [Help](/help) 了解环境继承详情（`env.shellEnv`、`~/.openclaw/.env`、systemd/launchd）。

## Anthropic：setup-token（订阅认证）

如果你使用 Claude 订阅，支持 setup-token 流程。在**网关主机**上运行：

```bash
claude setup-token
```

然后粘贴到 OpenClaw：

```bash
openclaw models auth setup-token --provider anthropic
```

如果令牌是在另一台机器上创建的，手动粘贴：

```bash
openclaw models auth paste-token --provider anthropic
```

如果你看到类似这样的 Anthropic 错误：

```
This credential is only authorized for use with Claude Code and cannot be used for other API requests.
```

…请改用 Anthropic API 密钥。

<Warning>
  Anthropic setup-token 支持仅为技术兼容性。Anthropic 过去曾在 Claude Code 之外阻止了一些订阅使用。仅在你认为政策风险可接受的情况下使用它，并自行验证 Anthropic 的当前条款。
</Warning>

手动令牌输入（任何提供商；写入 `auth-profiles.json` + 更新配置）：

```bash
openclaw models auth paste-token --provider anthropic
openclaw models auth paste-token --provider openrouter
```

还支持用于静态凭据的 auth profile 引用：

* `api_key` 凭据可以使用 `keyRef: { source, provider, id }`
* `token` 凭据可以使用 `tokenRef: { source, provider, id }`

自动化友好检查（过期/缺失时退出 `1`，即将过期时退出 `2`）：

```bash
openclaw models status --check
```

可选运维脚本（systemd/Termux）记录在此处：
[/automation/auth-monitoring](/automation/auth-monitoring)

> `claude setup-token` 需要交互式 TTY。

## 检查模型认证状态

```bash
openclaw models status
openclaw doctor
```

## API 密钥轮换行为（网关）

某些提供商支持在 API 调用遇到提供商速率限制时使用替代密钥重试请求。

* 优先级顺序：
  * `OPENCLAW_LIVE_<PROVIDER>_KEY`（单一覆盖）
  * `<PROVIDER>_API_KEYS`
  * `<PROVIDER>_API_KEY`
  * `<PROVIDER>_API_KEY_*`
* Google 提供商还包括 `GOOGLE_API_KEY` 作为额外回退。
* 同一密钥列表在使用前先去重。
* OpenClaw 仅对速率限制错误重试下一个密钥（例如 `429`、`rate_limit`、`quota`、`resource exhausted`）。
* 非速率限制错误不会使用替代密钥重试。
* 如果所有密钥都失败，则返回最后尝试的错误。

## 控制使用哪个凭据

### 每会话（聊天命令）

使用 `/model <alias-or-id>@<profileId>` 为当前会话固定特定提供商凭据（示例 profile ids：`anthropic:default`、`anthropic:work`）。

使用 `/model`（或 `/model list`）获取紧凑选择器；使用 `/model status` 获取完整视图（候选 + 下一个 auth profile，以及配置了提供商端点详情时）。

### 每代理（CLI 覆盖）

为代理设置显式 auth profile 顺序覆盖（存储在该代理的 `auth-profiles.json` 中）：

```bash
openclaw models auth order get --provider anthropic
openclaw models auth order set --provider anthropic anthropic:default
openclaw models auth order clear --provider anthropic
```

使用 `--agent <id>` 定位特定代理；省略它以使用配置的默认代理。

## 故障排除

### "No credentials found"

如果缺少 Anthropic token profile，请在**网关主机**上运行 `claude setup-token`，然后重新检查：

```bash
openclaw models status
```

### Token 即将过期/已过期

运行 `openclaw models status` 确认哪个 profile 即将过期。如果 profile 缺失，请重新运行 `claude setup-token` 并再次粘贴令牌。

## 要求

* Anthropic 订阅账户（用于 `claude setup-token`）
* Claude Code CLI 已安装（`claude` 命令可用）