# Skill Vetter

**技能名**: `skill-vetter`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Skill Vetter 技能帮助推荐和评估 OpenClaw 技能，根据需求推荐最合适的技能。

### 核心功能

- 🎯 **技能推荐** - 根据需求推荐技能
- 📊 **技能评估** - 评估技能质量和适用性
- 🔍 **技能搜索** - 搜索相关技能
- 📈 **趋势分析** - 分析技能使用趋势

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install skill-vetter
```

### 2. 无需配置

本技能无需额外配置，直接使用。

---

## 💡 使用示例

### 技能推荐

```bash
# 根据需求推荐
skill-vetter recommend --need "天气查询"

# 根据场景推荐
skill-vetter recommend --scenario "项目管理"

# 批量推荐
skill-vetter recommend --needs "天气，搜索，文档"
```

### 技能评估

```bash
# 评估技能
skill-vetter evaluate --skill weather

# 对比技能
skill-vetter compare --skills "weather,open-meteo"

# 技能报告
skill-vetter report --skill github
```

### 技能搜索

```bash
# 搜索技能
skill-vetter search --query "文件处理"

# 按类别搜索
skill-vetter search --category "productivity"

# 热门技能
skill-vetter trending --limit 10
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| recommend | 推荐 | `skill-vetter recommend --need x` |
| evaluate | 评估 | `skill-vetter evaluate --skill x` |
| compare | 对比 | `skill-vetter compare --skills x,y` |
| search | 搜索 | `skill-vetter search --query x` |
| trending | 趋势 | `skill-vetter trending --limit 10` |

### 智能推荐

```javascript
// 基于上下文的推荐
const recommendation = await skillVetter.recommend({
  userContext: 'developer',
  needs: ['github', 'code-review'],
  exclude: ['paid']
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **描述清晰** - 清楚描述需求
2. **查看评价** - 参考其他用户评价
3. **测试验证** - 安装前测试
4. **定期更新** - 保持技能最新

### 避免踩坑

1. **不要盲目安装** - 评估后再安装
2. **注意兼容性** - 检查版本要求
3. **权限审查** - 检查所需权限

---

## 📊 效果评估

### 推荐准确率

| 场景 | 准确率 |
|------|--------|
| 通用需求 | 90%+ |
| 专业需求 | 85%+ |
| 复杂场景 | 80%+ |

---

## 🔗 相关资源

- [ClawHub 技能市场](https://clawhub.ai/skills)
- [技能开发指南](https://clawhub.ai/docs/skill-development)
- [技能评估标准](https://clawhub.ai/docs/evaluation)

---

## 💬 用户评价

> "技能推荐很准确"  
> —— 新用户

> "帮我找到了需要的技能"  
> —— 开发者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
