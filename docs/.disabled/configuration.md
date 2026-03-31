---
title: configuration
description: configuration 页面
---
如果文件缺失，OpenClaw 使用安全默认值。添加配置的常见原因：

* 连接渠道并控制谁可以向机器人发送消息
* 设置模型、工具、沙箱或自动化（cron、钩子）
* 调优会话、媒体、网络或 UI

请参阅[完整参考](/gateway/configuration-reference)了解每个可用字段。

<Tip>
  **配置新手？** 从 `openclaw onboard` 开始进行交互式设置，或查看 [Configuration Examples](/gateway/configuration-examples) 指南以获取完整的可复制配置。
</Tip>

## 最小配置

```json5
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

## 编辑配置

<Tabs>
  <Tab title="交互式向导">
    ```bash
    openclaw onboard       # full onboarding flow
    openclaw configure     # config wizard
    ```
  </Tab>

  <Tab title="CLI（单行命令）">
    ```bash
    openclaw config get agents.defaults.workspace
    openclaw config set agents.defaults.heartbeat.every "2h"
    openclaw config unset plugins.entries.brave.config.webSearch.apiKey
    ```
  </Tab>

  <Tab title="控制 UI">
    打开 [http://127.0.0.1:18789](http://127.0.0.1:18789) 并使用 **Config** 选项卡。
    控制 UI 从配置模式呈现表单，并提供 **Raw JSON** 编辑器作为出路。
  </Tab>

  <Tab title="直接编辑">
    直接编辑 `~/.openclaw/openclaw.json`。网关监视文件并自动应用更改（请参阅[热重载](#config-hot-reload)）。
  </Tab>
</Tabs>

## 严格验证

<Warning>
  OpenClaw 只接受完全匹配模式的配置。未知键、格式错误的类型或无效值会导致网关**拒绝启动**。唯一根级例外是 `$schema`（字符串），以便编辑器可以附加 JSON Schema 元数据。
</Warning>

当验证失败时：

* 网关不会启动
* 只有诊断命令工作（`openclaw doctor`、`openclaw logs`、`openclaw health`、`openclaw status`）
* 运行 `openclaw doctor` 查看确切问题
* 运行 `openclaw doctor --fix`（或 `--yes`）以应用修复

## 常见任务

<AccordionGroup>
  <Accordion title="设置渠道（WhatsApp、Telegram、Discord 等）">
    每个渠道在 `channels.<provider>` 下有自己的配置部分。请参阅专门的渠道页面了解设置步骤：

    * [WhatsApp](/channels/whatsapp) — `channels.whatsapp`
    * [Telegram](/channels/telegram) — `channels.telegram`
    * [Discord](/channels/discord) — `channels.discord`
    * [Slack](/channels/slack) — `channels.slack`
    * [Signal](/channels/signal) — `channels.signal`
    * [iMessage](/channels/imessage) — `channels.imessage`
    * [Google Chat](/channels/googlechat) — `channels.googlechat`
    * [Mattermost](/channels/mattermost) — `channels.mattermost`
    * [MS Teams](/channels/msteams) — `channels.msteams`

    所有渠道共享相同的 DM 策略模式：

    ```json5
    {
      channels: {
        telegram: {
          enabled: true,
          botToken: "123:abc",
          dmPolicy: "pairing",   // pairing | allowlist | open | disabled
          allowFrom: ["tg:123"], // only for allowlist/open
        },
      },
    }
    ```
  </Accordion>

  <Accordion title="选择和配置模型">
    设置主模型和可选回退：

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

    * `agents.defaults.models` 定义模型目录，并作为 `/model` 的允许列表。
    * 模型引用使用 `provider/model` 格式（例如 `anthropic/claude-opus-4-6`）。
    * `agents.defaults.imageMaxDimensionPx` 控制转录/工具图像缩小（默认 `1200`）；较低的值通常会减少截图密集运行的视觉 token 使用。
    * 请参阅 [Models CLI](/concepts/models) 了解在聊天中切换模型，以及 [Model Failover](/concepts/model-failover) 了解 auth 轮换和回退行为。
    * 对于自定义/自托管提供商，请参阅参考中的[自定义提供商和基础 URL](/gateway/configuration-reference#custom-providers-and-base-urls)。
  </Accordion>

  <Accordion title="控制谁可以向机器人发送消息">
    DM 访问按渠道通过 `dmPolicy` 控制：

    * `"pairing"`（默认）：未知发送者获得一次性配对码以批准
    * `"allowlist"`：仅允许列表中的发送者（或配对允许存储）
    * `"open"`：允许所有入站 DM（需要 `allowFrom: ["*"]`）
    * `"disabled"`：忽略所有 DM

    对于群组，使用 `groupPolicy` + `groupAllowFrom` 或渠道特定允许列表。

    请参阅[完整参考](/gateway/configuration-reference#dm-and-group-access)了解每个渠道的详情。
  </Accordion>

  <Accordion title="设置群组聊天提及 gating">
    群组消息默认**需要提及**。按代理配置模式：

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

    * **元数据提及**：原生 @-提及（WhatsApp 点击提及、Telegram @bot 等）
    * **文本模式**：`mentionPatterns` 中的安全正则表达式模式
    * 请参阅[完整参考](/gateway/configuration-reference#group-chat-mention-gating)了解每个渠道覆盖和自聊天模式。
  </Accordion>

  <Accordion title="调优网关渠道健康监控">
    控制网关重启看起来陈旧的渠道的积极程度：

    ```json5
    {
      gateway: {
        channelHealthCheckMinutes: 5,
        channelStaleEventThresholdMinutes: 30,
        channelMaxRestartsPerHour: 10,
      },
      channels: {
        telegram: {
          healthMonitor: { enabled: false },
          accounts: {
            alerts: {
              healthMonitor: { enabled: true },
            },
          },
        },
      },
    }
    ```

    * 设置 `gateway.channelHealthCheckMinutes: 0` 以全局禁用健康监控重启。
    * `channelStaleEventThresholdMinutes` 应该大于或等于检查间隔。
    * 使用 `channels.<provider>.healthMonitor.enabled` 或 `channels.<provider>accounts.<id>.healthMonitor.enabled` 为一个渠道或账户禁用自动重启，而不禁用全局监控。
    * 请参阅 [Health Checks](/gateway/health) 了解运维调试和[完整参考](/gateway/configuration-reference#gateway)了解所有字段。
  </Accordion>

  <Accordion title="配置会话和重置">
    会话控制对话连续性和隔离：

    ```json5
    {
      session: {
        dmScope: "per-channel-peer",  // recommended for multi-user
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

    * `dmScope`：`main`（共享）| `per-peer` | `per-channel-peer` | `per-account-channel-peer`
    * `threadBindings`：线程绑定会话路由的全局默认值（Discord 支持 `/focus`、`/unfocus`、`/agents`、`/session idle` 和 `/session max-age`）。
    * 请参阅 [Session Management](/concepts/session) 了解范围、身份链接和发送策略。
    * 请参阅[完整参考](/gateway/configuration-reference#session)了解所有字段。
  </Accordion>

  <Accordion title="启用沙箱">
    在隔离的 Docker 容器中运行代理会话：

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

    请参阅 [Sandboxing](/gateway/sandboxing) 了解完整指南和[完整参考](/gateway/configuration-reference#sandbox)了解所有选项。
  </Accordion>

  <Accordion title="为官方 iOS 构建启用中继支持的推送">
    中继支持的推送在 `openclaw.json` 中配置。

    在网关配置中设置：

    ```json5
    {
      gateway: {
        push: {
          apns: {
            relay: {
              baseUrl: "https://relay.example.com",
              // Optional. Default: 10000
              timeoutMs: 10000,
            },
          },
        },
      },
    }
    ```

    CLI 等效：

    ```bash
    openclaw config set gateway.push.apns.relay.baseUrl https://relay.example.com
    ```

    这做了什么：

    * 让网关能够通过外部中继发送 `push.test`、唤醒提示和重连唤醒。
    * 使用由配对的 iOS 应用转发的注册范围的发送授权。网关不需要部署范围的中继令牌。
    * 将每个中继支持的注册绑定到 iOS 应用配对的网关身份，以便另一个网关无法重用存储的注册。
    * 将本地/手动 iOS 构建保持在直接 APNs 上。中继支持的发送仅适用于通过中继注册的分发官方构建。
    * 必须与官方/TestFlight iOS 构建中烘焙的中继基础 URL 匹配，以便注册和发送流量到达同一中继部署。

    端到端流程：

    1. 安装使用相同中继基础 URL 编译的官方/TestFlight iOS 构建。
    2. 在网关上配置 `gateway.push.apns.relay.baseUrl`。
    3. 将 iOS 应用配对到网关，并让节点和 operator 会话连接。
    4. iOS 应用获取网关身份，使用 App Attest 加上应用收据向中继注册，然后向配对的网关发布中继支持的 `push.apns.register` 有效载荷。
    5. 网关存储中继句柄和发送授权，然后将其用于 `push.test`、唤醒提示和重连唤醒。

    运维说明：