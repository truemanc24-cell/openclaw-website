# 🚀 部署前检查清单

**目的**: 避免部署失败，节省时间成本

---

## 📋 每次部署前必须检查

### 1. 图片资源检查
```bash
# 查找所有缺失的图片引用
grep -rn "\.\./images/" docs/tutorials/ | while read line; do
  img_path=$(echo "$line" | grep -oP '\(\K.*(?=\))')
  if [ ! -f "docs/$img_path" ]; then
    echo "❌ 缺失图片：$line"
  fi
done
```

### 2. 链接检查
```bash
# 查找死链接
grep -rn "\](http" docs/ | grep -v "vercel.app" | grep -v "github.com"
```

### 3. 构建测试
```bash
# 本地构建测试
npm run docs:build
```

### 4. Git 状态检查
```bash
# 确认没有未提交的更改
git status
```

---

## ✅ 检查通过后才能执行

```bash
git add -A
git commit -m "描述"
git push
```

---

## 📊 时间成本记录

| 日期 | 问题 | 预计时间 | 实际时间 | 损失 |
|------|------|---------|---------|------|
| 2026-03-29 | 图片引用缺失 | 5 分钟 | 30+ 分钟 | 6 倍 |

---

**最后更新**: 2026-03-29  
**原则**: 时间是最昂贵的成本！
