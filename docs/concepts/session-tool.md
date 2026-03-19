# 会话工具

# 会话工具

目标：小巧、难以误用的工具集，以便代理可以列出会话、获取历史和发送到另一个会话。

## 工具名称

* `sessions_list`
* `sessions_history`
* `sessions_send`
* `sessions_spawn`

## 关键模型

* 主直接聊天桶始终是字面键 `"main"`（解析为当前代理的主键）。
* 群组聊天使用 `agent:<agentId>:<channel>:group:<id>` 或 `agent:<agentId>:<channel>:channel:<id>`（传递完整键）。
* Cron 作业使用 `cron:<job.id>`。
* 钩子使用 `hook:<uuid>`，除非明确设置。
* 节点会话使用 `node-<nodeId>`，除非明确设置。

`global` 和 `unknown` 是保留值，永不列出。如果 `session.scope = "global"`，我们为所有工具将其别名为 `main`，以便调用者永远不会看到 `global`。

## sessions_list

将会话列为行数组。

参数：

* `kinds?: string[]` 过滤：任何 `"main" | "group" | "cron" | "hook" | "node" | "other"`
* `limit?: number` 最大行数（默认：服务器默认，例如限制为 200）
* `activeMinutes?: number` 仅 N 分钟内更新的会话
* `messageLimit?: number` 0 = 无消息（默认 0）；>0 = 包含最后 N 条消息

行为：

* `messageLimit > 0` 每个会话获取 `chat.history` 并包含最后 N 条消息。
* 列表输出中过滤掉工具结果；使用 `sessions_history` 获取工具消息。
* 在**沙盒化**的代理会话中运行时，会话工具默认为**仅生成可见性**（见下文）。

行形状（JSON）：

* `key`：会话键（字符串）
* `kind`：`main | group | cron | hook | node | other`
* `channel`：`whatsapp | telegram | discord | signal | imessage | webchat | internal | unknown`
* `displayName`（群组显示标签，如果有）
* `updatedAt`（毫秒）
* `sessionId`
* `model`、`contextTokens`、`totalTokens`
* `thinkingLevel`、`verboseLevel`、`systemSent`、`abortedLastRun`
* `sendPolicy`（如果设置，会话覆盖）
* `lastChannel`、`lastTo`
* `deliveryContext`（规范化 `{ channel, to, accountId }`，如果有）
* `transcriptPath`（来自存储目录 + sessionId 的尽力路径）
* `messages?`（仅当 `messageLimit > 0`）

## sessions_history

获取一个会话的记录。

参数：

* `sessionKey`（必需；接受会话键或 `sessions_list` 中的 `sessionId`）
* `limit?: number` 最大消息数（服务器限制）
* `includeTools?: boolean`（默认 false）

行为：

* `includeTools=false` 过滤 `role: "toolResult"` 消息。
* 以原始记录格式返回消息数组。
* 给定 `sessionId`，OpenClaw 解析为对应的会话键（缺失 ID 报错）。

## sessions_send

向另一个会话发送消息。

参数：

* `sessionKey`（必需；接受会话键或 `sessions_list` 中的 `sessionId`）
* `message`（必需）
* `timeoutSeconds?: number`（默认 >0；0 = 发送后不管）

行为：

* `timeoutSeconds = 0`：入队并返回 `{ runId, status: "accepted" }`。
* `timeoutSeconds > 0`：等待最多 N 秒完成，然后返回 `{ runId, status: "ok", reply }`。
* 如果等待超时： `{ runId, status: "timeout", error }`。运行继续；稍后调用 `sessions_history`。
* 如果运行失败： `{ runId, status: "error", error }`。
* 宣布传递在主运行完成后运行，是尽力而为的；`status: "ok"` 不保证宣布已传递。
* 通过网关 `agent.wait`（服务器端）等待，因此重新连接不会丢失等待。
* 代理到代理消息上下文为主运行注入。
* 跨会话消息用 `message.provenance.kind = "inter_session"` 持久化，以便记录读者可以将路由的代理指令与外部用户输入区分开来。
* 主运行完成后，OpenClaw 运行**回复循环**：
  * 第 2+ 轮在请求者和目标代理之间交替。
  * 精确回复 `REPLY_SKIP` 停止 ping-pong。
  * 最大轮次是 `session.agentToAgent.maxPingPongTurns`（0-5，默认 5）。
* 循环结束后，OpenClaw 运行**代理到代理宣布步骤**（仅目标代理）：
  * 精确回复 `ANNOUNCE_SKIP` 保持沉默。
  * 任何其他回复发送到目标渠道。
  * 宣布步骤包括原始请求 + 第 1 轮回复 + 最新的 ping-pong 回复。

## 渠道字段

* 对于群组，`channel` 是会话条目上记录的渠道。
* 对于直接聊天，`channel` 从 `lastChannel` 映射。
* 对于 cron/hook/node，`channel` 是 `internal`。
* 如果缺失，`channel` 是 `unknown`。

## 安全 / 发送策略

基于渠道/聊天类型的策略阻止（不是每个会话 ID）。

```json
{
  "session": {
    "sendPolicy": {
      "rules": [
        {
          "match": { "channel": "discord", "chatType": "group" },
          "action": "deny"
        }
      ],
      "default": "allow"
    }
  }
}
```

运行时覆盖（每个会话条目）：

* `sendPolicy: "allow" | "deny"`（未设置 = 继承配置）
* 可通过 `sessions.patch` 或仅所有者 `/send on|off|inherit`（独立消息）设置。

执行点：

* `chat.send` / `agent`（网关）
* 自动回复传递逻辑

## sessions_spawn

在隔离会话中生成子代理运行，并将结果宣布回请求者聊天渠道。

参数：

* `task`（必需）
* `label?`（可选；用于日志/UI）
* `agentId?`（可选；如果允许，在另一个代理 ID 下生成）
* `model?`（可选；覆盖子代理模型；无效值报错）
* `thinking?`（可选；覆盖子代理运行的推理级别）
* `runTimeoutSeconds?`（默认为 `agents.defaults.subagents.runTimeoutSeconds`（如果设置），否则为 `0`；设置时，在 N 秒后中止子代理运行）
* `thread?`（默认 false；请求时支持的渠道/插件的线程绑定路由）
* `mode?`（`run|session`；默认为 `run`，但 `thread=true` 时默认为 `session`；`mode="session"` 需要 `thread=true`）
* `cleanup?`（`delete|keep`，默认 `keep`）
* `sandbox?`（`inherit|require`，默认 `inherit`；`require` 拒绝生成除非目标子运行时是沙盒化的）
* `attachments?`（可选的内联文件数组；仅子代理运行时，ACP 拒绝）。每个条目：`{ name, content, encoding?: "utf8" | "base64", mimeType? }`。文件在子工作空间的 `.openclaw/attachments/<uuid>/` 中具体化。返回每个文件的 sha256 收据。
* `attachAs?`（可选；`{ mountPath? }` 提示保留用于未来挂载实现）

白名单：

* `agents.list[].subagents.allowAgents`：允许通过 `agentId` 的代理 ID 列表（`["*"]` 允许任何）。默认：仅请求者代理。
* 沙盒继承守卫：如果请求者会话是沙盒化的，`sessions_spawn` 拒绝将运行非沙盒化的目标。

发现：

* 使用 `agents_list` 发现允许 `sessions_spawn` 的代理 ID。

行为：

* 使用 `deliver: false` 启动新的 `agent:<agentId>:subagent:<uuid>` 会话。
* 子代理默认为完整工具集**减去会话工具**（可通过 `tools.subagents.tools` 配置）。
* 子代理不允许调用 `sessions_spawn`（不允许子代理 → 子代理生成）。
* 始终非阻塞：立即返回 `{ status: "accepted", runId, childSessionKey }`。
* 带 `thread=true`，渠道插件可以将传递/路由绑定到线程目标（Discord 支持由 `session.threadBindings.*` 和 `channels.discord.threadBindings.*` 控制）。
* 完成后，OpenClaw 运行子代理**宣布步骤**并将结果发布到请求者聊天渠道。
  * 如果助手最终回复为空，则包含子代理历史记录中的最新 `toolResult` 作为 `Result`。
* 在宣布步骤中精确回复 `ANNOUNCE_SKIP` 保持沉默。
* 宣布回复规范化为 `Status`/`Result`/`Notes`；`Status` 来自运行时结果（不是模型文本）。
* 子代理会话在 `agents.defaults.subagents.archiveAfterMinutes`（默认：60）后自动归档。
* 宣布回复包括统计行（运行时、令牌、sessionKey/sessionId、记录路径和可选成本）。

## 沙盒会话可见性

会话工具可以限定范围以减少跨会话访问。

默认行为：

* `tools.sessions.visibility` 默认为 `tree`（当前会话 + 生成的子代理会话）。
* 对于沙盒会话，`agents.defaults.sandbox.sessionToolsVisibility` 可以硬限制可见性。

配置：

```json5
{
  tools: {
    sessions: {
      // "self" | "tree" | "agent" | "all"
      // 默认："tree"
      visibility: "tree",
    },
  },
  agents: {
    defaults: {
      sandbox: {
        // 默认："spawned"
        sessionToolsVisibility: "spawned", // 或 "all"
      },
    },
  },
}
```

注意：

* `self`：仅当前会话键。
* `tree`：当前会话 + 当前会话生成的会话。
* `agent`：属于当前代理 ID 的任何会话。
* `all`：任何会话（跨代理访问仍需要 `tools.agentToAgent`）。
* 当会话沙盒化且 `sessionToolsVisibility="spawned"` 时，OpenClaw 将可见性限制为 `tree`，即使您设置 `tools.sessions.visibility="all"`。