# Google Chat

# Google Chat (Chat API)

状态：已就绪，支持通过 Google Chat API webhook（仅 HTTP）的私信 + 群组。

## 快速设置（入门）

1. 创建 Google Cloud 项目并启用 **Google Chat API**。
   * 访问：[Google Chat API 凭据](https://console.cloud.google.com/apis/api/chat.googleapis.com/credentials)
   * 如果 API 未启用，请启用它。
2. 创建 **服务账号**：
   * 点击 **创建凭据** > **服务账号**。
   * 随意命名（例如 `openclaw-chat`）。
   * 留空权限（点击 **继续**）。
   * 留空有权限的主体（点击 **完成**）。
3. 创建并下载 **JSON 密钥**：
   * 在服务账号列表中，点击您刚刚创建的那个。
   * 进入 **密钥** 选项卡。
   * 点击 **添加密钥** > **创建新密钥**。
   * 选择 **JSON** 并点击 **创建**。
4. 将下载的 JSON 文件存储在您的网关主机上（例如 `~/.openclaw/googlechat-service-account.json`）。
5. 在 [Google Cloud Console Chat Configuration](https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat) 中创建 Google Chat 应用：
   * 填写 **应用信息**：
     * **应用名称**：（例如 `OpenClaw`）
     * **头像 URL**：（例如 `https://openclaw.ai/logo.png`）
     * **描述**：（例如 `个人 AI 助手`）
   * 启用 **交互功能**。
   * 在 **功能**下，选中 **加入群组和群组对话**。
   * 在 **连接设置**下，选择 **HTTP 端点 URL**。
   * 在 **触发器**下，选择 **对所有触发器使用通用 HTTP 端点 URL**，并将其设置为您的网关公共 URL 后跟 `/googlechat`。
     * *提示：运行 `openclaw status` 找到您的网关公共 URL。*
   * 在 **可见性**下，选中 **让特定人员和群组可以使用此 Chat 应用**。
   * 在文本框中输入您的电子邮件地址（例如 `user@example.com`）。
   * 点击底部的 **保存**。
6. **启用应用状态**：
   * 保存后，**刷新页面**。
   * 找到 **应用状态** 部分（通常在保存后位于顶部或底部）。
   * 将状态更改为 **实时 - 可供用户使用**。
   * 再次点击 **保存**。
7. 使用服务账号路径 + webhook 受众配置 OpenClaw：
   * 环境变量：`GOOGLE_CHAT_SERVICE_ACCOUNT_FILE=/path/to/service-account.json`
   * 或配置：`channels.googlechat.serviceAccountFile: "/path/to/service-account.json"`。
8. 设置 webhook 受众类型 + 值（与您的 Chat 应用配置匹配）。
9. 启动网关。Google Chat 将 POST 到您的 webhook 路径。

## 添加到 Google Chat

网关运行并且您的电子邮件已添加到可见性列表后：

1. 访问 [Google Chat](https://chat.google.com/)。
2. 点击 **私信**旁边的 **+**（加号）图标。
3. 在搜索栏（通常添加人的地方），输入您在 Google Cloud Console 中配置的 **应用名称**。
   * **注意**：机器人不会出现在"市场"浏览列表中，因为它是私人应用。您必须按名称搜索。
4. 从结果中选择您的机器人。
5. 点击 **添加**或 **聊天**开始 1:1 对话。
6. 发送"Hello"触发助手！

## 公共 URL（仅 Webhook）

Google Chat webhook 需要公共 HTTPS 端点。为安全起见，**仅将 `/googlechat` 路径**暴露到互联网。保持 OpenClaw 仪表板和其他敏感端点在您的私有网络上。

### 方式 A：Tailscale Funnel（推荐）

使用 Tailscale Serve 提供私有仪表板，使用 Funnel 提供公共 webhook 路径。这使 `/` 保持私有，同时仅暴露 `/googlechat`。

1. **检查您的网关绑定到哪个地址**：

   ```bash
   ss -tlnp | grep 18789
   ```

   注意 IP 地址（例如 `127.0.0.1`、`0.0.0.0` 或您的 Tailscale IP 如 `100.x.x.x`）。

2. **仅向 tailnet 公开仪表板（端口 8443）**：

   ```bash
   # 如果绑定到 localhost（127.0.0.1 或 0.0.0.0）：
   tailscale serve --bg --https 8443 http://127.0.0.1:18789

   # 如果仅绑定到 Tailscale IP（例如 100.106.161.80）：
   tailscale serve --bg --https 8443 http://100.106.161.80:18789
   ```

3. **仅公开 webhook 路径**：

   ```bash
   # 如果绑定到 localhost（127.0.0.1 或 0.0.0.0）：
   tailscale funnel --bg --set-path /googlechat http://127.0.0.1:18789/googlechat

   # 如果仅绑定到 Tailscale IP（例如 100.106.161.80）：
   tailscale funnel --bg --set-path /googlechat http://100.106.161.80:18789/googlechat
   ```

4. **授权节点使用 Funnel 访问**：
   如果出现提示，请访问输出中显示的授权 URL，以在您的 tailnet 策略中为此节点启用 Funnel。

5. **验证配置**：

   ```bash
   tailscale serve status
   tailscale funnel status
   ```

您的公共 webhook URL 将是：
`https://<node-name>.<tailnet>.ts.net/googlechat`

您的私有仪表板仅限 tailnet：
`https://<node-name>.<tailnet>.ts.net:8443/`

在 Google Chat 应用配置中使用公共 URL（不含 `:8443`）。

> 注意：此配置在重启后仍然有效。稍后要移除它，请运行 `tailscale funnel reset` 和 `tailscale serve reset`。

### 方式 B：反向代理（Caddy）

如果您使用反向代理如 Caddy，仅代理特定路径：

```caddy
your-domain.com {
    reverse_proxy /googlechat* localhost:18789
}
```

使用此配置，任何到 `your-domain.com/` 的请求都会被忽略或返回 404，而 `your-domain.com/googlechat` 被安全路由到 OpenClaw。

### 方式 C：Cloudflare Tunnel

配置隧道的入口规则，仅路由 webhook 路径：

* **路径**：`/googlechat` -> `http://localhost:18789/googlechat`
* **默认规则**：HTTP 404（未找到）

## 工作原理

1. Google Chat 将 webhook POST 发送到网关。每个请求包含 `Authorization: Bearer <token>` 标头。
   * 当标头存在时，OpenClaw 在读取/解析完整 webhook 正文之前验证承载令牌身份验证。
   * 正文中包含 `authorizationEventObject.systemIdToken` 的 Google Workspace 附加组件请求通过更严格的预认证正文预算支持。
2. OpenClaw 根据配置的 `audienceType` + `audience` 验证令牌：
   * `audienceType: "app-url"` → 受众是您的 HTTPS webhook URL。
   * `audienceType: "project-number"` → 受众是 Cloud 项目号。
3. 消息按群组路由：
   * 私信使用会话键 `agent:<agentId>:googlechat:direct:<spaceId>`。
   * 群组使用会话键 `agent:<agentId>:googlechat:group:<spaceId>`。
4. 私信访问默认是配对模式。未知发送者收到配对代码；使用以下方式批准：
   * `openclaw pairing approve googlechat <code>`
5. 群组默认需要 @-提及。如果提及检测需要应用的用户名，请使用 `botUser`。

## 目标

将这些标识符用于投递和白名单：

* 私信：`users/<userId>`（推荐）。
* 原始电子邮件 `name@example.com` 是可变的，仅在 `channels.googlechat.dangerouslyAllowNameMatching: true` 时用于直接白名单匹配。
* 已弃用：`users/<email>` 被视为用户 ID，而不是电子邮件白名单。
* 群组：`spaces/<spaceId>`。

## 配置要点

```json5
{
  channels: {
    googlechat: {
      enabled: true,
      serviceAccountFile: "/path/to/service-account.json",
      // 或 serviceAccountRef: { source: "file", provider: "filemain", id: "/channels/googlechat/serviceAccount" }
      audienceType: "app-url",
      audience: "https://gateway.example.com/googlechat",
      webhookPath: "/googlechat",
      botUser: "users/1234567890", // 可选；有助于提及检测
      dm: {
        policy: "pairing",
        allowFrom: ["users/1234567890"],
      },
      groupPolicy: "allowlist",
      groups: {
        "spaces/AAAA": {
          allow: true,
          requireMention: true,
          users: ["users/1234567890"],
          systemPrompt: "简短回答。",
        },
      },
      actions: { reactions: true },
      typingIndicator: "message",
      mediaMaxMb: 20,
    },
  },
}
```

注意：

* 服务账号凭据也可以通过 `serviceAccount`（JSON 字符串）内联传递。
* 也支持 `serviceAccountRef`（env/file SecretRef），包括 `channels.googlechat.accounts.<id>.serviceAccountRef` 下的按账户引用。
* 默认 webhook 路径是 `/googlechat`（如果未设置 `webhookPath`）。
* `dangerouslyAllowNameMatching` 重新启用可变电子邮件主体匹配用于白名单（紧急兼容性模式）。
* 当 `actions.reactions` 启用时，可以通过 `reactions` 工具和 `channels action` 使用反应。
* `typingIndicator` 支持 `none`、`message`（默认）和 `reaction`（反应需要用户 OAuth）。
* 附件通过 Chat API 下载并存储在媒体管道中（大小由 `mediaMaxMb` 限制）。

密钥参考详情：[密钥管理](/gateway/secrets)。

## 故障排除

### 405 Method Not Allowed

如果 Google Cloud 日志浏览器显示如下错误：

```
status code: 405, reason phrase: HTTP error response: HTTP/1.1 405 Method Not Allowed
```

这意味着 webhook 处理器未注册。常见原因：

1. **渠道未配置**：配置中缺少 `channels.googlechat` 部分。使用以下命令验证：

   ```bash
   openclaw config get channels.googlechat
   ```

   如果返回"未找到配置路径"，请添加配置（请参阅[配置要点](#config-highlights)）。

2. **插件未启用**：检查插件状态：

   ```bash
   openclaw plugins list | grep googlechat
   ```

   如果显示"disabled"，请在配置中添加 `plugins.entries.googlechat.enabled: true`。

3. **网关未重启**：添加配置后，重启网关：

   ```bash
   openclaw gateway restart
   ```

验证渠道正在运行：

```bash
openclaw channels status
# 应显示：Google Chat default: enabled, configured, ...
```

### 其他问题

* 检查 `openclaw channels status --probe` 是否有身份验证错误或缺少受众配置。
* 如果没有消息到达，请确认 Chat 应用的 webhook URL + 事件订阅。
* 如果提及门控阻止回复，请将 `botUser` 设置为应用的用户资源名称并验证 `requireMention`。
* 发送测试消息时使用 `openclaw logs --follow` 查看请求是否到达网关。

相关文档：

* [网关配置](/gateway/configuration)
* [安全](/gateway/security)
* [反应](/tools/reactions)