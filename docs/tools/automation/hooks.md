---
title: hooks
description: hooks 页面
---

# 钩子

钩子提供了一个可扩展的事件驱动系统，用于响应代理命令和事件自动执行操作。钩子从目录自动发现，可以通过 CLI 命令管理，类似于 OpenClaw 中的技能工作方式。

## 入门

钩子是在发生某些事情时运行的小脚本。有两种类型：

* **钩子**（本页）：当代理事件触发时在网关内运行，如 `/new`、`/reset`、`/stop` 或生命周期事件。
* **Webhook**：允许其他系统在 OpenClaw 中触发工作的外部 HTTP webhook。请参阅 [Webhook 钩子](/automation/webhook) 或使用 `openclaw webhooks` 获取 Gmail 辅助命令。

钩子也可以捆绑在插件中；请参阅[插件](/tools/plugin#plugin-hooks)。

常见用途：

* 重置会话时保存内存快照
* 保留命令审计跟踪以进行故障排除或合规
* 会话开始或结束时触发后续自动化
* 事件触发时将文件写入代理工作区或调用外部 API

如果你可以编写一个小 TypeScript 函数，你就可以编写钩子。钩子自动发现，你可以通过 CLI 启用或禁用它们。

## 概述

钩子系统允许你：

* 发出 `/new` 时将会话上下文保存到内存
* 记录所有命令以进行审计
* 触发代理生命周期事件的自定义自动化
* 扩展 OpenClaw 的行为而不修改核心代码

## 入门

### 捆绑钩子

OpenClaw 附带四个自动发现的捆绑钩子：

* **💾 session-memory**：当你发出 `/new` 时将会话上下文保存到你的代理工作区（默认 `~/.openclaw/workspace/memory/`）
* **📎 bootstrap-extra-files**：在 `agent:bootstrap` 期间从配置的 glob/路径模式注入额外的工作区引导文件
* **📝 command-logger**：将所有命令事件记录到 `~/.openclaw/logs/commands.log`
* **🚀 boot-md**：网关启动时运行 `BOOT.md`（需要启用内部钩子）

列出可用钩子：

```bash
openclaw hooks list
```

启用钩子：

```bash
openclaw hooks enable session-memory
```

检查钩子状态：

```bash
openclaw hooks check
```

获取详细信息：

```bash
openclaw hooks info session-memory
```

### 入门

在 onboarding 期间（`openclaw onboard`），系统会提示你启用推荐的钩子。向导自动发现符合条件的钩子并呈现供选择。

## 钩子发现

钩子从三个目录自动发现（按优先级顺序）：

1. **工作区钩子**：`<workspace>/hooks/`（每个代理，最高优先级）
2. **托管钩子**：`~/.openclaw/hooks/`（用户安装，跨工作区共享）
3. **捆绑钩子**：`<openclaw>/dist/hooks/bundled/`（随 OpenClaw 一起发布）

托管钩子目录可以是**单个钩子**或**钩子包**（包目录）。

每个钩子是一个目录，包含：

```
my-hook/
├── HOOK.md          # 元数据 + 文档
└── handler.ts       # 处理程序实现
```

## 钩子包（npm/归档）

钩子包是标准 npm 包，通过 `package.json` 中的 `openclaw.hooks` 导出一个或多个钩子。使用以下命令安装：

```bash
openclaw hooks install <path-or-spec>
```

npm 规范仅限注册表（包名 + 可选精确版本或 dist-tag）。拒绝 Git/URL/file 规范和 semver 范围。

裸规范和 `@latest` 保持在稳定轨道上。如果 npm 将其中任何一个解析为预发布版本，OpenClaw 会停止并要求你使用预发布标签（如 `@beta`/`@rc`）或精确预发布版本明确选择加入。

示例 `package.json`：

```json
{
  "name": "@acme/my-hooks",
  "version": "0.1.0",
  "openclaw": {
    "hooks": ["./hooks/my-hook", "./hooks/other-hook"]
  }
}
```

每个条目指向包含 `HOOK.md` 和 `handler.ts`（或 `index.ts`）的钩子目录。钩子包可以附带依赖项；它们将安装在 `~/.openclaw/hooks/<id>` 下。每个 `openclaw.hooks` 条目必须在符号链接解析后保持在包目录内；拒绝逃逸的条目。

安全说明：`openclaw hooks install` 使用 `npm install --ignore-scripts`（无生命周期脚本）安装依赖项。保持钩子包依赖树为"纯 JS/TS"，避免依赖 `postinstall` 构建的包。

## 钩子结构

### HOOK.md 格式

`HOOK.md` 文件包含 YAML frontmatter 中的元数据加 Markdown 文档：

```markdown
---
name: my-hook
description: "Short description of what this hook does"
homepage: https://docs.openclaw.ai/automation/hooks#my-hook
metadata:
  { "openclaw": { "emoji": "🔗", "events": ["command:new"], "requires": { "bins": ["node"] } } }
---

# My Hook

Detailed documentation goes here...

## What It Does

- Listens for `/new` commands
- Performs some action
- Logs the result

## Requirements

- Node.js must be installed

## Configuration

No configuration needed.
```

### 元数据字段

`metadata.openclaw` 对象支持：

* **`emoji`**：CLI 显示 emoji（例如 `"💾"`）
* **`events`**：监听事件数组（例如 `["command:new", "command:reset"]`）
* **`export`**：使用的命名导出（默认为 `"default"`）
* **`homepage`**：文档 URL
* **`requires`**：可选要求
  * **`bins`**：PATH 上需要的二进制文件（例如 `["git", "node"]`）
  * **`anyBins`**：至少存在这些二进制文件之一
  * **`env`**：需要的环境变量
  * **`config`**：需要的配置路径（例如 `["workspace.dir"]`）
  * **`os`**：需要的平台（例如 `["darwin", "linux"]`）
* **`always`**：绕过资格检查（布尔值）
* **`install`**：安装方法（对于捆绑钩子：`[{"id":"bundled","kind":"bundled"}]`）

### 处理程序实现

`handler.ts` 文件导出 `HookHandler` 函数：

```typescript
const myHandler = async (event) => {
  // Only trigger on 'new' command
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  console.log(`[my-hook] New command triggered`);
  console.log(`  Session: ${event.sessionKey}`);
  console.log(`  Timestamp: ${event.timestamp.toISOString()}`);

  // Your custom logic here

  // Optionally send message to user
  event.messages.push("✨ My hook executed!");
};

export default myHandler;
```

#### 事件上下文

每个事件包括：

```typescript
{
  type: 'command' | 'session' | 'agent' | 'gateway' | 'message',
  action: string,              // e.g., 'new', 'reset', 'stop', 'received', 'sent'
  sessionKey: string,          // Session identifier
  timestamp: Date,             // When the event occurred
  messages: string[],          // Push messages here to send to user
  context: {
    // Command events:
    sessionEntry?: SessionEntry,
    sessionId?: string,
    sessionFile?: string,
    commandSource?: string,    // e.g., 'whatsapp', 'telegram'
    senderId?: string,
    workspaceDir?: string,
    bootstrapFiles?: WorkspaceBootstrapFile[],
    cfg?: OpenClawConfig,
    // Message events (see Message Events section for full details):
    from?: string,             // message:received
    to?: string,               // message:sent
    content?: string,
    channelId?: string,
    success?: boolean,         // message:sent
  }
}
```

## 事件类型

### 命令事件

在发出代理命令时触发：

* **`command`**：所有命令事件（通用监听器）
* **`command:new`**：发出 `/new` 命令时
* **`command:reset`**：发出 `/reset` 命令时
* **`command:stop`**：发出 `/stop` 命令时

### 会话事件

* **`session:compact:before`**：压缩总结历史之前
* **`session:compact:after`**：压缩完成并带有摘要元数据之后

内部钩子有效载荷将这些作为 `type: "session"` 和 `action: "compact:before"` / `action: "compact:after"` 发出；监听器使用上述组合键订阅。特定处理程序注册使用字面键格式 `${type}:${action}`。对于这些事件，注册 `session:compact:before` 和 `session:compact:after`。

### 代理事件

* **`agent:bootstrap`**：注入工作区引导文件之前（钩子可以改变 `context.bootstrapFiles`）

### 网关事件

在网关启动时触发：

* **`gateway:startup`**：渠道启动并加载钩子之后

### 消息事件

在收到或发送消息时触发：

* **`message`**：所有消息事件（通用监听器）
* **`message:received`**：从任何渠道收到入站消息时。在处理早期触发，媒体理解之前。内容可能包含尚未处理的媒体附件的原始占位符，如 `<media:audio>`。
* **`message:transcribed`**：消息完全处理后，包括音频转录和链接理解。此时，`transcript` 包含音频消息的完整转录文本。当你需要访问转录的音频内容时使用此钩子。
* **`message:preprocessed`**：在所有媒体 + 链接理解完成后为每条消息触发，让钩子访问完全丰富的正文（转录、图像描述、链接摘要），然后代理才会看到它。
* **`message:sent`**：出站消息成功发送时

#### 消息事件上下文

消息事件包括关于消息的丰富上下文：

```typescript
// message:received context
{
  from: string,           // Sender identifier (phone number, user ID, etc.)
  content: string,        // Message content
  timestamp?: number,     // Unix timestamp when received
  channelId: string,      // Channel (e.g., "whatsapp", "telegram", "discord")
  accountId?: string,     // Provider account ID for multi-account setups
  conversationId?: string, // Chat/conversation ID
  messageId?: string,     // Message ID from the provider
  metadata?: {            // Additional provider-specific data
    to?: string,
    provider?: string,
    surface?: string,
    threadId?: string,
    senderId?: string,
    senderName?: string,
    senderUsername?: string,
    senderE164?: string,
  }
}

// message:sent context
{
  to: string,             // Recipient identifier
  content: string,        // Message content that was sent
  success: boolean,       // Whether the send succeeded
  error?: string,         // Error message if sending failed
  channelId: string,      // Channel (e.g., "whatsapp", "telegram", "discord")
  accountId?: string,     // Provider account ID
  conversationId?: string, // Chat/conversation ID
  messageId?: string,    // Message ID from the provider
  metadata?: { ... },
}
```