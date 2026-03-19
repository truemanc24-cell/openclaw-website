# Cron vs Heartbeat：何时使用各自

心跳和 Cron 任务都允许你按计划运行任务。本指南帮助你选择适合你用例的正确机制。

## 快速决策指南

| 用例 | 推荐 | 原因 |
| ------------------------------------ | ------------------- | ---------------------------------------- |
| 每30分钟检查收件箱 | Heartbeat | 与其他检查批量处理，上下文感知 |
| 上午9点整发送每日报告 | Cron（隔离） | 需要精确时间 |
| 监控日历即将到来的事件 | Heartbeat | 定期感知自然适合 |
| 运行每周深度分析 | Cron（隔离） | 独立任务，可使用不同模型 |
| 20分钟后提醒我 | Cron（主会话，`--at`） | 一次性精确时间提醒 |
| 后台项目健康检查 | Heartbeat | 搭便车现有周期 |

## Heartbeat：定期感知

心跳在**主会话**中以 regular interval（默认：30分钟）运行。它们设计用于代理检查事物并浮现重要内容。

### 何时使用心跳

* **多个定期检查**：不要使用5个单独的 Cron 任务检查收件箱、日历、天气、通知和项目状态，单个心跳可以批量处理所有这些。
* **上下文感知决策**：代理有完整的主会话上下文，因此可以智能决定什么是紧急的vs可以等待的。
* **对话连续性**：心跳运行共享同一会话，因此代理记得最近的对话，可以自然跟进。
* **低开销监控**：一个心跳取代许多小的轮询任务。

### 心跳优势

* **批量多个检查**：一个代理轮次可以一起审查收件箱、日历和通知。
* **减少 API 调用**：单个心跳比5个隔离 Cron 任务更便宜。
* **上下文感知**：代理知道你一直在做什么，可以相应地优先处理。
* **智能抑制**：如果没有什么需要注意的，代理回复 `HEARTBEAT_OK`，不投递消息。
* **自然时间**：根据队列负载轻微漂移，这对大多数监控来说没问题。

### 心跳示例：HEARTBEAT.md 检查清单

```md
# Heartbeat checklist

- Check email for urgent messages
- Review calendar for events in next 2 hours
- If a background task finished, summarize results
- If idle for 8+ hours, send a brief check-in
```

代理在每个心跳时读取此内容，在一个轮次中处理所有项目。

### 配置心跳

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m", // interval
        target: "last", // explicit alert delivery target (default is "none")
        activeHours: { start: "08:00", end: "22:00" }, // optional
      },
    },
  },
}
```

请参阅 [Heartbeat](/gateway/heartbeat) 了解完整配置。

## Cron：精确调度

Cron 任务在精确时间运行，可以在隔离会话中运行而不影响主上下文。
重复整点计划自动通过确定性每个任务偏移在 0-5 分钟窗口内分散。

### 何时使用 Cron

* **需要精确时间**："每周一上午9点发送这个"（不是"大约9点左右"）。
* **独立任务**：不需要对话上下文的任务。
* **不同模型/思维**：值得使用更强大模型的重量级分析。
* **一次性提醒**："20分钟后提醒我"使用 `--at`。
* **嘈杂/频繁任务**：会弄乱主会话历史的任务。
* **外部触发**：应该独立于代理是否处于活动状态而运行的任务。

### Cron 优势

* **精确时间**：带时区支持的5字段或6字段（秒）cron 表达式。
* **内置负载分散**：重复整点计划默认最多分散5分钟。
* **每个任务控制**：使用 `--stagger <duration>` 覆盖分散或使用 `--exact` 强制精确时间。
* **会话隔离**：在 `cron:<jobId>` 中运行，不污染主历史。
* **模型覆盖**：每个任务使用更便宜或更强大的模型。
* **投递控制**：隔离任务默认为 `announce`（摘要）；根据需要选择 `none`。
* **即时投递**：Announce 模式直接发布，不等待心跳。
* **不需要代理上下文**：即使主会话空闲或压缩也会运行。
* **一次性支持**：`--at` 用于精确的未来时间戳。

### Cron 示例：每日早间简报

```bash
openclaw cron add \
  --name "Morning briefing" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate today's briefing: weather, calendar, top emails, news summary." \
  --model opus \
  --announce \
  --channel whatsapp \
  --to "+15551234567"
```

这在纽约时间上午7点整运行，使用 Opus 以获得质量，并将摘要直接发布到 WhatsApp。

### Cron 示例：一次性提醒

```bash
openclaw cron add \
  --name "Meeting reminder" \
  --at "20m" \
  --session main \
  --system-event "Reminder: standup meeting starts in 10 minutes." \
  --wake now \
  --delete-after-run
```

请参阅 [Cron 任务](/automation/cron-jobs) 了解完整 CLI 参考。

## 决策流程图

```
任务需要精确时间运行吗？
  是 -> 使用 Cron
  否 -> 继续...

任务需要与主会话隔离吗？
  是 -> 使用 Cron（隔离）
  否 -> 继续...

这个任务可以与其他定期检查批量处理吗？
  是 -> 使用心跳（添加到 HEARTBEAT.md）
  否 -> 使用 Cron

这是一次性提醒吗？
  是 -> 使用 Cron 和 --at
  否 -> 继续...

它需要不同的模型或思维级别吗？
  是 -> 使用 Cron（隔离）和 --model/--thinking
  否 -> 使用心跳
```

## 结合两者

最高效的设置是**两者都用**：

1. **Heartbeat** 处理常规监控（收件箱、日历、通知），每30分钟批量处理一个轮次。
2. **Cron** 处理精确计划（每日报告、每周回顾）和一次性提醒。

### 示例：高效自动化设置

**HEARTBEAT.md**（每30分钟检查）：

```md
# Heartbeat checklist

- Scan inbox for urgent emails
- Check calendar for events in next 2h
- Review any pending tasks
- Light check-in if quiet for 8+ hours
```

**Cron 任务**（精确时间）：

```bash
# Daily morning briefing at 7am
openclaw cron add --name "Morning brief" --cron "0 7 * * *" --session isolated --message "..." --announce

# Weekly project review on Mondays at 9am
openclaw cron add --name "Weekly review" --cron "0 9 * * 1" --session isolate