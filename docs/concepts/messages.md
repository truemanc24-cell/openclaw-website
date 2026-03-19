# 消息

# 消息

消息是 OpenClaw 与用户之间的通信单位。

## 消息类型

### 入站消息

来自渠道的用户消息：

* 文本消息
* 媒体（图像、音频、视频、文档）
* 提及（@ 提及）
* 命令（斜杠命令）

### 出站消息

代理的回复：

* 文本回复
* 流式回复（实时输出）
* 工具结果
* 错误消息

## 消息属性

* `id`：唯一消息 ID
* `channel`：来源渠道
* `sender`：发送者身份
* `content`：消息内容
* `timestamp`：发送时间
* `attachments`：附加媒体

## 消息队列

入站消息通过命令队列处理以防止冲突。参见[队列](/concepts/queue)。

## 消息钩子

消息生命周期钩子：

* `message_received`：入站消息时调用
* `message_sending`：出站消息前调用
* `message_sent`：消息发送后调用

参见[插件钩子](/tools/plugin#plugin-hooks)。