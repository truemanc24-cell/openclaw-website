# 身份验证监控

OpenClaw 通过 `openclaw models status` 暴露 OAuth 过期健康状态。将其用于自动化和告警；脚本是可选的辅助工具，适用于手机工作流。

## 推荐方式：CLI 检查（便携式）

```bash
openclaw models status --check
```

退出码：

* `0`：正常
* `1`：凭据已过期或缺失
* `2`：即将过期（24小时内）

这适用于 cron/systemd，无需额外脚本。

## 可选脚本（运维/手机工作流）

这些脚本位于 `scripts/` 目录下，是**可选的**。它们假设可以 SSH 访问网关主机，适用于 systemd + Termux 环境。

* `scripts/claude-auth-status.sh` 现在使用 `openclaw models status --json` 作为真实来源（如果 CLI 不可用则回退到直接文件读取），因此请将 `openclaw` 保持在 `PATH` 中以供定时器使用。
* `scripts/auth-monitor.sh`：cron/systemd 定时器目标；发送告警（ntfy 或手机）。
* `scripts/systemd/openclaw-auth-monitor.{service,timer}`：systemd 用户定时器。
* `scripts/claude-auth-status.sh`：Claude Code + OpenClaw 身份验证检查器（完整/json/简单模式）。
* `scripts/mobile-reauth.sh`：通过 SSH 引导的重新认证流程。
* `scripts/termux-quick-auth.sh`：一键式小部件状态 + 打开认证 URL。
* `scripts/termux-auth-widget.sh`：完整的引导式小部件流程。
* `scripts/termux-sync-widget.sh`：同步 Claude Code 凭据 → OpenClaw。

如果你不需要手机自动化或 systemd 定时器，请跳过这些脚本。