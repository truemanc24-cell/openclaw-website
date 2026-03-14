# 配置指南

> ## 文档索引
> 获取完整文档索引：https://docs.openclaw.ai/llms.txt

---

## 概述

OpenClaw 从 `~/.openclaw/openclaw.json` 读取可选的 **JSON5** 配置（支持注释和尾随逗号）。

如果文件不存在，OpenClaw 使用安全默认值。添加配置的常见原因：

- 连接渠道并控制谁可以发消息给机器人
- 设置模型、工具、沙箱或自动化（cron、hooks）
- 调整会话、媒体、网络或 UI

查看 [完整参考](/gateway/configuration-reference) 了解所有可用字段。

> 💡 **配置新手？** 从 `openclaw onboard` 开始交互式设置，或查看 [配置示例](/gateway/configuration-examples) 指南获取完整的复制粘贴配置。

---

## 最小配置

```json5
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

---

## 编辑配置

### 方法 1：交互式向导
```bash
openclaw onboard       # 完整设置向导
openclaw configure     # 配置向导
```

### 方法 2：CLI（单行命令）
```bash
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config unset tools.web.search.apiKey
```

### 方法 3：控制面板
打开 http://127.0.0.1:18789 并使用 **Config** 标签。  
控制面板从配置模式渲染表单，并提供 **Raw JSON** 编辑器作为后备。

### 方法 4：直接编辑
直接编辑 `~/.openclaw/openclaw.json`。Gateway 监视文件并自动应用更改（见 [热重载](#热重载)）。

---

## 严格验证

> ⚠️ OpenClaw 只接受完全符合模式的配置。未知键、格式错误的类型或无效值会导致 Gateway **拒绝启动**。唯一的根级例外是 `$schema`（字符串），编辑器可以用它附加 JSON Schema 元数据。

**验证失败时**：
- Gateway 不启动
- 只有诊断命令可用（`openclaw doctor`、`openclaw logs`、`openclaw health`、`openclaw status`）
- 运行 `openclaw doctor` 查看确切问题
- 运行 `openclaw doctor --fix`（或 `--yes`）应用修复

---

## 常见任务

### 1. 设置渠道（WhatsApp、Telegram、Discord 等）

每个渠道在 `channels.<provider>` 下有自己的配置部分。查看专用渠道页面了解设置步骤：

| 渠道 | 配置路径 |
|------|---------|
| WhatsApp | `channels.whatsapp` |
| Telegram | `channels.telegram` |
| Discord | `channels.discord` |
| Slack | `channels.slack` |
| Signal | `channels.signal` |
| iMessage | `channels.imessage` |
| Google Chat | `channels.googlechat` |
| Mattermost | `channels.mattermost` |
| MS Teams | `channels.msteams` |

所有渠道共享相同的 DM 策略模式：

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123:abc",
      dmPolicy: "pairing",   // pairing | allowlist | open | disabled
      allowFrom: ["tg:123"], // 仅用于 allowlist/open
    },
  },
}
```

---

### 2. 选择和配置模型

设置主模型和可选备用：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: ["openai/gpt-5.2"],
      },
      models: {
        "anthropic/claude-sonnet-4-5": { alias: "Sonnet" },
        "openai/gpt-5.2": { alias: "GPT" },
      },
    },
  },
}
```

- `agents.defaults.models` 定义模型目录并作为 `/model` 的白名单
- 模型引用使用 `provider/model` 格式（如 `anthropic/claude-opus-4-6`）
- `agents.defaults.imageMaxDimensionPx` 控制转录/工具图像缩小（默认 `1200`）；较低值通常减少截图密集型运行的视觉 token 使用
- 查看 [模型 CLI](/concepts/models) 了解在聊天中切换模型
- 查看 [模型故障转移](/concepts/model-failover) 了解认证轮换和备用行为
- 自定义/自托管提供商，查看 [自定义提供商](/gateway/configuration-reference#custom-providers-and-base-urls)

---

### 3. 控制谁可以发消息给机器人

DM 访问通过 `dmPolicy` 按渠道控制：

- `"pairing"`（默认）：未知发送者获得一次性配对码批准
- `"allowlist"`：只有 `allowFrom`（或配对的允许存储）中的发送者
- `"open"`：允许所有入站 DM（需要 `allowFrom: ["*"]`）
- `"disabled"`：忽略所有 DM

群组使用 `groupPolicy` + `groupAllowFrom` 或渠道特定白名单。

查看 [完整参考](/gateway/configuration-reference#dm-and-group-access) 了解每个渠道的详情。

---

### 4. 设置群组聊天提及门控

群组消息默认**需要提及**。为每个 agent 配置模式：

```json5
{
  agents: {
    list: [
      {
        id: "main",
        groupChat: {
          mentionPatterns: ["@openclaw", "openclaw"],
        },
      },
    ],
  },
  channels: {
    whatsapp: {
      groups: { "*": { requireMention: true } },
    },
  },
}
```

- **元数据提及**：原生 @-提及（WhatsApp 点击提及、Telegram @bot 等）
- **文本模式**：`mentionPatterns` 中的正则模式
- 查看 [完整参考](/gateway/configuration-reference#group-chat-mention-gating) 了解每个渠道的覆盖和自聊天模式

---

### 5. 配置会话和重置

会话控制对话连续性和隔离：

```json5
{
  session: {
    dmScope: "per-channel-peer",  // 推荐用于多用户
    threadBindings: {
      enabled: true,
      idleHours: 24,
      maxAgeHours: 0,
    },
    reset: {
      mode: "daily",
      atHour: 4,
      idleMinutes: 120,
    },
  },
}
```

- `dmScope`: `main`（共享）| `per-peer` | `per-channel-peer` | `per-account-channel-peer`
- `threadBindings`：线程绑定会话路由的全局默认值（Discord 支持 `/focus`、`/unfocus`、`/agents`、`/session idle` 和 `/session max-age`）
- 查看 [会话管理](/concepts/session) 了解范围、身份链接和发送策略
- 查看 [完整参考](/gateway/configuration-reference#session) 了解所有字段

---

### 6. 启用沙箱

在隔离的 Docker 容器中运行 agent 会话：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",  // off | non-main | all
        scope: "agent",    // session | agent | shared
      },
    },
  },
}
```

首先构建镜像：`scripts/sandbox-setup.sh`

查看 [沙箱](/gateway/sandboxing) 完整指南和 [完整参考](/gateway/configuration-reference#sandbox) 了解所有选项。

---

### 7. 设置心跳（定期检查）

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
      },
    },
  },
}
```

- `every`：持续字符串（`30m`、`2h`）。设置 `0m` 禁用
- `target`：`last` | `whatsapp` | `telegram` | `discord` | `none`
- `directPolicy`：`allow`（默认）或 `block` 用于 DM 风格心跳目标
- 查看 [心跳](/gateway/heartbeat) 完整指南

---

### 8. 配置 cron 任务

```json5
{
  cron: {
    enabled: true,
    maxConcurrentRuns: 2,
    sessionRetention: "24h",
    runLog: {
      maxBytes: "2mb",
      keepLines: 2000,
    },
  },
}
```

- `sessionRetention`：从 `sessions.json` 修剪已完成的孤立运行会话（默认 `24h`；设置 `false` 禁用）
- `runLog`：按大小和保留行数修剪 `cron/runs/<jobId>.jsonl`
- 查看 [cron 任务](/automation/cron-jobs) 功能概述和 CLI 示例

---

### 9. 设置 Webhooks（hooks）

在 Gateway 上启用 HTTP webhook 端点：

```json5
{
  hooks: {
    enabled: true,
    token: "shared-secret",
    path: "/hooks",
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"],
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        agentId: "main",
        deliver: true,
      },
    ],
  },
}
```

**安全说明**：
- 将所有 hook/webhook 负载内容视为不可信输入
- 保持不安全内容绕过标志禁用（`hooks.gmail.allowUnsafeExternalContent`、`hooks.mappings[].allowUnsafeExternalContent`），除非进行严格范围的调试
- 对于 hook 驱动的 agent，优先使用强大的现代模型层和严格的工具策略（例如仅消息传递加上可能的沙箱）

查看 [完整参考](/gateway/configuration-reference#hooks) 了解所有映射选项和 Gmail 集成。

---

### 10. 配置多 agent 路由

运行多个隔离的 agent，具有独立的工作空间和会话：

```json5
{
  agents: {
    list: [
      { id: "home", default: true, workspace: "~/.openclaw/workspace-home" },
      { id: "work", workspace: "~/.openclaw/workspace-work" },
    ],
  },
  bindings: [
    { agentId: "home", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } },
  ],
}
```

查看 [多 Agent](/concepts/multi-agent) 和 [完整参考](/gateway/configuration-reference#multi-agent-routing) 了解绑定规则和每个 agent 的访问配置文件。

---

### 11. 将配置分割成多个文件（$include）

使用 `$include` 组织大型配置：

```json5
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/a.json5", "./clients/b.json5"],
  },
}
```

- **单个文件**：替换包含的对象
- **文件数组**：按顺序深度合并（后者胜出）
- **兄弟键**：在包含后合并（覆盖包含的值）
- **嵌套包含**：支持最多 10 层深
- **相对路径**：相对于包含文件解析
- **错误处理**：缺少文件、解析错误和循环包含的清晰错误

---

## 配置热重载

Gateway 监视 `~/.openclaw/openclaw.json` 并自动应用更改——大多数设置无需手动重启。

### 重载模式

| 模式 | 行为 |
|------|------|
| **`hybrid`**（默认） | 即时热应用安全更改。自动重启处理关键更改 |
| **`hot`** | 仅热应用安全更改。需要重启时记录警告——你处理 |
| **`restart`** | 任何配置更改时重启 Gateway，安全与否 |
| **`off`** | 禁用文件监视。更改在下次手动重启时生效 |

```json5
{
  gateway: {
    reload: { mode: "hybrid", debounceMs: 300 },
  },
}
```

### 热应用与需要重启的对比

大多数字段热应用无需停机。在 `hybrid` 模式下，需要重启的更改自动处理。

| 类别 | 字段 | 需要重启？ |
|------|------|-----------|
| 渠道 | `channels.*`、`web`（WhatsApp）——所有内置和扩展渠道 | ❌ 否 |
| Agent 和模型 | `agent`、`agents`、`models`、`routing` | ❌ 否 |
| 自动化 | `hooks`、`cron`、`agent.heartbeat` | ❌ 否 |
| 会话和消息 | `session`、`messages` | ❌ 否 |
| 工具和媒体 | `tools`、`browser`、`skills`、`audio`、`talk` | ❌ 否 |
| UI 和杂项 | `ui`、`logging`、`identity`、`bindings` | ❌ 否 |
| Gateway 服务器 | `gateway.*`（端口、绑定、认证、tailscale、TLS、HTTP） | ✅ 是 |
| 基础设施 | `discovery`、`canvasHost`、`plugins` | ✅ 是 |

> 💡 `gateway.reload` 和 `gateway.remote` 是例外——更改它们**不**触发重启。

---

**翻译完成时间**: 2026-03-15 00:35  
**来源**: https://docs.openclaw.ai/gateway/configuration  
**状态**: ✅ 已完成
