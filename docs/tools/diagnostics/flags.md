# 诊断标志

诊断标志让你能够有针对性地启用调试日志，而无需在任何地方打开详细日志记录。标志是选择加入的，除非子系统检查它们，否则没有效果。

## 工作原理

* 标志是字符串（不区分大小写）。
* 你可以在配置中启用标志或通过环境变量覆盖。
* 支持通配符：
  * `telegram.*` 匹配 `telegram.http`
  * `*` 启用所有标志

## 通过配置启用

```json
{
  "diagnostics": {
    "flags": ["telegram.http"]
  }
}
```

多个标志：

```json
{
  "diagnostics": {
    "flags": ["telegram.http", "gateway.*"]
  }
}
```

更改标志后重启网关。

## 环境变量覆盖（一次性）

```bash
OPENCLAW_DIAGNOSTICS=telegram.http,telegram.payload
```

禁用所有标志：

```bash
OPENCLAW_DIAGNOSTICS=0
```

## 日志去向

标志将日志发送到标准诊断日志文件。默认：

```
/tmp/openclaw/openclaw-YYYY-MM-DD.log
```

如果你设置了 `logging.file`，请改用该路径。日志是 JSONL（每行一个 JSON 对象）。基于 `logging.redactSensitive` 仍然应用编辑。

## 提取日志

选择最新的日志文件：

```bash
ls -t /tmp/openclaw/openclaw-*.log | head -n 1
```

过滤 Telegram HTTP 诊断：

```bash
rg "telegram http error" /tmp/openclaw/openclaw-*.log
```

或在复现时跟踪：

```bash
tail -f /tmp/openclaw/openclaw-$(date +%F).log | rg "telegram http error"
```

对于远程网关，你也可以使用 `openclaw logs --follow`（请参阅 [/cli/logs](/cli/logs)）。

## 说明

* 如果 `logging.level` 设置高于 `warn`，这些日志可能会被抑制。默认的 `info` 没问题。
* 留下启用标志是安全的；它们只会影响特定子系统的日志量。
* 使用 [/logging](/logging) 更改日志目标、级别和编辑。