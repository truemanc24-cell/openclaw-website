# 渠道故障排除

# 渠道故障排除

当渠道连接但行为不正确时，请使用此页面。

## 命令阶梯

首先按顺序运行这些：

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

健康基线：

* `Runtime: running`
* `RPC probe: ok`
* 渠道探测显示 connected/ready

## WhatsApp

### WhatsApp 故障特征

| 症状                         | 最快检查                                       | 修复                                                     |
| ------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| 已连接但无私信回复     | `openclaw pairing list whatsapp`                    | 批准发送者或切换私信策略/白名单。           |
| 群组消息被忽略          | 检查配置中的 `requireMention` + 提及模式 | 提及机器人或放宽该群组的提及策略。 |
| 随机断连/重新登录循环 | `openclaw channels status --probe` + 日志           | 重新登录并验证凭证目录健康。   |

完整故障排除：[/channels/whatsapp#troubleshooting-quick](/channels/whatsapp#troubleshooting-quick)

## Telegram

### Telegram 故障特征

| 症状                             | 最快检查                                   | 修复                                                                         |
| ----------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `/start` 但无可用的回复流程   | `openclaw pairing list telegram`                | 批准配对或更改私信策略。                                        |
| 机器人在线但群组保持沉默   | 验证提及要求和机器人隐私模式 | 禁用隐私模式以实现群组可见性或提及机器人。                   |
| 发送失败并显示网络错误   | 检查日志中的 Telegram API 调用失败     | 修复到 `api.telegram.org` 的 DNS/IPv6/代理路由。                           |
| 启动时 `setMyCommands` 被拒绝 | 检查日志中的 `BOT_COMMANDS_TOO_MUCH`        | 减少插件/技能/自定义 Telegram 命令或禁用原生菜单。       |
| 升级后白名单阻止您   | `openclaw security audit` 和配置白名单 | 运行 `openclaw doctor --fix` 或用数字发送者 ID 替换 `@username`。 |

完整故障排除：[/channels/telegram#troubleshooting](/channels/telegram#troubleshooting)

## Discord

### Discord 故障特征

| 症状                         | 最快检查                       | 修复                                                       |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| 机器人在线但无服务器回复 | `openclaw channels status --probe`  | 允许服务器/频道并验证消息内容意图。    |
| 群组消息被忽略          | 检查日志中的提及门控丢弃 | 提及机器人或设置服务器/频道 `requireMention: false`。 |
| 私信回复缺失              | `openclaw pairing list discord`     | 批准私信配对或调整私信策略。                   |

完整故障排除：[/channels/discord#troubleshooting](/channels/discord#troubleshooting)

## Slack

### Slack 故障特征

| 症状                                | 最快检查                             | 修复                                               |
| -------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| Socket 模式已连接但无响应 | `openclaw channels status --probe`        | 验证应用令牌 + 机器人令牌和所需范围。 |
| 私信被阻止                            | `openclaw pairing list slack`             | 批准配对或放宽私信策略。               |
| 频道消息被忽略                | 检查 `groupPolicy` 和频道白名单 | 允许频道或切换策略为 `open`。     |

完整故障排除：[/channels/slack#troubleshooting](/channels/slack#troubleshooting)

## iMessage 和 BlueBubbles

### iMessage 和 BlueBubbles 故障特征

| 症状                          | 最快检查                                                           | 修复                                                   |
| -------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| 无入站事件                | 验证 webhook/服务器可达性和应用权限                  | 修复 webhook URL 或 BlueBubbles 服务器状态。          |
| 可以发送但 macOS 上无接收 | 检查 macOS 隐私权限以获取 Messages 自动化                 | 重新授予 TCC 权限并重启渠道进程。 |
| 私信发送者被阻止                | `openclaw pairing list imessage` 或 `openclaw pairing list bluebubbles` | 批准配对或更新白名单。                  |

完整故障排除：

* [/channels/imessage#troubleshooting-macos-privacy-and-security-tcc](/channels/imessage#troubleshooting-macos-privacy-and-security-tcc)
* [/channels/bluebubbles#troubleshooting](/channels/bluebubbles#troubleshooting)

## Signal

### Signal 故障特征

| 症状                         | 最快检查                              | 修复                                                      |
| ------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| 守护进程可到达但机器人沉默 | `openclaw channels status --probe`         | 验证 `signal-cli` 守护进程 URL/账户和接收模式。 |
| 私信被阻止                      | `openclaw pairing list signal`             | 批准发送者或调整私信策略。                      |
| 群组回复不触发    | 检查群组白名单和提及模式 | 添加发送者/群组或放宽门控。                       |

完整故障排除：[/channels/signal#troubleshooting](/channels/signal#troubleshooting)

## Matrix

### Matrix 故障特征

| 症状                             | 最快检查                                | 修复                                             |
| ----------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| 登录但忽略房间消息 | `openclaw channels status --probe`           | 检查 `groupPolicy` 和房间白名单。         |
| 私信不处理                  | `openclaw pairing list matrix`               | 批准发送者或调整私信策略。             |
| 加密房间失败                | 验证加密模块和加密设置 | 启用加密支持并重新加入/同步房间。 |

完整故障排除：[/channels/matrix#troubleshooting](/channels/matrix#troubleshooting)