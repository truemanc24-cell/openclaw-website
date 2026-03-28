---
title: OpenClaw 技能开发教程 - 从零创建你的第一个技能 | 完整指南
description: 学完这个教程，你将能够独立开发 OpenClaw 技能。包含技能结构、API 调用、测试部署全流程。复制代码模板，2 小时完成第一个技能，附审核标准。
keywords:
  - OpenClaw 技能开发
  - 技能创建
  - Agent 技能
  - 教程
  - API 开发
  - 技能审核
lastUpdated: 2026-03-24
contributors:
  - Trueman
---

# 技能开发教程：打造你的第一个 OpenClaw 技能

> 📅 更新时间：2026-03-22  
> ⏰ 阅读时长：20 分钟  
> 💡 难度：进阶

---

## 写在前面

你是否曾经想过：能不能给 AI 助手增加一个「特异功能」，让它能做特定的事情？

在 OpenClaw 中，这个需求可以通过**技能（Skills）**来实现。技能是一种扩展 AI 能力的模块化方式，让 Agent 可以调用外部工具、完成特定任务。

本文将手把手教你如何开发一个完整的技能，从概念理解到实际发布，让你的 AI 助手真正变得「多功能」！

---

## 一、技能系统概述

### 1.1 什么是技能？

技能（Skill）是 OpenClaw 的一种扩展机制，它告诉 Agent：

- 📦 **有哪些工具可用**
- 🔧 **如何使用这些工具**
- ⚙️ **什么条件下可以使用**

一个技能就是一个文件夹，里面包含一个 `SKILL.md` 文件，定义了技能的名称、描述、用法等信息。

### 1.2 技能的结构

```
my-skill/
├── SKILL.md          # 技能定义文件（必需）
├── scripts/          # 脚本文件夹（可选）
├── config/           # 配置文件（可选）
└── README.md         # 说明文档（可选）
```

**SKILL.md 示例：**
```markdown
---
name: my-skill
description: 这是一个示例技能
---

# 我的技能

这个技能可以做某某事情。

## 使用方法

调用方式：`/my-skill [参数]`

## 参数说明

| 参数 | 说明 | 必填 |
|------|------|------|
| param1 | 参数1 | 是 |
| param2 | 参数2 | 否 |
```

### 1.3 技能的位置和优先级

OpenClaw 从三个地方加载技能：

| 位置 | 说明 | 优先级 |
|------|------|--------|
| `~/.openclaw/skills/` | 共享技能目录 | 中 |
| `<workspace>/skills/` | 工作空间技能 | 高 |
| `~/.nvm/.../openclaw/skills/` | 内置技能 | 低 |

**优先级规则**：工作空间技能 > 共享技能 > 内置技能

这意味着你可以**覆盖**内置技能的行为！

### 1.4 技能的类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **工具型** | 提供 API 调用能力 | 天气查询、搜索 |
| **工作流型** | 定义操作流程 | 自动化任务 |
| **集成型** | 连接第三方服务 | 飞书、Slack |

---

## 二、开发环境搭建

### 2.1 前置要求

在开发技能之前，确保你具备：

- ✅ Node.js 22+ 或 24+
- ✅ OpenClaw 已安装
- ✅ 代码编辑器（VS Code 推荐）
- ✅ 基础的命令行操作能力

**检查环境：**
```bash
# 检查 OpenClaw 版本
openclaw --version

# 检查 Node 版本
node --version

# 查看技能目录
ls ~/.openclaw/skills/
```

### 2.2 创建技能目录

```bash
# 进入技能目录
cd ~/.openclaw/skills

# 创建新技能文件夹
mkdir my-first-skill
cd my-first-skill
```

### 2.3 技能文件夹结构

建议按以下结构组织：

```
my-first-skill/
├── SKILL.md              # 技能定义（必需）
├── scripts/
│   └── run.js            # 执行脚本
├── config/
│   └── default.json      # 默认配置
└── README.md             # 说明文档
```

---

## 三、编写第一个技能

### 3.1 技能基础：SKILL.md

每个技能必须有一个 `SKILL.md` 文件，包含 YAML frontmatter 和技能说明。

**最小示例：**
```markdown
---
name: hello-world
description: 一个简单的 Hello World 技能
---

# Hello World 技能

这是一个演示技能。当你对它说话时，它会回应 "Hello, World!"。

## 使用方法

直接说「你好」或者调用 `/hello-world` 命令。
```

**完整示例：**
```markdown
---
name: weather
description: 查询指定城市的天气情况
metadata:
  {
    "openclaw": {
      "requires": { "env": ["OPENWEATHER_API_KEY"] },
      "primaryEnv": "OPENWEATHER_API_KEY",
      "emoji": "🌤️"
    }
  }
---

# 天气查询技能

查询任意城市的当前天气和天气预报。

## 功能特性

- ✅ 查询当前天气
- ✅ 3 天天气预报
- ✅ 支持中文城市名

## 使用方法

```
/weather 北京
/天气 上海
```

## 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| city | 城市名称 | 北京、上海 |

## 环境变量

需要设置以下环境变量：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| OPENWEATHER_API_KEY | OpenWeather API 密钥 | [官网注册](https://openweathermap.org/api) |

## 代码示例

```javascript
// 天气查询 API 调用示例
const API_KEY = process.env.OPENWEATHER_API_KEY;
const city = 'Beijing';

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_cn`
);

const data = await response.json();
console.log(`当前天气：${data.weather[0].description}`);
console.log(`温度：${data.main.temp}°C`);
```
```

### 3.2 YAML Frontmatter 详解

frontmatter 是技能的关键配置，使用 YAML 格式：

```yaml
---
name: 技能名称          # 必需：技能唯一标识
description: 说明文字   # 必需：技能描述
metadata:              # 可选：高级配置
  openclaw:
    requires:          # 加载条件
      bins: []          # 需要的可执行文件
      env: []          # 需要的环境变量
      config: []       # 需要的配置项
    primaryEnv: ""     # 主要环境变量名
    emoji: "🔧"        # 技能图标
    os: ["darwin", "linux"]  # 支持的操作系统
---
```

### 3.3 技能的能力定义

在 `SKILL.md` 的正文中，你需要详细描述：

**1. 技能的功能**
```markdown
## 功能特性

- 查询当前天气
- 3 天天气预报
- 支持中英文城市名
```

**2. 使用方式**
```markdown
## 使用方法

### 命令方式
/weather 北京
/天气 上海

### 对话方式
问：北京今天天气怎么样？
```

**3. 参数说明**
```markdown
## 参数说明

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| city | string | 城市名称 | 当前 IP 所在城市 |
| days | number | 预报天数 | 1 |
```

**4. 示例**
```markdown
## 使用示例

**示例 1：查询北京天气**
用户输入：/weather 北京

**示例 2：查询 3 天预报**
用户输入：/weather 上海 3
```

---

## 四、技能进阶开发

### 4.1 条件加载：控制技能何时可用

使用 `metadata.openclaw.requires` 控制技能的加载条件：

**场景 1：需要特定环境变量**
```yaml
---
name: weather
metadata:
  {
    "openclaw": {
      "requires": { "env": ["OPENWEATHER_API_KEY"] }
    }
  }
---
```
只有当 `OPENWEATHER_API_KEY` 环境变量存在时，这个技能才会被加载。

**场景 2：需要特定命令行工具**
```yaml
---
name: video-downloader
metadata:
  {
    "openclaw": {
      "requires": { "bins": ["yt-dlp", "ffmpeg"] }
    }
  }
---
```
只有当 `yt-dlp` 和 `ffmpeg` 都在 PATH 中时，技能才会加载。

**场景 3：需要特定配置**
```yaml
---
name: browser-automation
metadata:
  {
    "openclaw": {
      "requires": { "config": ["browser.enabled"] }
    }
  }
---
```
只有当配置文件中 `browser.enabled` 为 true 时，技能才会加载。

**场景 4：组合条件**
```yaml
---
name: advanced-search
metadata:
  {
    "openclaw": {
      "requires": {
        "bins": ["python"],
        "env": ["API_KEY"],
        "config": ["features.advancedSearch"]
      }
    }
  }
---
```
以上三个条件必须同时满足！

### 4.2 技能调用方式

OpenClaw 支持多种技能调用方式：

**1. 斜杠命令**
```markdown
---
user-invocable: true
---
```
用户可以直接输入 `/skill-name` 来调用。

**2. 工具直接调用**
```markdown
---
command-dispatch: tool
command-tool: my_tool_name
command-arg-mode: raw
---
```
绕过 AI 模型，直接将参数传递给指定工具。

**3. AI 自动触发**
```markdown
---
disable-model-invocation: false
---
```
AI 会根据对话内容自动判断是否使用这个技能。

### 4.3 技能开发示例：天气预报

让我们完整开发一个天气预报技能：

**目录结构：**
```
weather/
├── SKILL.md
└── scripts/
    └── weather.js
```

**SKILL.md：**
```markdown
---
name: weather
description: 查询任意城市的天气情况
metadata:
  {
    "openclaw": {
      "requires": { "env": ["OPENWEATHER_API_KEY"] },
      "primaryEnv": "OPENWEATHER_API_KEY",
      "emoji": "🌤️"
    }
  }
---

# 天气查询技能

查询任意城市的当前天气和天气预报。

## 功能特性

- ✅ 查询当前天气
- ✅ 3 天天气预报
- ✅ 支持中文城市名
- ✅ 支持华氏/摄氏度切换

## 使用方法

```
/weather <城市> [天数]
```

## 参数说明

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| city | 城市名称 | 是 | - |
| days | 预报天数 | 否 | 1 |

## 环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| OPENWEATHER_API_KEY | OpenWeather API 密钥 | [官网注册](https://openweathermap.org/api) |

## 配置项（可选）

在 `openclaw.json` 中可以配置：

```json5
{
  skills: {
    entries: {
      weather: {
        unit: "celsius",  // celsius 或 fahrenheit
        lang: "zh_cn"    // 返回中文结果
      }
    }
  }
}
```

## 示例对话

**用户**：北京今天天气怎么样？  
**AI**：🌤️ 北京当前天气：
- 温度：15°C
- 湿度：45%
- 天气：晴

**用户**：/weather 上海 3  
**AI**：🌤️ 上海 3 天预报：
- 明天：小雨，12-18°C
- 后天：阴，14-20°C
- 大后天：晴，16-22°C
```

**scripts/weather.js：**
```javascript
const API_KEY = process.env.OPENWEATHER_API_KEY;

async function getWeather(city, days = 1) {
  // 获取当前天气
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=zh_cn`;
  
  const response = await fetch(currentUrl);
  const data = await response.json();
  
  if (data.cod !== 200) {
    throw new Error(`无法查询天气：${data.message}`);
  }
  
  let result = `🌤️ ${city} 当前天气：\n`;
  result += `- 温度：${data.main.temp}°C\n`;
  result += `- 湿度：${data.main.humidity}%\n`;
  result += `- 天气：${data.weather[0].description}`;
  
  return result;
}

// 解析命令参数
function parseCommandArgs(argsString) {
  const parts = argsString.trim().split(/\s+/);
  return {
    city: parts[0] || '',
    days: parseInt(parts[1]) || 1
  };
}

// 主函数
async function main() {
  const args = parseCommandArgs(process.argv[2] || '');
  
  if (!args.city) {
    console.log('请提供城市名称');
    console.log('用法：/weather <城市> [天数]');
    process.exit(1);
  }
  
  try {
    const result = await getWeather(args.city, args.days);
    console.log(result);
  } catch (error) {
    console.error('错误：', error.message);
    process.exit(1);
  }
}

main();
```

---

## 五、测试和调试

### 5.1 本地测试

```bash
# 进入技能目录
cd ~/.openclaw/skills/weather

# 手动运行脚本测试
OPENWEATHER_API_KEY=your_key node scripts/weather.js "北京"

# 查看 OpenClaw 加载了哪些技能
openclaw skills list
```

### 5.2 调试模式

```bash
# 启动 Gateway 并查看技能加载日志
openclaw gateway start
openclaw logs --follow | grep -i skill
```

### 5.3 常见问题排查

**问题 1：技能没有被加载**

检查清单：
- [ ] SKILL.md 文件存在？
- [ ] frontmatter 格式正确？
- [ ] 满足加载条件（env/bin/config）？
- [ ] Gateway 重启过？

**问题 2：技能可用但无法调用**

检查清单：
- [ ] `/skill-name` 命令输入正确？
- [ ] AI 是否理解你的意图？
- [ ] 查看日志确认调用情况

**问题 3：脚本执行失败**

检查清单：
- [ ] 脚本有执行权限？
- [ ] 环境变量已设置？
- [ ] Node 版本兼容？

---

## 六、发布到 ClawHub

### 6.1 什么是 ClawHub？

ClawHub 是 OpenClaw 的官方技能市场，你可以在这里：
- 🔍 发现新技能
- 📦 安装他人分享的技能
- 📤 发布自己开发的技能

访问地址：https://clawhub.com

### 6.2 发布流程

**步骤 1：准备技能**

确保技能目录包含：
- `SKILL.md`：必需
- 必要的脚本和配置

**步骤 2：初始化技能包**
```bash
# 进入技能目录
cd ~/.openclaw/skills/your-skill

# 初始化（如果需要）
npm init -y
```

**步骤 3：发布技能**

使用 clawhub CLI 发布：

```bash
# 登录 ClawHub（如果需要）
clawhub login

# 发布技能
clawhub publish

# 或者指定路径
clawhub publish ./my-skill
```

**步骤 4：填写信息**

发布时需要提供：
- 技能名称
- 描述
- 标签
- 示例用法

### 6.3 安装他人技能

```bash
# 搜索技能
clawhub search weather

# 安装技能到当前目录
clawhub install weather

# 安装到特定工作空间
clawhub install weather --workspace ~/.openclaw/workspace-coder
```

### 6.4 技能更新

```bash
# 更新所有已安装技能
clawhub update --all

# 更新特定技能
clawhub update weather

# 查看可用的更新
clawhub outdated
```

---

## 七、最佳实践

### 7.1 技能设计原则

1. **单一职责**：一个技能只做一件事
2. **清晰接口**：参数定义清晰，减少歧义
3. **优雅降级**：依赖不可用时给出友好提示
4. **详细文档**：让 AI 和用户都能理解用法

### 7.2 命名规范

```markdown
---
name: 技能名称
description: 一句话描述
---
```

- 使用小写字母和连字符
- 名称要有意义
- 描述要简洁明了

### 7.3 安全注意事项

⚠️ **重要提醒**：

1. **第三方技能要谨慎**
   - 不要盲目信任第三方技能
   - 使用前先阅读代码

2. **敏感信息处理**
   - 不要在 SKILL.md 中硬编码密钥
   - 使用环境变量或配置加密

3. **沙盒运行**
   - 对不信任的技能使用沙盒模式
   - 限制文件系统和网络访问

---

## 八、实战案例：开发一个翻译技能

让我们完整开发一个实用的翻译技能：

**目录结构：**
```
translate/
├── SKILL.md
└── scripts/
    └── translate.js
```

**SKILL.md：**
```markdown
---
name: translate
description: 多语言翻译工具
metadata:
  {
    "openclaw": {
      "emoji": "🌐",
      "requires": { "env": ["DEEPL_API_KEY"] },
      "primaryEnv": "DEEPL_API_KEY"
    }
  }
---

# 翻译技能

使用 DeepL API 进行高质量翻译。

## 支持语言

- 中文 (ZH)
- 英文 (EN)
- 日文 (JA)
- 韩文 (KO)
- 法文 (FR)
- 德文 (DE)
- 西班牙文 (ES)

## 使用方法

```
/translate [源语言->目标语言] 文本
```

## 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| source | 源语言（留空自动检测） | EN |
| target | 目标语言 | ZH |
| text | 要翻译的文本 | Hello world |

## 示例

**英译中**
用户：`/translate EN->ZH Hello world`  
AI：你好，世界

**中译日**
用户：`/translate ZH->JA 你好`  
AI：こんにちは

## 环境变量

| 变量名 | 说明 |
|--------|------|
| DEEPL_API_KEY | DeepL API 密钥 |
```

**scripts/translate.js：**
```javascript
const API_KEY = process.env.DEEPL_API_KEY;

const LANGUAGE_MAP = {
  'zh': 'ZH',
  'en': 'EN',
  'ja': 'JA',
  'ko': 'KO',
  'fr': 'FR',
  'de': 'DE',
  'es': 'ES'
};

async function translate(text, sourceLang, targetLang) {
  const sourceCode = LANGUAGE_MAP[sourceLang.toLowerCase()] || sourceLang.toUpperCase();
  const targetCode = LANGUAGE_MAP[targetLang.toLowerCase()] || targetLang.toUpperCase();
  
  const url = 'https://api-free.deepl.com/v2/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: [text],
      source_lang: sourceCode,
      target_lang: targetCode
    })
  });
  
  const data = await response.json();
  
  if (data.translations && data.translations[0]) {
    return data.translations[0].text;
  }
  
  throw new Error('翻译失败');
}

function parseArgs(argsString) {
  // 格式: EN->ZH text 或者 ZH text (自动检测源语言)
  const match = argsString.match(/^(\w+)?->(\w+)\s+(.+)$/);
  
  if (match) {
    return {
      source: match[1] || '',
      target: match[2],
      text: match[3]
    };
  }
  
  // 没有指定源语言
  return {
    source: '',
    target: 'ZH', // 默认目标中文
    text: argsString
  };
}

async function main() {
  const args = parseArgs(process.argv[2] || '');
  
  if (!args.text) {
    console.log('用法：/translate [源语言->]目标语言 文本');
    console.log('示例：/translate EN->ZH Hello');
    console.log('      /translate ZH Hello');
    process.exit(1);
  }
  
  try {
    const result = await translate(args.text, args.source || 'auto', args.target);
    console.log(result);
  } catch (error) {
    console.error('错误：', error.message);
    process.exit(1);
  }
}

main();
```

---

## 总结

开发 OpenClaw 技能是一项非常有趣且强大的能力：

1. ✅ **模块化设计**：技能即插即用
2. ✅ **灵活配置**：条件加载满足各种场景
3. ✅ **生态丰富**：ClawHub 分享和发现技能
4. ✅ **安全可控**：沙盒机制保护系统安全

**下一步**：
- 尝试开发你的第一个技能
- 在 ClawHub 发现有趣技能
- 将技能分享给社区

---

> 📍 **相关文档**
> - [技能系统详解](/docs/tools/skills.md)
> - [ClawHub 使用指南](/docs/tools/clawhub.md)
> - [技能配置参考](/docs/gateway/configuration-reference.md)

---

*[配图：技能开发流程图 - 展示从创建到发布的完整流程]*
*[配图：ClawHub 界面截图 - 展示技能市场]*

---

## 结构化数据（SEO）

<!--
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "OpenClaw 技能开发教程 - 从零创建你的第一个技能",
  "description": "学完这个教程，你将能够独立开发 OpenClaw 技能。包含技能结构、API 调用、测试部署全流程。",
  "image": "https://trueworld-web.vercel.app/images/skill-development.jpg",
  "author": {
    "@type": "Person",
    "name": "Trueman",
    "url": "https://trueworld-web.vercel.app/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenClaw 中文技术网",
    "logo": {
      "@type": "ImageObject",
      "url": "https://trueworld-web.vercel.app/logo.png"
    }
  },
  "datePublished": "2026-03-22",
  "dateModified": "2026-03-24",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://trueworld-web.vercel.app/tutorials/advanced/skill-development"
  },
  "articleSection": "教程",
  "keywords": ["OpenClaw 技能开发", "技能创建", "Agent 技能", "API 开发"],
  "wordCount": "5000",
  "timeRequired": "PT2H",
  "difficulty": "Intermediate",
  "educationalLevel": "Intermediate",
  "learningResourceType": "Tutorial",
  "teaches": ["技能开发", "API 集成", "调试技巧", "代码规范"]
}
</script>
-->