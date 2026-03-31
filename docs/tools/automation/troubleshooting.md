---
title: troubleshooting
description: troubleshooting 页面
---

# 自动化故障排除

使用此页面进行调度器和投递问题（`cron` + `heartbeat`）的故障排除。

## 命令阶梯

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

然后运行自动化检查：

```bash
openclaw cron status
openclaw cron list
openclaw system heartbeat last
```

## Cron 未触发

```bash
openclaw cron status
openclaw cron list
openclaw cron runs --id <jobId> --limit 20
openclaw logs --follow
```

良好输出看起来像：

* `cron status` 报告启用且有未来的 `nextWakeAtMs`。
* 任务已启用且有有效的计划/时区。
* `cron runs` 显示 `ok` 或明确的跳过原因。

常见特征：

* `cron: scheduler disabled; jobs will not run automatically` → cron 在配置/环境中被禁用。
* `cron: timer tick failed` → 调度器 tick 崩溃；检查周围的堆栈/日志上下文。
* 输出中的 `reason: not-due` → 手动运行未带 `--force` 且任务尚未到期。

## Cron 触发但无投递

```bash
openclaw cron runs --id <jobId> --limit 20
openclaw cron list
openclaw channels status --probe
openclaw logs --follow
```

良好输出看起来像：

* 运行状态为 `ok`。
* 隔离任务的投递模式/目标已设置。
* 渠道探测报告目标渠道已连接。

常见特征：

* 运行成功但投递模式为 `none` → 不期望外部消息。
* 投递目标缺失/无效（`channel`/`to`）→ 运行可能在内部成功但跳过出站。
* 渠道认证错误（`unauthorized`、`missing_scope`、`Forbidden`）→ 投递被渠道凭据/权限阻止。

## 心跳被抑制或跳过

```bash
openclaw system heartbeat last
openclaw logs --follow
openclaw config get agents.defaults.heartbeat
openclaw channels status --probe
```

良好输出看起来像：

* 心跳启用且间隔非零。
* 上次心跳结果是 `ran`（或跳过原因被理解）。

常见特征：

* 带有 `reason=quiet-hours` 的 `heartbeat skipped` → 在 `activeHours` 之外。
* `requests-in-flight` → 主通道忙；心跳被推迟。
* `empty-heartbeat-file` → 间隔心跳被跳过，因为 `HEARTBEAT.md` 没有可操作内容且没有标记的 cron 事件排队。
* `alerts-disabled` → 可见性设置抑制出站心跳消息。

## 时区和 activeHours 注意事项

```bash
openclaw config get agents.defaults.heartbeat.activeHours
openclaw config get agents.defaults.heartbeat.activeHours.timezone
openclaw config get agents.defaults.userTimezone || echo "agents.defaults.userTimezone not set"
openclaw cron list
openclaw logs --follow
```

快速规则：

* `Config path not found: agents.defaults.userTimezone` 表示该键未设置；心跳回退到主机时区（如果设置则回退到 `activeHours.timezone`）。
* 无 `--tz` 的 cron 使用网关主机时区。
* 心跳 `activeHours` 使用配置的时区解析（`user`、`local` 或显式 IANA 时区）。
* 无时区的 ISO 时间戳在 cron `at` 计划中视为 UTC。

常见特征：

* 主机时区更改后任务在错误的挂钟时间运行。
* 你的白天心跳总是被跳过，因为 `activeHours.timezone` 错误。

相关：

* [/automation/cron-jobs](/automation/cron-jobs)
* [/gateway/heartbeat](/gateway/heartbeat)
* [/automation/cron-vs-heartbeat](/automation/cron-vs-heartbeat)
* [/concepts/timezone](/concepts/timezone)