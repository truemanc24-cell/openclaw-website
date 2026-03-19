# 模型提供商

# 模型提供商

本页面介绍 **LLM/模型提供商**（不是 WhatsApp/Telegram 等聊天渠道）。
模型选择规则请参阅 [/concepts/models](/concepts/models)。

## 快速规则

* 模型引用使用 `provider/model`（例如 `opencode/claude-opus-4-6`）。
* 如果设置了 `agents.defaults.models`，它将成为允许列表。
* CLI 助手：`openclaw onboard`、`openclaw models list`、`openclaw models set <provider/model>`。
* 提供商插件可以通过 `registerProvider({ catalog })` 注入模型目录；
  OpenClaw 在写入 `models.json` 之前将该输出合并到 `models.providers`。
* 提供商清单可以声明 `providerAuthEnvVars`，以便通用基于环境的认证探测不需要加载插件运行时。剩余的核心环境变量映射现在仅用于非插件/核心提供商和少数通用优先情况，如 Anthropic API 密钥优先入门。

## 内置提供商（pi-ai 目录）

OpenClaw 附带 pi-ai 目录。这些提供商**不需要** `models.providers` 配置；只需设置认证并选择模型。

### OpenAI

* 提供商：`openai`
* 认证：`OPENAI_API_KEY`
* 示例模型：`openai/gpt-5.4`

### Anthropic

* 提供商：`anthropic`
* 认证：`ANTHROPIC_API_KEY`
* 示例模型：`anthropic/claude-opus-4-6`

### OpenCode

* 认证：`OPENCODE_API_KEY`
* 示例模型：`opencode/claude-opus-4-6`

### Google Gemini

* 提供商：`google`
* 认证：`GEMINI_API_KEY`
* 示例模型：`google/gemini-3.1-pro-preview`

## 自定义提供商

使用 `models.providers` 添加自定义提供商或 OpenAI/Anthropic 兼容代理：

```json5
{
  models: {
    mode: "merge",
    providers: {
      custom: {
        baseUrl: "https://api.example.com/v1",
        apiKey: "${CUSTOM_API_KEY}",
        api: "openai-completions",
        models: [
          { id: "my-model", name: "My Model" },
        ],
      },
    },
  },
}
```

## CLI 示例

```bash
openclaw onboard --auth-choice openai-api-key
openclaw models set openai/gpt-5.4
openclaw models list
```

另请参阅：[网关配置](/gateway/configuration)了解完整配置示例。