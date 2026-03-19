# 模型 CLI

# 模型 CLI

有关认证配置文件轮换、冷却时间以及与回退的交互，请参阅 [/concepts/model-failover](/concepts/model-failover)。
快速提供商概览 + 示例：[/concepts/model-providers](/concepts/model-providers)。

## 模型选择的工作原理

OpenClaw 按以下顺序选择模型：

1. **主**模型（`agents.defaults.model.primary` 或 `agents.defaults.model`）。
2. **回退**在 `agents.defaults.model.fallbacks` 中（按顺序）。
3. **提供商认证故障转移**在提供商内发生，然后移动到下一个模型。

相关：

* `agents.defaults.models` 是 OpenClaw 可用的模型白名单/目录（加别名）。
* `agents.defaults.imageModel` **仅在**主模型无法接受图像时使用。
* `agents.defaults.imageGenerationModel` 由共享图像生成功能使用。如果省略，`image_generate` 仍可以从兼容的认证支持图像生成插件推断提供商默认值。
* 每代理默认值可以通过 `agents.list[].model` 加上绑定覆盖 `agents.defaults.model`（参见 [/concepts/multi-agent](/concepts/multi-agent)）。

## 快速模型策略

* 将您的主模型设置为可用的最强最新一代模型。
* 将回退用于成本/延迟敏感的任务和低风险聊天。
* 对于工具型代理或不受信任的输入，避免使用较旧/较弱模型层。

## 入门（推荐）

如果您不想手动编辑配置，请运行入门：

```bash
openclaw onboard
```

它可以为常见提供商设置模型 + 认证，包括 **OpenAI Code (Codex)** 订阅（OAuth）和 **Anthropic**（API 密钥或 `claude setup-token`）。

## 配置键（概览）

* `agents.defaults.model.primary` 和 `agents.defaults.model.fallbacks`
* `agents.defaults.imageModel.primary` 和 `agents.defaults.imageModel.fallbacks`
* `agents.defaults.imageGenerationModel.primary` 和 `agents.defaults.imageGenerationModel.fallbacks`
* `agents.defaults.models`（白名单 + 别名 + 提供商参数）
* `models.providers`（自定义提供商，写入 `models.json`）

模型引用规范化为小写。提供商别名如 `z.ai/*` 规范化为 `zai/*`。

提供商配置示例（包括 OpenCode）位于 [/gateway/configuration](/gateway/configuration#opencode)。

## "模型不允许"（以及回复为何停止）

如果设置了 `agents.defaults.models`，它成为 `/model` 和会话覆盖的**白名单**。当用户选择的模型不在该白名单中时，OpenClaw 返回：

```
Model "provider/model" is not allowed. Use /model to list available models.
```

这发生在正常回复生成**之前**，所以消息可能感觉像"没有响应"。修复方法是：

* 将模型添加到 `agents.defaults.models`，或
* 清除白名单（移除 `agents.defaults.models`），或
* 从 `/model list` 中选择模型。

示例白名单配置：

```json5
{
  agent: {
    model: { primary: "anthropic/claude-sonnet-4-5" },
    models: {
      "anthropic/claude-sonnet-4-5": { alias: "Sonnet" },
      "anthropic/claude-opus-4-6": { alias: "Opus" },
    },
  },
}
```

## 在聊天中切换模型（`/model`）

您可以不用重启即可为当前会话切换模型：

```
/model
/model list
/model 3
/model openai/gpt-5.2
/model status
```

注意：

* `/model`（和 `/model list`）是一个紧凑的编号选择器（模型系列 + 可用提供商）。
* 在 Discord 上，`/model` 和 `/models` 打开一个交互式选择器，包含提供商和模型下拉菜单以及提交步骤。
* `/model <#>` 从该选择器中选择。
* `/model status` 是详细视图（认证候选，以及配置时的提供商端点 `baseUrl` + `api` 模式）。
* 模型引用通过在**第一个**`/` 处分割来解析。输入 `/model <ref>` 时使用 `provider/model`。
* 如果模型 ID 本身包含 `/`（OpenRouter 风格），您必须包含提供商前缀（例如 `/model openrouter/moonshotai/kimi-k2`）。
* 如果省略提供商，OpenClaw 将输入视为别名或**默认提供商**的模型（仅在模型 ID 中没有 `/` 时有效）。

完整命令行为/配置：[斜杠命令](/tools/slash-commands)。

## CLI 命令

```bash
openclaw models list
openclaw models status
openclaw models set <provider/model>
openclaw models set-image <provider/model>

openclaw models aliases list
openclaw models aliases add <alias> <provider/model>
openclaw models aliases remove <alias>

openclaw models fallbacks list
openclaw models fallbacks add <provider/model>
openclaw models fallbacks remove <provider/model>
openclaw models fallbacks clear

openclaw models image-fallbacks list
openclaw models image-fallbacks add <provider/model>
openclaw models image-fallbacks remove <provider/model>
openclaw models image-fallbacks clear
```

`openclaw models`（无子命令）是 `models status` 的快捷方式。

### `models list`

默认显示配置的模型。有用的标志：

* `--all`：完整目录
* `--local`：仅本地提供商
* `--provider <name>`：按提供商过滤
* `--plain`：每行一个模型
* `--json`：机器可读输出

### `models status`

显示解析的主模型、回退、图像模型以及配置的提供商的认证概览。它还显示在 auth 存储中找到的 OAuth 过期状态（默认 24 小时内警告）。`--plain` 仅打印解析的主模型。
始终显示 OAuth 状态（并包含在 `--json` 输出中）。如果配置的提供商没有凭据，`models status` 打印**缺少认证**部分。JSON 包含 `auth.oauth`（警告窗口 + 配置文件）和 `auth.providers`（每个提供商的生效认证）。
使用 `--check` 进行自动化（缺少/过期时退出 `1`，即将过期时退出 `2`）。

认证选择取决于提供商/账户。对于始终在线的网关主机，API 密钥通常是最可预测的；也支持订阅令牌流程。

示例（Anthropic setup-token）：

```bash
claude setup-token
openclaw models status
```

## 扫描（OpenRouter 免费模型）

`openclaw models scan` 检查 OpenRouter 的**免费模型目录**，可以选择探测模型以了解工具和图像支持。

关键标志：

* `--no-probe`：跳过实时探测（仅元数据）
* `--min-params <b>`：最小参数大小（十亿）
* `--max-age-days <days>`：跳过较旧的模型
* `--provider <name>`：提供商前缀过滤器
* `--max-candidates <n>`：回退列表大小
* `--set-default`：将 `agents.defaults.model.primary` 设置为第一个选择
* `--set-image`：将 `agents.defaults.imageModel.primary` 设置为第一个图像选择

探测需要 OpenRouter API 密钥（来自认证配置文件或 `OPENROUTER_API_KEY`）。没有密钥时，使用 `--no-probe` 仅列出候选。

扫描结果排名：

1. 图像支持
2. 工具延迟
3. 上下文大小
4. 参数数量

输入

* OpenRouter `/models` 列表（过滤 `:free`）
* 需要来自认证配置文件或 `OPENROUTER_API_KEY` 的 OpenRouter API 密钥（参见 [/environment](/help/environment)）
* 可选过滤器：`--max-age-days`、`--min-params`、`--provider`、`--max-candidates`
* 探测控制：`--timeout`、`--concurrency`

在 TTY 中运行时，可以交互式选择回退。在非交互模式下，传递 `--yes` 接受默认值。

## 模型注册表（`models.json`）

`models.providers` 中的自定义提供商在代理目录下的 `models.json` 中写入（默认 `~/.openclaw/agents/<agentId>/agent/models.json`）。此文件默认合并，除非 `models.mode` 设置为 `replace`。

匹配提供商 ID 的合并模式优先级：

* 代理 `models.json` 中已存在的非空 `baseUrl` 获胜。
* 代理 `models.json` 中的非空 `apiKey` 仅在该提供商在当前配置/认证配置文件上下文中不是 SecretRef 管理时才获胜。
* SecretRef 管理的提供商 `apiKey` 值从源标记（`ENV_VAR_NAME` 用于环境引用，`secretref-managed` 用于文件/执行引用）刷新，而不是持久化解析的机密。
* SecretRef 管理的提供商标头值从源标记（`secretref-env:ENV_VAR_NAME` 用于环境引用，`secretref-managed` 用于文件/执行引用）刷新。
* 空或缺失的代理 `apiKey`/`baseUrl` 回退到配置 `models.providers`。
* 其他提供商字段从配置和规范目录数据刷新。

标记持久化是源权威的：OpenClaw 从活动源配置快照（预解析）写入标记，而不是从解析的运行时机密值。这适用于 OpenClaw 重新生成 `models.json` 的任何时候，包括命令驱动路径如 `openclaw agent`。