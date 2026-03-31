---
title: node issue
description: node issue 页面
---

# Node + tsx "\_\_name is not a function" 崩溃

## 摘要

通过 Node 使用 `tsx` 运行时，OpenClaw 启动失败并显示：

```
[openclaw] Failed to start CLI: TypeError: __name is not a function
    at createSubsystemLogger (.../src/logging/subsystem.ts:203:25)
    at .../src/agents/auth-profiles/constants.ts:25:20
```

这始于将开发脚本从 Bun 切换到 `tsx` 后（commit `2871657e`，2026-01-06）。同一运行时路径在 Bun 下可以工作。

## 环境

* Node: v25.x（在 v25.3.0 上观察到）
* tsx: 4.21.0
* OS: macOS（可能在运行 Node 25 的其他平台上也能复现）

## 复现（仅 Node）

```bash
# in repo root
node --version
pnpm install
node --import tsx src/entry.ts status
```

## 仓库中的最小复现

```bash
node --import tsx scripts/repro/tsx-name-repro.ts
```

## Node 版本检查

* Node 25.3.0：失败
* Node 22.22.0（Homebrew `node@22`）：失败
* Node 24：此处尚未安装；需要验证

## 说明/假设

* `tsx` 使用 esbuild 转换 TS/ESM。esbuild 的 `keepNames` 发出 `__name` 助手并用 `__name(...)` 包装函数定义。
* 崩溃表明 `__name` 存在但在运行时不是函数，这意味着助手在此模块的 Node 25 加载器路径中缺失或被覆盖。
* 类似的 `__name` 助手问题在其他 esbuild 使用者中也有报道，当助手缺失或被重写时。

## 回归历史

* `2871657e`（2026-01-06）：脚本从 Bun 改为 tsx 以使 Bun 成为可选的。
* 之前（Bun 路径），`openclaw status` 和 `gateway:watch` 可以工作。

## 变通方案

* 使用 Bun 进行开发脚本（当前临时回退）。

* 使用 Node + tsc 监视，然后运行编译输出：

  ```bash
  pnpm exec tsc --watch --preserveWatchOutput
  node --watch openclaw.mjs status
  ```

* 本地确认：`pnpm exec tsc -p tsconfig.json` + `node openclaw.mjs status` 在 Node 25 上可以工作。

* 如果可能，在 TS 加载器中禁用 esbuild keepNames（防止 `__name` 助手插入）；tsx 目前不公开此功能。

* 使用 `tsx` 测试 Node LTS（22/24）以查看问题是否特定于 Node 25。

## 引用

* [https://opennext.js.org/cloudflare/howtos/keep_names](https://opennext.js.org/cloudflare/howtos/keep_names)
* [https://esbuild.github.io/api/#keep-names](https://esbuild.github.io/api/#keep-names)
* [https://github.com/evanw/esbuild/issues/1031](https://github.com/evanw/esbuild/issues/1031)

## 下一步

* 在 Node 22/24 上复现以确认 Node 25 回归。
* 测试 `tsx` nightly 或固定到更早版本，如果存在已知回归。
* 如果在 Node LTS 上复现，使用 `__name` 堆栈跟踪向上游提交最小复现。