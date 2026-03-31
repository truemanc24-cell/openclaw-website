---
title: usage tracking
description: usage tracking 页面
---

# 使用量跟踪

# 使用量跟踪

## 是什么

* 直接从提供商的用量/配额端点拉取。
* 无估计成本；仅提供商报告的窗口。

## 显示位置

* 聊天中的 `/status`：带有会话令牌 + 估计成本（仅 API 密钥）的 emoji 丰富状态卡。当前模型提供商的提供商用量（如果有）。
* 聊天中的 `/usage off|tokens|full`：每回复用量页脚（OAuth 仅显示令牌）。
* 聊天中的 `/usage cost`：从 OpenClaw 会话日志聚合的本地成本摘要。
* CLI：`openclaw status --usage` 打印完整的每个提供商细分。
* CLI：`openclaw channels list` 在提供商配置旁边打印相同的用量快照（使用 `--no-usage` 跳过）。
* macOS 菜单栏：上下文下的"用量"部分（仅在可用时显示）。

## 提供商 + 凭据

* **Anthropic (Claude)**：认证配置中的 OAuth 令牌。
* **GitHub Copilot**：认证配置中的 OAuth 令牌。
* **Gemini CLI**：认证配置中的 OAuth 令牌。
* **Antigravity**：认证配置中的 OAuth 令牌。
* **OpenAI Codex**：认证配置中的 OAuth 令牌（存在时使用 accountId）。
* **MiniMax**：API 密钥（编码计划密钥；`MINIMAX_CODE_PLAN_KEY` 或 `MINIMAX_API_KEY`）；使用 5 小时编码计划窗口。
* **z.ai**：通过 env/config/认证存储的 API 密钥。

如果没有匹配的 OAuth/API 凭据，用量被隐藏。