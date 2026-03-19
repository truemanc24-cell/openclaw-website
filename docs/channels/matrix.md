# Matrix

# Matrix（插件）

Matrix 是一个开放的、去中心化的消息协议。OpenClaw 作为 Matrix **用户**连接任何 homeserver，因此您需要为机器人创建 Matrix 账户。登录后，您可以直接私信机器人或将其邀请到房间（Matrix"群组"）。Beeper 也是有效的客户端选项，但它需要启用 E2EE。

状态：通过插件支持（@vector-im/matrix-bot-sdk）。支持私信、房间、线程、媒体、反应、投票（发送 + 投票开始作为文本）、位置和 E2EE（带加密支持）。

## 需要插件

Matrix 作为插件发货，未与核心安装捆绑。

通过 CLI 安装（npm 注册表）：

```bash
openclaw plugins install @openclaw/matrix
```

本地检出（从 git 仓库运行时）：

```bash
openclaw plugins install ./extensions/matrix
```

如果您在设置中选择 Matrix 并且检测到 git 检出，OpenClaw 会自动提供本地安装路径。

详情：[插件](/tools/plugin)

## 设置

1. 安装 Matrix 插件：
   * 从 npm：`openclaw plugins install @openclaw/matrix`
   * 从本地检出：`openclaw plugins install ./extensions/matrix`

2. 在 homeserver 上创建 Matrix 账户：
   * 浏览托管选项 [https://matrix.org/ecosystem/hosting/](https://matrix.org/ecosystem/hosting/)
   * 或自行托管。

3. 获取机器人账户的访问令牌：

   * 使用 `curl` 在您的 home 服务器上使用 Matrix 登录 API：

   ```bash
   curl --request POST \
     --url https://matrix.example.org/_matrix/client/v3/login \
     --header 'Content-Type: application/json' \
     --data '{
     "type": "m.login.password",
     "identifier": {
       "type": "m.id.user",
       "user": "your-user-name"
     },
     "password": "your-password"
   }'
   ```

   * 将 `matrix.example.org` 替换为您的 homeserver URL。
   * 或设置 `channels.matrix.userId` + `channels.matrix.password`：OpenClaw 调用相同的登录端点，将访问令牌存储在 `~/.openclaw/credentials/matrix/credentials.json` 中，并在下次启动时重用它。

4. 配置凭据：
   * 环境变量：`MATRIX_HOMESERVER`、`MATRIX_ACCESS_TOKEN`（或 `MATRIX_USER_ID` + `MATRIX_PASSWORD`）
   * 或配置：`channels.matrix.*`
   * 如果两者都设置，配置优先。
   * 使用访问令牌：用户 ID 通过 `/whoami` 自动获取。
   * 设置时，`channels.matrix.userId` 应该是完整的 Matrix ID（例如 `@bot:example.org`）。

5. 重启网关（或完成设置）。

6. 从任何 Matrix 客户端（Element、Beeper 等；参见 [https://matrix.org/ecosystem/clients/](https://matrix.org/ecosystem/clients/)）开始与机器人私信或将其邀请到房间。Beeper 需要 E2EE，因此设置 `channels.matrix.encryption: true` 并验证设备。

最小配置（访问令牌，用户 ID 自动获取）：

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_***",
      dm: { policy: "pairing" },
    },
  },
}
```

E2EE 配置（启用端到端加密）：

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_***",
      encryption: true,
      dm: { policy: "pairing" },
    },
  },
}
```

## 加密（E2EE）

通过 Rust 加密 SDK **支持**端到端加密。

使用 `channels.matrix.encryption: true` 启用：

* 如果加密模块加载，加密房间会自动解密。
* 出站媒体在发送到加密房间时加密。
* 首次连接时，OpenClaw 向您的其他会话请求设备验证。
* 在另一个 Matrix 客户端（Element 等）中验证设备以启用密钥共享。
* 如果无法加载加密模块，E2EE 被禁用且加密房间不会解密；OpenClaw 记录警告。
* 如果看到缺少加密模块错误（例如 `@matrix-org/matrix-sdk-crypto-nodejs-*`），允许 `@matrix-org/matrix-sdk-crypto-nodejs` 的构建脚本并运行 `pnpm rebuild @matrix-org/matrix-sdk-crypto-nodejs` 或使用 `node node_modules/@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js` 获取二进制文件。

加密状态按账户 + 访问令牌存储在 `~/.openclaw/matrix/accounts/<account>/<homeserver>__<user>/<token-hash>/crypto/`（SQLite 数据库）。同步状态与其一起存储在 `bot-storage.json` 中。如果访问令牌（设备）更改，会创建新存储，机器人必须为加密房间重新验证。

**设备验证：**
启用 E2EE 后，机器人在启动时将向您的其他会话请求验证。打开 Element（或另一个客户端）并批准验证请求以建立信任。一旦验证，机器人可以解密加密房间中的消息。

## 多账户

多账户支持：使用 `channels.matrix.accounts` 和每账户凭据及可选 `name`。参见 [`gateway/configuration`](/gateway/configuration#telegramaccounts--discordaccounts--slackaccounts--signalaccounts--imessageaccounts) 了解共享模式。

每个账户作为独立的 Matrix 用户在任何 homeserver 上运行。每账户配置继承自顶层 `channels.matrix` 设置并可以覆盖任何选项（私信策略、群组、加密等）。

```json5
{
  channels: {
    matrix: {
      enabled: true,
      dm: { policy: "pairing" },
      accounts: {
        assistant: {
          name: "Main assistant",
          homeserver: "https://matrix.example.org",
          accessToken: "syt_assistant_***",
          encryption: true,
        },
        alerts: {
          name: "Alerts bot",
          homeserver: "https://matrix.example.org",
          accessToken: "syt_alerts_***",
          dm: { policy: "allowlist", allowFrom: ["@admin:example.org"] },
        },
      },
    },
  },
}
```

注意：

* 账户启动是串行化的，以避免并发模块导入的竞争条件。
* 环境变量（`MATRIX_HOMESERVER`、`MATRIX_ACCESS_TOKEN` 等）仅适用于 **默认**账户。
* 基础渠道设置（私信策略、群组策略、提及门控等）适用于所有账户，除非按账户覆盖。
* 使用 `bindings[].match.accountId` 将每个账户路由到不同的代理。
* 加密状态按账户 + 访问令牌存储（每个账户有独立的密钥存储）。

## 路由模型

* 回复始终返回 Matrix。
* 私信共享代理的主会话；房间映射到群组会话。

## 访问控制（私信）

* 默认：`channels.matrix.dm.policy = "pairing"`。未知发送者收到配对代码。
* 批准方式：
  * `openclaw pairing list matrix`
  * `openclaw pairing approve matrix <CODE>`
* 公开私信：`channels.matrix.dm.policy="open"` 加上 `channels.matrix.dm.allowFrom=["*"]`。
* `channels.matrix.dm.allowFrom` 接受完整的 Matrix 用户 ID（例如 `@user:server`）。向导在目录搜索找到单个精确匹配时将显示名称解析为用户 ID。
* 不要使用显示名称或裸本地部分（例如 `"Alice"` 或 `"alice"`）。它们是模糊的，会被白名单匹配忽略。使用完整的 `@user:server` ID。

## 房间（群组）

* 默认：`channels.matrix.groupPolicy = "allowlist"`（提及门控）。使用 `channels.defaults.groupPolicy` 覆盖未设置时的默认。
* 运行时注意：如果完全缺少 `channels.matrix`，运行时回退到 `groupPolicy="allowlist"` 进行房间检查（即使设置了 `channels.defaults.groupPolicy`）。
* 使用 `channels.matrix.groups` 白名单房间（房间 ID 或别名；名称在目录搜索找到单个精确匹配时解析为 ID）：

```json5
{
  channels: {
    matrix: {
      groupPolicy: "allowlist",
      groups: {
        "!roomId:example.org": { allow: true },
        "#alias:example.org": { allow: true },
      },
      groupAllowFrom: ["@owner:example.org"],
    },
  },
}
```

* `requireMention: false` 启用该房间的自动回复。
* `groups."*"` 可以为跨房间的提及门控设置默认值。
* `groupAllowFrom` 限制哪些发送者可以在房间中触发机器人（完整的 Matrix 用户 ID）。
* 按房间 `users` 白名单可以进一步限制特定房间内的发送者（使用完整的 Matrix 用户 ID）。
* 配置向导提示输入房间白名单（房间 ID、别名或名称）并且仅在精确、唯一匹配时解析名称。
* 启动时，OpenClaw 解析白名单中的房间/用户名称为 ID 并记录映射；未解析的条目在白名单匹配中被忽略。
* 邀请默认自动加入；使用 `channels.matrix.autoJoin` 和 `channels.matrix.autoJoinAllowlist` 控制。
* 要**不允许任何房间**，设置 `channels.matrix.groupPolicy: "disabled"`（或保持空白名单）。
* 传统键：`channels.matrix.rooms`（与 `groups` 相同的形状）。

## 线程

* 支持回复线程。
* `channels.matrix.threadReplies` 控制回复是否保持在线程中：
  * `off`、`inbound`（默认）、`always`
* `channels.matrix.replyToMode` 控制不在线程中回复时的回复元数据：
  * `off`（默认）、`first`、`all`

## 功能

| 功能         | 状态                                                                               |
| --------------- | ------------------------------------------------------------------------------------ |
| 私信 | ✅ 支持                                                                          |
| 房间           | ✅ 支持                                                                          |
| 线程         | ✅ 支持                                                                          |
| 媒体           | ✅ 支持                                                                          |
| E2EE            | ✅ 支持（需要加密模块）                                                 |
| 反应       | ✅ 支持（通过工具发送/读取）                                                    |
| 投票           | ✅ 支持发送；入站投票开始转换为文本（响应/结束忽略） |
| 位置        | ✅ 支持（geo URI；忽略高度）                                              |
| 原生命令 | ✅ 支持                                                                          |

## 故障排除

首先运行这个：

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

然后如需要确认私信配对状态：

```bash
openclaw pairing list matrix
```

常见失败：

* 已登录但房间消息被忽略：房间被 `groupPolicy` 或房间白名单阻止。
* 私信被忽略：当 `channels.matrix.dm.policy="pairing"` 时发送者待批准。
* 加密房间失败：加密支持或加密设置不匹配。

分类流程：[/channels/troubleshooting](/channels/troubleshooting)

## 配置参考（Matrix）

完整配置：[配置](/gateway/configuration)

提供商选项：

* `channels.matrix.enabled`：启用/禁用渠道启动。
* `channels.matrix.homeserver`：homeserver URL。
* `channels.matrix.userId`：Matrix 用户 ID（使用访问令牌时可选）。
* `channels.matrix.accessToken`：访问令牌。
* `channels.matrix.password`：用于登录的密码（令牌存储）。
* `channels.matrix.deviceName`：设备显示名称。
* `channels.matrix.encryption`：启用 E2EE（默认：false）。
* `channels.matrix.initialSyncLimit`：初始同步限制。
* `channels.matrix.threadReplies`：`off | inbound | always`（默认：inbound）。
* `channels.matrix.textChunkLimit`：出站文本块大小（字符）。
* `channels.matrix.chunkMode`：`length`（默认）或 `newline` 在长度分块之前按空行（段落边界）拆分。
* `channels.matrix.dm.policy`：`pairing | allowlist | open | disabled`（默认：pairing）。
* `channels.matrix.dm.allowFrom`：私信白名单（完整 Matrix 用户 ID）。`open` 需要 `"*"`。向导在可能时将名称解析为 ID。
* `channels.matrix.groupPolicy`：`allowlist | open | disabled`（默认：allowlist）。
* `channels.matrix.groupAllowFrom`：群组消息的白名单发送者（完整 Matrix 用户 ID）。
* `channels.matrix.allowlistOnly`：强制白名单规则用于私信 + 房间。
* `channels.matrix.groups`：群组白名单 + 按房间设置映射。
* `channels.matrix.rooms`：传统群组白名单/配置。
* `channels.matrix.replyToMode`：线程/标签的回复模式。
* `channels.matrix.mediaMaxMb`：入站/出站媒体上限（MB）。
* `channels.matrix.autoJoin`：邀请处理（`always | allowlist | off`，默认：always）。
* `channels.matrix.autoJoinAllowlist`：自动加入的允许房间 ID/别名。
* `channels.matrix.accounts`：多账户配置，按账户 ID 键控（每个账户继承顶层设置）。
* `channels.matrix.actions`：按操作工具门控（reactions/messages/pins/memberInfo/channelInfo）。