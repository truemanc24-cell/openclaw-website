---
title: msteams
description: msteams 页面
---

# Microsoft Teams

# Microsoft Teams（插件）

> "进入此地的人，抛弃一切希望吧。"

更新：2026-01-21

状态：支持文本 + 私信附件；频道/群组文件发送需要 `sharePointSiteId` + Graph 权限（见[在群组聊天中发送文件](#sending-files-in-group-chats)）。投票通过自适应卡发送。

## 需要插件

Microsoft Teams 作为插件发货，未与核心安装捆绑。

**重大更改 (2026.1.15)：** MS Teams 移出核心。如果您使用它，必须安装插件。

解释：保持核心安装更轻，让 MS Teams 依赖项独立更新。

通过 CLI 安装（npm 注册表）：

```bash
openclaw plugins install @openclaw/msteams
```

本地检出（从 git 仓库运行时）：

```bash
openclaw plugins install ./extensions/msteams
```

如果您在设置中选择 Teams 并且检测到 git 检出，OpenClaw 会自动提供本地安装路径。

详情：[插件](/tools/plugin)

## 快速设置（入门）

1. 安装 Microsoft Teams 插件。
2. 创建 **Azure 机器人**（应用 ID + 客户端密钥 + 租户 ID）。
3. 使用这些凭据配置 OpenClaw。
4. 通过公共 URL 或隧道公开 `/api/messages`（默认端口 3978）。
5. 安装 Teams 应用包并启动网关。

最小配置：

```json5
{
  channels: {
    msteams: {
      enabled: true,
      appId: "<APP_ID>",
      appPassword: "<APP_PASSWORD>",
      tenantId: "<TENANT_ID>",
      webhook: { port: 3978, path: "/api/messages" },
    },
  },
}
```

注意：默认情况下群组聊天被阻止（`channels.msteams.groupPolicy: "allowlist"`）。要允许群组回复，设置 `channels.msteams.groupAllowFrom`（或使用 `groupPolicy: "open"` 允许任何成员，提及门控）。

## 目标

* 通过 Teams 私信、群组聊天或频道与 OpenClaw 对话。
* 保持路由确定性：回复始终返回到达的频道。
* 默认为安全频道行为（除非另行配置，否则需要提及）。

## 配置写入

默认情况下，允许 Microsoft Teams 写入由 `/config set|unset` 触发的配置更新（需要 `commands.config: true`）。

禁用：

```json5
{
  channels: { msteams: { configWrites: false } },
}
```

## 访问控制（私信 + 群组）

**私信访问**

* 默认：`channels.msteams.dmPolicy = "pairing"`。未知发送者在批准之前被忽略。
* `channels.msteams.allowFrom` 应使用稳定的 AAD 对象 ID。
* UPN/显示名称是可变的；默认禁用直接匹配，仅在 `channels.msteams.dangerouslyAllowNameMatching: true` 时启用。
* 向导可以在凭据允许时通过 Microsoft Graph 将名称解析为 ID。

**群组访问**

* 默认：`channels.msteams.groupPolicy = "allowlist"`（阻止除非您添加 `groupAllowFrom`）。使用 `channels.defaults.groupPolicy` 覆盖未设置时的默认。
* `channels.msteams.groupAllowFrom` 控制哪些发送者可以在群组聊天/频道中触发（回退到 `channels.msteams.allowFrom`）。
* 设置 `groupPolicy: "open"` 允许任何成员（默认仍需提及门控）。
* 要**不允许任何频道**，设置 `channels.msteams.groupPolicy: "disabled"`。

示例：

```json5
{
  channels: {
    msteams: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["user@org.com"],
    },
  },
}
```

**Teams + 频道白名单**

* 通过在 `channels.msteams.teams` 下列出团队和频道来限制群组/频道回复。
* 键应使用稳定的团队 ID 和频道对话 ID。
* 当 `groupPolicy="allowlist"` 且存在团队白名单时，仅列出团队/频道被接受（提及门控）。
* 配置向导接受 `Team/Channel` 条目并为您存储它们。
* 启动时，OpenClaw 解析团队/频道和用户白名单名称为 ID（当 Graph 权限允许时）并记录映射；未解析的团队/频道名称保留为键入但默认情况下被忽略用于路由，除非启用 `channels.msteams.dangerouslyAllowNameMatching: true`。

示例：

```json5
{
  channels: {
    msteams: {
      groupPolicy: "allowlist",
      teams: {
        "My Team": {
          channels: {
            General: { requireMention: true },
          },
        },
      },
    },
  },
}
```

## 工作原理

1. 安装 Microsoft Teams 插件。
2. 创建 **Azure 机器人**（应用 ID + 密钥 + 租户 ID）。
3. 构建引用机器人并包含以下 RSC 权限的 **Teams 应用包**。
4. 将 Teams 应用安装到团队（或私信的个人范围）。
5. 在 `~/.openclaw/openclaw.json`（或环境变量）中配置 `msteams` 并启动网关。
6. 网关默认在 `/api/messages` 上监听 Bot Framework webhook 流量。

## Azure 机器人设置（前置条件）

在配置 OpenClaw 之前，您需要创建 Azure 机器人资源。

### 步骤 1：创建 Azure 机器人

1. 转到 [创建 Azure 机器人](https://portal.azure.com/#create/Microsoft.AzureBot)
2. 填写 **基础**选项卡：

   | 字段              | 值                                                    |
   | ------------------ | -------------------------------------------------------- |
   | **机器人句柄**     | 您的机器人名称，例如 `openclaw-msteams`（必须唯一） |
   | **订阅**   | 选择您的 Azure 订阅                           |
   | **资源组** | 创建新的或使用现有的                               |
   | **定价层**   | **免费**用于开发/测试                                 |
   | **应用类型**    | **单租户**（推荐 - 见下文）         |
   | **创建类型**  | **创建新的 Microsoft 应用 ID**                          |

> **弃用通知：** 2025-07-31 之后弃用创建新的多租户机器人。**新机器人使用单租户**。

3. 单击 **查看 + 创建** → **创建**（等待约 1-2 分钟）

### 步骤 2：获取凭据

1. 转到您的 Azure 机器人资源 → **配置**
2. 复制 **Microsoft 应用 ID** → 这是您的 `appId`
3. 单击 **管理密码** → 转到应用注册
4. 在 **证书和密钥** → **新客户端密钥** → 复制 **值** → 这是您的 `appPassword`
5. 转到 **概述** → 复制 **目录（租户）ID** → 这是您的 `tenantId`

### 步骤 3：配置消息传递端点

1. 在 Azure 机器人 → **配置**
2. 将 **消息传递端点** 设置为您的 webhook URL：
   * 生产：`https://your-domain.com/api/messages`
   * 本地开发：使用隧道（见下文[本地开发](#local-development-tunneling)）

### 步骤 4：启用 Teams 频道

1. 在 Azure 机器人 → **频道**
2. 单击 **Microsoft Teams** → 配置 → 保存
3. 接受服务条款

## 本地开发（隧道）

Teams 无法到达 `localhost`。用于本地开发：

**选项 A：ngrok**

```bash
ngrok http 3978
# 复制 https URL，例如 https://abc123.ngrok.io
# 将消息传递端点设置为：https://abc123.ngrok.io/api/messages
```

**选项 B：Tailscale Funnel**

```bash
tailscale funnel 3978
# 使用您的 Tailscale funnel URL 作为消息传递端点
```

## Teams 开发者门户（替代方案）

您可以使用 [Teams 开发者门户](https://dev.teams.microsoft.com/apps) 而非手动创建清单 ZIP：

1. 单击 **+ 新应用**
2. 填写基本信息（名称、描述、开发者信息）
3. 转到 **应用功能** → **机器人**
4. 选择 **手动输入机器人 ID** 并粘贴您的 Azure 机器人应用 ID
5. 选中范围：**个人**、**团队**、**群组聊天**
6. 单击 **分发** → **下载应用包**
7. 在 Teams 中：**应用** → **管理您的应用** → **上传自定义应用** → 选择 ZIP

这通常比手动编辑 JSON 清单更容易。

## 测试机器人

**选项 A：Azure Web Chat（首先验证 webhook）**

1. 在 Azure 门户 → 您的 Azure 机器人资源 → **在 Web Chat 中测试**
2. 发送消息 —— 您应该看到回复
3. 这确认您的 webhook 端点在 Teams 设置之前工作

**选项 B：Teams（应用安装后）**

1. 安装 Teams 应用（sideload 或组织目录）
2. 在 Teams 中找到机器人并发送私信
3. 检查网关日志中的活动

## 设置（最小文本）

1. **安装 Microsoft Teams 插件**
   * 从 npm：`openclaw plugins install @openclaw/msteams`
   * 从本地检出：`openclaw plugins install ./extensions/msteams`

2. **机器人注册**
   * 创建 Azure 机器人（见上文）并注意：
     * 应用 ID
     * 客户端密钥（应用密码）
     * 租户 ID（单租户）

3. **Teams 应用清单**
   * 包含带有 `botId = <App ID>` 的 `bot` 条目。
   * 范围：`personal`、`team`、`groupChat`。
   * `supportsFiles: true`（个人范围文件处理需要）。
   * 添加 RSC 权限（见下文）。
   * 创建图标：`outline.png` (32x32) 和 `color.png` (192x192)。
   * 将三个文件打包在一起：`manifest.json`、`outline.png`、`color.png`。

4. **配置 OpenClaw**

   ```json
   {
     "msteams": {
       "enabled": true,
       "appId": "<APP_ID>",
       "appPassword": "<APP_PASSWORD>",
       "tenantId": "<TENANT_ID>",
       "webhook": { "port": 3978, "path": "/api/messages" }
     }
   }
   ```

   您也可以使用环境变量代替配置键：

   * `MSTEAMS_APP_ID`
   * `MSTEAMS_APP_PASSWORD`
   * `MSTEAMS_TENANT_ID`

5. **机器人端点**
   * 将 Azure 机器人消息传递端点设置为：
     * `https://<host>:3978/api/messages`（或您选择的路径/端口）。

6. **运行网关**
   * 安装插件且存在带凭据的 `msteams` 配置时，Teams 频道自动启动。

## 历史上下文

* `channels.msteams.historyLimit` 控制有多少最近的频道/群组消息被包装到提示中。
* 回退到 `messages.groupChat.historyLimit`。设置为 `0` 禁用（默认 50）。
* 私信历史可以使用 `channels.msteams.dmHistoryLimit` 限制（用户轮次）。每用户覆盖：`channels.msteams.dms["<user_id>"].historyLimit`。

## 当前 Teams RSC 权限（清单）

这些是我们 Teams 应用清单中的**现有资源特定权限**。它们仅适用于应用安装的团队/聊天。

**对于频道（团队范围）：**

* `ChannelMessage.Read.Group`（应用程序）- 接收所有频道消息无需 @提及
* `ChannelMessage.Send.Group`（应用程序）
* `Member.Read.Group`（应用程序）
* `Owner.Read.Group`（应用程序）
* `ChannelSettings.Read.Group`（应用程序）
* `TeamMember.Read.Group`（应用程序）
* `TeamSettings.Read.Group`（应用程序）

**对于群组聊天：**

* `ChatMessage.Read.Chat`（应用程序）- 接收所有群组聊天消息无需 @提及

## 示例 Teams 清单（精简）

包含必需字段的最小有效示例。替换 ID 和 URL。

```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
  "manifestVersion": "1.23",
  "version": "1.0.0",
  "id": "00000000-0000-0000-0000-000000000000",
  "name": { "short": "OpenClaw" },
  "developer": {
    "name": "Your Org",
    "websiteUrl": "https://example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsOfUseUrl": "https://example.com/terms"
  },
  "description": { "short": "OpenClaw in Teams", "full": "OpenClaw in Teams" },
  "icons": { "outline": "outline.png", "color": "color.png" },
  "accentColor": "#5B6DEF",
  "bots": [
    {
      "botId": "11111111-1111-1111-1111-111111111111",
      "scopes": ["personal", "team", "groupChat"],
      "isNotificationOnly": false,
      "supportsCalling": false,
      "supportsVideo": false,
      "supportsFiles": true
    }
  ],
  "webApplicationInfo": {
    "id": "11111111-1111-1111-1111-111111111111"
  },
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        { "name": "ChannelMessage.Read.Group", "type": "Application" },
        { "name": "ChannelMessage.Send.Group", "type": "Application" },
        { "name": "Member.Read.Group", "type": "Application" },
        { "name": "Owner.Read.Group", "type": "Application" },
        { "name": "ChannelSettings.Read.Group", "type": "Application" },
        { "name": "TeamMember.Read.Group", "type": "Application" },
        { "name": "TeamSettings.Read.Group", "type": "Application" },
        { "name": "ChatMessage.Read.Chat", "type": "Application" }
      ]
    }
  }
}
```

### 清单注意事项（必须有字段）

* `bots[].botId` **必须**匹配 Azure 机器人应用 ID。
* `webApplicationInfo.id` **必须**匹配 Azure 机器人应用 ID。
* `bots[].scopes` 必须包含您计划使用的界面（`personal`、`team`、`groupChat`）。
* `bots[].supportsFiles: true` 是个人范围文件处理所必需的。
* `authorization.permissions.resourceSpecific` 必须包含如果您想要频道流量时的频道读/写。

### 更新现有应用

更新已安装的 Teams 应用（例如添加 RSC 权限）：

1. 使用新设置更新您的 `manifest.json`
2. **递增 `version` 字段**（例如 `1.0.0` → `1.1.0`）
3. **重新打包**清单和图标（`manifest.json`、`outline.png`、`color.png`）
4. 上传新 zip：
   * **选项 A（Teams 管理中心）：** Teams 管理中心 → Teams 应用 → 管理应用 → 找到您的应用 → 上传新版本
   * **选项 B（Sideload）：** 在 Teams 中 → 应用 → 管理您的应用 → 上传自定义应用
5. **对于团队频道：** 在每个团队中重新安装应用以使新权限生效
6. **完全退出并重新启动 Teams**（不仅仅是关闭窗口）以清除缓存的应用元数据

## 功能：仅 RSC vs Graph

### 仅 **Teams RSC**（应用已安装，无 Graph API 权限）

工作：

* 读取频道消息 **文本**内容。
* 发送频道消息 **文本**内容。
* 接收 **个人（私信）**文件附件。

不工作：

* 频道/群组 **图片或文件内容**（有效载荷仅包含 HTML 存根）。
* 下载存储在 SharePoint/OneDrive 中的附件。
* 读取消息历史记录（超过实时 webhook 事件）。

### **Teams RSC + Microsoft Graph 应用程序权限**

添加：

* 下载托管内容（粘贴到消息中的图片）。
* 下载存储在 SharePoint/OneDrive 中的文件附件。
* 通过 Graph 读取频道/聊天消息历史记录。

### RSC vs Graph API

| 功能              | RSC 权限      | Graph API                           |
| ----------------------- | -------------------- | ----------------------------------- |
| **实时消息**  | 是（通过 webhook）    | 否（仅轮询）                   |
| **历史消息** | 否                   | 是（可以查询历史）             |
| **设置复杂性**    | 仅应用清单    | 需要管理员同意 + 令牌流程 |
| **离线工作**       | 否（必须运行） | 是（随时查询）                 |

**结论：** RSC 用于实时监听；Graph API 用于历史访问。为了在离线时错过消息，您需要 Graph API 和 `ChannelMessage.Read.All`（需要管理员同意）。

## 启用 Graph 的媒体 + 历史记录（频道需要）

如果您需要**频道**中的图片/文件或想要获取**消息历史记录**，您必须启用 Microsoft Graph 权限并授予管理员同意。

1. 在 Entra ID（Azure AD）**应用注册**中，添加 Microsoft Graph **应用程序权限**：
   * `ChannelMessage.Read.All`（频道附件 + 历史记录）
   * `Chat.Read.All` 或 `ChatMessage.Read.All`（群组聊天）
2. **为租户授予管理员同意**。
3. 增加 Teams 应用 **清单版本**，重新上传，并在 Teams 中**重新安装应用**。
4. **完全退出并重新启动 Teams** 以清除缓存的应用元数据。

**用于用户提及的其他权限：** 用户 @提及开箱即用适用于对话中的用户。但是，如果您想动态搜索和提及**不在当前对话中的用户**，添加 `User.Read.All`（应用程序）权限并授予管理员同意。

## 已知限制

### Webhook 超时

Teams 通过 HTTP webhook 传递消息。如果处理时间过长（例如 LLM 响应慢），您可能会看到：

* 网关超时
* Teams 重试消息（导致重复）
* 丢失回复

OpenClaw 通过快速返回并主动发送回复来处理这个问题，但非常慢的响应可能仍然导致问题。

### 格式

Teams markdown 比 Slack 或 Discord 更有限：

* 基本格式有效：**粗体**、*斜体*、`代码`、链接
* 复杂 markdown（表格、嵌套列表）可能无法正确渲染
* 支持投票和任意卡片发送的自适应卡（见下文）

## 配置

关键设置（请参阅 `/gateway/configuration` 了解共享渠道模式）：

* `channels.msteams.enabled`：启用/禁用渠道。
* `channels.msteams.appId`、`channels.msteams.appPassword`、`channels.msteams.tenantId`：机器人凭据。
* `channels.msteams.webhook.port`（默认 `3978`）
* `channels.msteams.webhook.path`（默认 `/api/messages`）
* `channels.msteams.dmPolicy`：`pairing | allowlist | open | disabled`（默认：pairing）
* `channels.msteams.allowFrom`：私信白名单（推荐 AAD 对象 ID）。向导在 Graph 访问可用时在设置期间将名称解析为 ID。
* `channels.msteams.dangerouslyAllowNameMatching`：紧急开关，重新启用可变 UPN/显示名称匹配和直接团队/频道名称路由。
* `channels.msteams.textChunkLimit`：出站文本块大小。
* `channels.msteams.chunkMode`：`length`（默认）或 `newline` 在长度分块之前按空行（段落边界）拆分。
* `channels.msteams.mediaAllowHosts`：入站附件主机白名单（默认为 Microsoft/Teams 域）。
* `channels.msteams.mediaAuthAllowHosts`：在媒体重试时附加授权标头的主机白名单（默认为 Graph + Bot Framework 主机）。
* `channels.msteams.requireMention`：在频道/群组中需要 @提及（默认 true）。
* `channels.msteams.replyStyle`：`thread | top-level`（见[回复样式](#reply-style-threads-vs-posts)）。
* `channels.msteams.teams.<teamId>.replyStyle`：按团队覆盖。
* `channels.msteams.teams.<teamId>.requireMention`：按团队覆盖。
* `channels.msteams.teams.<teamId>.tools`：默认按团队工具策略覆盖（`allow`/`deny`/`alsoAllow`）用于缺少频道覆盖时。
* `channels.msteams.teams.<teamId>.toolsBySender`：默认按团队按发送者工具策略覆盖（支持 `"*"` 通配符）。
* `channels.msteams.teams.<teamId>.channels.<conversationId>.replyStyle`：按频道覆盖。
* `channels.msteams.teams.<teamId>.channels.<conversationId>.requireMention`：按频道覆盖。
* `channels.msteams.teams.<teamId>.channels.<conversationId>.tools`：按频道工具策略覆盖（`allow`/`deny`/`alsoAllow`）。
* `channels.msteams.teams.<teamId>.channels.<conversationId>.toolsBySender`：按频道按发送者工具策略覆盖（支持 `"*"` 通配符）。
* `toolsBySender` 键应使用明确前缀：
  `id:`、`e164:`、`username:`、`name:`（传统无前缀键仍仅映射到 `id:`）。
* `channels.msteams.sharePointSiteId`：群组聊天/频道文件上传的 SharePoint 站点 ID（见[在群组聊天中发送文件](#sending-files-in-group-chats)）。

## 路由和会话

* 会话键遵循标准代理格式（见 [/concepts/session](/concepts/session)）：
  * 私信共享主会话（`agent:<agentId>:<mainKey>`）。
  * 频道/群组消息使用对话 id：
    * `agent:<agentId>:msteams:channel:<conversationId>`
    * `agent:<agentId>:msteams:group:<conversationId>`

## 回复样式：线程 vs 帖子

Teams 最近在相同底层数据模型上引入了两种频道 UI 样式：

| 样式                    | 描述                                               | 推荐 `replyStyle` |
| ------------------------ | --------------------------------------------------------- | ------------------------ |
| **帖子**（经典）      | 消息显示为卡片，回复在线程下嵌套 | `thread`（默认）       |
| **线程**（类似 Slack） | 消息线性流动，更像 Slack                   | `top-level`              |

**问题：** Teams API 不暴露频道使用哪种 UI 样式。如果您使用错误的 `replyStyle`：

* `thread` 在线程样式频道中 → 回复显示尴尬地嵌套
* `top-level` 在帖子样式频道中 → 回复显示为单独的顶级帖子，而不是在线程中

**解决方案：** 根据频道设置方式按频道配置 `replyStyle`：

```json
{
  "msteams": {
    "replyStyle": "thread",
    "teams": {
      "19:abc...@thread.tacv2": {
        "channels": {
          "19:xyz...@thread.tacv2": {
            "replyStyle": "top-level"
          }
        }
      }
    }
  }
```

## 附件和图片

**当前限制：**

* **私信：** 图片和文件附件通过 Teams 机器人文件 API 工作。
* **频道/群组：** 附件存储在 M365 存储（SharePoint/OneDrive）中。Webhook 有效载荷仅包含 HTML 存根，而不是实际的文件字节。**需要 Graph API 权限**才能下载频道附件。

没有 Graph 权限，带图片的频道消息将作为纯文本接收（图片内容对机器人不可访问）。
默认情况下，OpenClaw 仅从 Microsoft/Teams 主机名下载媒体。使用 `channels.msteams.mediaAllowHosts` 覆盖（使用 `["*"]` 允许任何主机）。
授权标头仅附加到 `channels.msteams.mediaAuthAllowHosts` 中的主机（默认为 Graph + Bot Framework 主机）。保持此列表严格（避免多租户后缀）。

## 在群组聊天中发送文件

机器人可以使用 FileConsentCard 流程在私信中发送文件（内置）。但是，**在群组聊天/频道中发送文件**需要额外设置：

| 上下文                  | 文件发送方式                           | 设置需要                                    |
| ------------------------ | -------------------------------------------- | ----------------------------------------------- |
| **私信**                  | FileConsentCard → 用户接受 → 机器人上传 | 开箱即用                            |
| **群组聊天/频道** | 上传到 SharePoint → 分享链接            | 需要 `sharePointSiteId` + Graph 权限 |
| **图片（任何上下文）** | Base64 编码内联                        | 开箱即用                           |

### 为什么群组聊天需要 SharePoint

机器人没有个人 OneDrive 驱动器（`/me/drive` Graph API 端点不适用于应用程序身份）。要发送群组聊天/频道中的文件，机器人上传到 **SharePoint 站点** 并创建分享链接。

### 设置

1. **在 Entra ID（Azure AD）应用注册中添加 Graph API 权限：**
   * `Sites.ReadWrite.All`（应用程序）- 上传文件到 SharePoint
   * `Chat.Read.All`（应用程序）- 可选，启用每用户分享链接

2. **为租户授予管理员同意**。

3. **获取您的 SharePoint 站点 ID：**

   ```bash
   # 通过 Graph Explorer 或使用有效令牌的 curl：
   curl -H "Authorization: Bearer $TOKEN" \
     "https://graph.microsoft.com/v1.0/sites/{hostname}:/{site-path}"

   # 示例：对于 "contoso.sharepoint.com/sites/BotFiles" 上的站点
   curl -H "Authorization: Bearer $TOKEN" \
     "https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/BotFiles"

   # 响应包括："id": "contoso.sharepoint.com,guid1,guid2"
   ```

4. **配置 OpenClaw：**

   ```json5
   {
     channels: {
       msteams: {
         // ... 其他配置 ...
         sharePointSiteId: "contoso.sharepoint.com,guid1,guid2",
       },
     },
   }
   ```

### 分享行为

| 权限                              | 分享行为                                          |
| --------------------------------------- | --------------------------------------------------------- |
| 仅 `Sites.ReadWrite.All`              | 组织范围内的分享链接（组织中的任何人都可以访问） |
| `Sites.ReadWrite.All` + `Chat.Read.All` | 每用户分享链接（只有聊天成员可以访问）      |

每用户分享更安全，因为只有聊天参与者可以访问文件。如果缺少 `Chat.Read.All` 权限，机器人回退到组织范围内的分享。

### 回退行为

| 场景                                          | 结果                                             |
| ------------------------------------------------- | -------------------------------------------------- |
| 群组聊天 + 文件 + 配置了 `sharePointSiteId` | 上传到 SharePoint，发送分享链接            |
| 群组聊天 + 文件 + 无 `sharePointSiteId`         | 尝试 OneDrive 上传（可能失败），仅发送文本 |
| 个人聊天 + 文件                              | FileConsentCard 流程（无需 SharePoint 即可在工作）    |
| 任何上下文 + 图片                              | Base64 编码内联（无需 SharePoint 即可在工作）   |

### 文件存储位置

上传的文件存储在配置的 SharePoint 站点的默认文档库中的 `/OpenClawShared/` 文件夹中。

## 投票（自适应卡）

OpenClaw 将 Teams 投票作为自适应卡发送（没有原生 Teams 投票 API）。

* CLI：`openclaw message poll --channel msteams --target conversation:<id> ...`
* 投票由网关记录在 `~/.openclaw/msteams-polls.json` 中。
* 网关必须保持在线以记录投票。
* 投票尚不会自动发布结果摘要（如需要，检查存储文件）。

## 自适应卡（任意）

使用 `message` 工具或 CLI 向 Teams 用户或对话发送任何自适应卡 JSON。

`card` 参数接受自适应卡 JSON 对象。提供 `card` 时，消息文本是可选的。

**代理工具：**

```json
{
  "action": "send",
  "channel": "msteams",
  "target": "user:<id>",
  "card": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [{ "type": "TextBlock", "text": "Hello!" }]
  }
}
```

**CLI：**

```bash
openclaw message send --channel msteams \
  --target "conversation:19:abc...@thread.tacv2" \
  --card '{"type":"AdaptiveCard","version":"1.5","body":[{"type":"TextBlock","text":"Hello!"}]}'
```

有关卡片模式和示例，请参阅[自适应卡文档](https://adaptivecards.io/)。有关目标格式详情，请参阅下文[目标格式](#target-formats)。

## 目标格式

MSTeams 目标使用前缀区分用户和对话：

| 目标类型         | 格式                           | 示例                                             |
| ------------------- | -------------------------------- | --------------------------------------------------- |
| 用户（按 ID）        | `user:<aad-object-id>`           | `user:40a1a0ed-4ff2-4164-a219-55518990c197`         |
| 用户（按名称）      | `user:<display-name>`            | `user:John Smith`（需要 Graph API）              |
| 群组/频道       | `conversation:<conversation-id>` | `conversation:19:abc123...@thread.tacv2`            |
| 群组/频道（原始） | `<conversation-id>`              | `19:abc123...@thread.tacv2`（如果包含 `@thread`） |

**CLI 示例：**

```bash
# 按 ID 发送给用户
openclaw message send --channel msteams --target "user:40a1a0ed-..." --message "Hello"

# 按显示名称发送给用户（触发 Graph API 查找）
openclaw message send --channel msteams --target "user:John Smith" --message "Hello"

# 发送给群组聊天或频道
openclaw message send --channel msteams --target "conversation:19:abc...@thread.tacv2" --message "Hello"

# 向对话发送自适应卡
openclaw message send --channel msteams --target "conversation:19:abc...@thread.tacv2" \
  --card '{"type":"AdaptiveCard","version":"1.5","body":[{"type":"TextBlock","text":"Hello"}]}'
```

**代理工具示例：**

```json
{
  "action": "send",
  "channel": "msteams",
  "target": "user:John Smith",
  "message": "Hello!"
}
```

```json
{
  "action": "send",
  "channel": "msteams",
  "target": "conversation:19:abc...@thread.tacv2",
  "card": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [{ "type": "TextBlock", "text": "Hello" }]
  }
}
```

注意：没有 `user:` 前缀，名称默认为群组/团队解析。按显示名称定位人员时始终使用 `user:`。

## 主动消息

* 主动消息仅在用户交互后才有可能，因为我们在那时存储对话引用。
* 有关 `dmPolicy` 和白名单门控，请参阅 `/gateway/configuration`。

## 团队和频道 ID（常见陷阱）

Teams URL 中的 `groupId` 查询参数**不是**用于配置的团队 ID。从 URL 路径提取 ID：

**团队 URL：**

```
https://teams.microsoft.com/l/team/19%3ABk4j...%40thread.tacv2/conversations?groupId=...
                                    └────────────────────────────┘
                                    团队 ID（URL 解码此）
```

**频道 URL：**

```
https://teams.microsoft.com/l/channel/19%3A15bc...%40thread.tacv2/ChannelName?groupId=...
                                      └─────────────────────────┘
                                      频道 ID（URL 解码此）
```

**用于配置：**

* 团队 ID = `/team/` 后的路径段（URL 解码，例如 `19:Bk4j...@thread.tacv2`）
* 频道 ID = `/channel/` 后的路径段（URL 解码）
* **忽略** `groupId` 查询参数

## 私有频道

机器人在私有频道中支持有限：

| 功能                      | 标准频道 | 私有频道       |
| ---------------------------- | ----------------- | ---------------------- |
| 机器人安装             | 是               | 有限                    |
| 实时消息（webhook） | 是               | 可能不工作           |
| RSC 权限              | 是               | 可能表现不同 |
| @提及                    | 是               | 如果机器人可访问   |
| Graph API 历史记录            | 是               | 是（带权限） |

**如果私有频道不工作的解决方法：**

1. 使用标准频道进行机器人交互
2. 使用私信 —— 用户始终可以直接向机器人发送消息
3. 使用 Graph API 进行历史访问（需要 `ChannelMessage.Read.All`）

## 故障排除

### 常见问题

* **频道中的图片不显示：** 缺少 Graph 权限或管理员同意。重新安装 Teams 应用并完全退出/重新打开 Teams。
* **频道中无回复：** 默认需要提及；设置 `channels.msteams.requireMention=false` 或按团队/频道配置。
* **版本不匹配（Teams 仍显示旧清单）：** 移除并重新添加应用并完全退出 Teams 以刷新。
* **Webhook 401 未授权：** 手动测试时预期，当无 Azure JWT 时 - 表示端点可到达但认证失败。使用 Azure Web Chat 正确测试。

### 清单上传错误

* **"图标文件不能为空"：** 清单引用的图标文件为 0 字节。创建有效的 PNG 图标（`outline.png` 为 32x32，`color.png` 为 192x192）。
* **"webApplicationInfo.Id 已被使用"：** 应用仍安装在另一个团队/聊天中。首先找到并卸载它，或者等待 5-10 分钟传播。
* **上传时"出错了"：** 改用 [https://admin.teams.microsoft.com](https://admin.teams.microsoft.com) 上传，打开浏览器开发者工具 (F12) → 网络选项卡，并检查响应正文中的实际错误。
* **Sideload 失败：** 尝试"将应用上传到组织的应用目录"而不是"上传自定义应用"——这通常可以绕过 sideload 限制。

### RSC 权限不工作

1. 验证 `webApplicationInfo.id` 正好匹配您的机器人应用 ID
2. 重新上传应用并在团队/聊天中重新安装
3. 检查您的组织管理员是否阻止了 RSC 权限
4. 确认您使用正确的范围：`ChannelMessage.Read.Group` 用于团队，`ChatMessage.Read.Chat` 用于群组聊天

## 参考资料

* [创建 Azure 机器人](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration) - Azure 机器人设置指南
* [Teams 开发者门户](https://dev.teams.microsoft.com/apps) - 创建/管理 Teams 应用
* [Teams 应用清单架构](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)
* [使用 RSC 接收频道消息](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/channel-messages-with-rsc)
* [RSC 权限参考](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent)
* [Teams 机器人文件处理](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/bots-filesv4)（频道/群组需要 Graph）
* [主动消息](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/send-proactive-messages)