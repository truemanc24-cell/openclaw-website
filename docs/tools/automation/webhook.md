# Webhook

网关可以为外部触发器暴露一个小型的 HTTP webhook 端点。

## 启用

```json5
{
  hooks: {
    enabled: true,
    token: "shared-secret",
    path: "/hooks",
    // Optional: restrict explicit `agentId` routing to this allowlist.
    // Omit or include "*" to allow any agent.
    // Set [] to deny all explicit `agentId` routing.
    allowedAgentIds: ["hooks", "main"],
  },
}
```

注意：

* 当 `hooks.enabled=true` 时需要 `hooks.token`。
* `hooks.path` 默认为 `/hooks`。

## 认证

每个请求必须包含 hook token。首选 headers：

* `Authorization: Bearer <token>`（推荐）
* `x-openclaw-token: <token>`
* 查询字符串 token 被拒绝（`?token=...` 返回 `400`）。
* 将 `hooks.token` 持有者视为该网关 hook 入口表面的完全可信调用者。Hook 有效载荷内容仍然不受信任，但这不是单独的非所有者认证边界。

## 端点

### `POST /hooks/wake`

有效载荷：

```json
{ "text": "System line", "mode": "now" }
```

* `text` **必需**（字符串）：事件描述（例如"New email received"）。
* `mode` 可选（`now` | `next-heartbeat`）：是否触发立即心跳（默认 `now`）或等待下一个定期检查。

效果：

* 为**主**会话加入系统事件队列
* 如果 `mode=now`，触发立即心跳

### `POST /hooks/agent`

有效载荷：

```json
{
  "message": "Run this",
  "name": "Email",
  "agentId": "hooks",
  "sessionKey": "hook:email:msg-123",
  "wakeMode": "now",
  "deliver": true,
  "channel": "last",
  "to": "+15551234567",
  "model": "openai/gpt-5.2-mini",
  "thinking": "low",
  "timeoutSeconds": 120
}
```

* `message` **必需**（字符串）：代理要处理的提示或消息。
* `name` 可选（字符串）：hook 的可读名称（例如"GitHub"），在会话摘要中用作前缀。
* `agentId` 可选（字符串）：将此 hook 路由到特定代理。未知 ID 回退到默认代理。设置后，hook 使用已解析代理的工作区和配置。
* `sessionKey` 可选（字符串）：用于标识代理会话的键。默认情况下，除非 `hooks.allowRequestSessionKey=true`，否则此字段被拒绝。
* `wakeMode` 可选（`now` | `next-heartbeat`）：是否触发立即心跳（默认 `now`）或等待下一个定期检查。
* `deliver` 可选（布尔值）：如果为 `true`，代理的响应将被发送到消息渠道。默认为 `true`。仅作为心跳确认的响应会自动跳过。
* `channel` 可选（字符串）：投递的消息渠道。之一：`last`、`whatsapp`、`telegram`、`discord`、`slack`、`mattermost`（插件）、`signal`、`imessage`、`msteams`。默认为 `last`。
* `to` 可选（字符串）：渠道的收件人标识符（例如 WhatsApp/Signal 的电话号码，Telegram 的聊天 ID，Discord/Slack/Mattermost（插件）的频道 ID，MS Teams 的会话 ID）。默认为主会话中的最后收件人。
* `model` 可选（字符串）：模型覆盖（例如 `anthropic/claude-3-5-sonnet` 或别名）。如果受限，必须在允许的模型列表中。
* `thinking` 可选（字符串）：思维级别覆盖（例如 `low`、`medium`、`high`）。
* `timeoutSeconds` 可选（数字）：代理运行的最大持续时间（秒）。

效果：

* 运行**隔离**代理轮次（自己的会话键）
* 始终将摘要发布到**主**会话
* 如果 `wakeMode=now`，触发立即心跳

## 会话键策略（重大更改）

`/hooks/agent` 有效载荷 `sessionKey` 覆盖默认禁用。

* 推荐：设置固定的 `hooks.defaultSessionKey` 并保持请求覆盖关闭。
* 可选：仅在需要时允许请求覆盖，并限制前缀。

推荐配置：

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"],
  },
}
```

兼容配置（旧行为）：

```json5
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    allowRequestSessionKey: true,
    allowedSessionKeyPrefixes: ["hook:"], // strongly recommended
  },
}
```

### `POST /hooks/<name>`（映射）

自定义 hook 名称通过 `hooks.mappings` 解析（请参阅配置）。映射可以将任意有效载荷转换为 `wake` 或 `agent` 操作，带可选模板或代码转换。

映射选项（摘要）：

* `hooks.presets: ["gmail"]` 启用内置 Gmail 映射。
* `hooks.mappings` 让你在配置中定义 `match`、`action` 和模板。
* `hooks.transformsDir` + `transform.module` 加载 JS/TS 模块以进行自定义逻辑。
  * `hooks.transformsDir`（如果设置）必须保持在 OpenClaw 配置目录下的转换根目录下（通常为 `~/.openclaw/hooks/transforms`）。
  * `transform.module` 必须在有效转换目录内解析（拒绝遍历/逃逸路径）。
* 使用 `match.source` 保持通用接入端点（有效载荷驱动路由）。
* TS 转换需要 TS 加载器（例如 `bun` 或 `tsx`）或运行时预编译的 `.js`。
* 在映射上设置 `deliver: true` + `channel`/`to` 以将回复路由到聊天界面（`channel` 默认为 `last` 并回退到 WhatsApp）。
* `agentId` 将 hook 路由到特定代理；未知 ID 回退到默认代理。
* `hooks.allowedAgentIds` 限制显式 `agentId` 路由。省略它（或包含 `*`）以允许任何代理。设置为 `[]` 以拒绝显式 `agentId` 路由。
* `hooks.defaultSessionKey` 为 hook 代理运行设置默认会话，当未提供显式键时。
* `hooks.allowRequestSessionKey` 控制 `/hooks/agent` 有效载荷是否可以设置 `sessionKey`（默认：`false`）。
* `hooks.allowedSessionKeyPrefixes` 可选限制来自请求有效载荷和映射的显式 `sessionKey` 值。
* `allowUnsafeExternalContent: true` 为该 hook 禁用外部内容安全包装（危险；仅用于可信内部来源）。
* `openclaw webhooks gmail setup` 为 `openclaw webhooks gmail run` 写入 `hooks.gmail` 配置。请参阅 [Gmail Pub/Sub](/automation/gmail-pubsub) 获取完整的 Gmail watch 流程。

## 响应

* `200` 表示 `/hooks/wake`
* `200` 表示 `/hooks/agent`（异步运行已接受）
* `401` 认证失败
* `429` 同一客户端重复认证失败后（检查 `Retry-After`）
* `400` 有效载荷无效
* `413` 有效载荷过大

## 示例

```bash
curl -X POST http://127.0.0.1:18789/hooks/wake \
  -H 'Authorization: Bearer SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"text":"New email received","mode":"now"}'
```

```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H 'x-openclaw-token: SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"message":"Summarize inbox","name":"Email","wakeMode":"next-heartbeat"}'
```

### 使用不同模型

在代理有效载荷（或映射）中添加 `model` 以覆盖该运行的模型：

```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H 'x-openclaw-token: SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"message":"Summarize inbox","name":"Email","model":"openai/gpt-5.2-mini"}'
```

如果你强制执行 `agents.defaults.models`，请确保覆盖模型包含在那里。

```bash
curl -X POST http://127.0.0.1:18789/hooks/gmail \
  -H 'Authorization: Bearer SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"source":"gmail","messages":[{"from":"Ada","subject":"Hello","snippet":"Hi"}]}'
```

## 安全

* 将 hook 端点保持在环回、tailnet 或可信反向代理后面。
* 使用专用 hook token；不要重复使用网关认证 token。
* 首选具有严格 `tools.profile` 和沙箱的专用 hook 代理，这样 hook 入口的爆炸半径更窄。
* 重复认证失败按客户端地址限速，以减缓暴力破解尝试。
* 如果使用多代理路由，设置 `hooks.allowedAgentId` 限制显式 `agentId` 选择。
* 保持 `hooks.allowRequestSessionKey=false`，除非你需要调用者选择的会话。
* 如果启用请求 `sessionKey`，限制 `hooks.allowedSessionKeyPrefixes`（例如 `["hook:"]`）。
* 避免在 webhook 日志中包含敏感的原始有效载荷。
* Hook 有效载荷默认被视为不受信任并用安全边界包装。如果你必须为特定 hook 禁用此功能，在该 hook 的映射中设置 `allowUnsafeExternalContent: true`（危险）。