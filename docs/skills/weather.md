---
name: weather
description: "通过 wttr.in 或 Open-Meteo 获取当前天气和预报。使用时机：用户询问任何地点的天气、温度或预报。不适用于：历史天气数据、恶劣天气警报或详细气象分析。无需 API 密钥。"
homepage: https://wttr.in/:help
metadata: { "openclaw": { "emoji": "☔", "requires": { "bins": ["curl"] } } }
---

# 天气技能

获取当前天气状况和预报。

## 使用时机

✅ **使用此技能的场景：**

- "天气怎么样？"
- "今天/明天会下雨吗？"
- "[城市] 的温度"
- "本周天气预报"
- 旅行规划天气查询

## 不使用时机

❌ **不要使用此技能的场景：**

- 历史天气数据 → 使用天气档案/API
- 气候分析或趋势 → 使用专业数据源
- 当地微气候数据 → 使用本地传感器
- 恶劣天气警报 → 查看官方 NWS 来源
- 航空/航海天气 → 使用专业服务（METAR 等）

## 位置

天气查询中始终包含城市、地区或机场代码。

## 命令

### 当前天气

```bash
# 单行摘要
curl "wttr.in/London?format=3"

# 详细当前状况
curl "wttr.in/London?0"

# 具体城市
curl "wttr.in/New+York?format=3"
```

### 天气预报

```bash
# 3 天预报
curl "wttr.in/London"

# 周预报
curl "wttr.in/London?format=v2"

# 具体日期（0=今天，1=明天，2=后天）
curl "wttr.in/London?1"
```

### 格式选项

```bash
# 单行格式
curl "wttr.in/London?format=%l:+%c+%t+%w"

# JSON 输出
curl "wttr.in/London?format=j1"

# PNG 图片
curl "wttr.in/London.png"
```

### 格式代码

- `%c` — 天气状况 emoji
- `%t` — 温度
- `%f` — "体感温度"
- `%w` — 风速
- `%h` — 湿度
- `%p` — 降水量
- `%l` — 位置

## 快速响应

**"天气怎么样？"**

```bash
curl -s "wttr.in/London?format=%l:+%c+%t+(feels+like+%f),+%w+wind,+%h+humidity"
```

**"会下雨吗？"**

```bash
curl -s "wttr.in/London?format=%l:+%c+%p"
```

**"周末预报"**

```bash
curl "wttr.in/London?format=v2"
```

## 备注

- 无需 API 密钥（使用 wttr.in）
- 有速率限制；不要频繁发送请求
- 适用于大多数全球城市
- 支持机场代码：`curl wttr.in/ORD`