---
title: background process
description: background process 页面
---

# 后台执行 + 进程工具

OpenClaw 通过 `exec` 工具运行 shell 命令，并将长期运行的任务保留在内存中。`process` 工具管理这些后台会话。

## exec 工具

关键参数：

* `command`（必需）
* `yieldMs`（默认 10000）：此延迟后自动后台
* `background`（布尔值）：立即后台
* `timeout`（秒，默认 1800）：此超时后终止进程
* `elevated`（布尔值）：如果启用/允许提升模式则在主机上运行
* 需要真正的 TTY？设置 `pty: true`。
* `workdir`、`env`

行为：

* 前台运行直接返回输出。
* 后台时（显式或超时），工具返回 `status: "running"` + `sessionId` 和一小段尾部。
* 输出保留在内存中，直到会话被轮询或清除。
* 如果 `process` 工具被禁止，`exec` 同步运行并忽略 `yieldMs`/`background`。
* 生成的后台 exec 命令接收 `OPENCLAW_SHELL=exec` 以进行上下文感知的 shell/profile 规则。

## 子进程桥接

当在 exec/process 工具外部生成长期运行的子进程时（例如 CLI 重生或网关辅助工具），附加子进程桥接助手，以便终止信号被转发，退出/错误时监听器被分离。这避免了 systemd 上的孤立进程，并保持跨平台的关闭行为一致。

环境变量覆盖：

* `PI_BASH_YIELD_MS`：默认 yield（毫秒）
* `PI_BASH_MAX_OUTPUT_CHARS`：内存输出上限（字符）
* `OPENCLAW_BASH_PENDING_MAX_OUTPUT_CHARS`：每个流的待处理 stdout/stderr 上限（字符）
* `PI_BASH_JOB_TTL_MS`：已完成会话的 TTL（毫秒，限制为 1 分钟-3 小时）

配置（首选）：

* `tools.exec.backgroundMs`（默认 10000）
* `tools.exec.timeoutSec`（默认 1800）
* `tools.exec.cleanupMs`（默认 1800000）
* `tools.exec.notifyOnExit`（默认 true）：当后台 exec 退出时加入系统事件 + 请求心跳
* `tools.exec.notifyOnExitEmptySuccess`（默认 false）：为 true 时，也为产生无输出的成功后台运行加入完成事件

## process 工具

操作：

* `list`：运行 + 已完成的会话
* `poll`：排干会话的新输出（也报告退出状态）
* `log`：读取聚合输出（支持 `offset` + `limit`）
* `write`：发送 stdin（`data`，可选 `eof`）
* `kill`：终止后台会话
* `clear`：从内存中移除已完成的会话
* `remove`：如果正在运行则杀死，否则清除（如果已完成）

注意：

* 只有后台会话才会被列出/持久化在内存中。
* 进程重启后会话会丢失（无磁盘持久化）。
* 仅当你运行 `process poll/log` 并记录工具结果时，会话日志才会保存到聊天历史。
* `process` 按代理范围；它只能看到该代理启动的会话。
* `process list` 包含派生的 `name`（命令动词 + 目标）以供快速扫描。
* `process log` 使用基于行的 `offset`/`limit`。
* 当省略 `offset` 和 `limit` 时，它返回最后 200 行并包含分页提示。
* 当提供 `offset` 但省略 `limit` 时，它从 `offset` 返回到结尾（不限制为 200）。

## 示例

运行长期任务并稍后轮询：

```json
{ "tool": "exec", "command": "sleep 5 && echo done", "yieldMs": 1000 }
```

```json
{ "tool": "process", "action": "poll", "sessionId": "<id>" }
```

立即在后台启动：

```json
{ "tool": "exec", "command": "npm run build", "background": true }
```

发送 stdin：

```json
{ "tool": "process", "action": "write", "sessionId": "<id>", "data": "y\n" }
```