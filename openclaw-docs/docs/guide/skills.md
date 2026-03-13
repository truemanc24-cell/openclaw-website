# 技能开发指南

## 什么是技能？

技能是 OpenClaw Agent 的能力扩展，让 Agent 能够：
- 搜索互联网 (tavily-search)
- 管理代码 (github)
- 自我改进 (self-improving)
- 等等...

## 安装技能

### 使用 ClawHub

```bash
cd ~/.openclaw/skills
clawhub install skill-name
```

### 手动安装

```bash
git clone https://github.com/xxx/skill-name.git ~/.openclaw/skills/skill-name
```

## 开发自定义技能

### 技能结构

```
skill-name/
├── SKILL.md          # 技能说明（必需）
├── scripts/          # 脚本文件
├── assets/           # 资源文件
└── references/       # 参考资料
```

### SKILL.md 模板

```markdown
# Skill Name

Description of what this skill does.

## Usage

How to use this skill.

## Examples

Example usage.
```

## 已安装技能列表

| 技能 | 用途 |
|------|------|
| tavily-search | 互联网搜索 |
| skill-vetter | 技能质量检查 |
| self-improving | 自我改进 |
| github | GitHub 操作 |
| clawhub | 技能管理 |
