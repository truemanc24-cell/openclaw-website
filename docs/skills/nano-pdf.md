---
名称: nano-pdf
描述: 使用 nano-pdf CLI 通过自然语言指令编辑 PDF。
首页: https://pypi.org/project/nano-pdf/
元数据:
  {
    "openclaw":
      {
        "表情": "📄",
        "需要": { "可执行文件": ["nano-pdf"] },
        "安装":
          [
            {
              "id": "uv",
              "kind": "uv",
              "package": "nano-pdf",
              "可执行文件": ["nano-pdf"],
              "标签": "安装 nano-pdf (uv)",
            },
          ],
      },
  }
---

# nano-pdf

使用 `nano-pdf` 通过自然语言指令对 PDF 的特定页面进行编辑。

## 快速开始

```bash
nano-pdf edit deck.pdf 1 "将标题改为'Q3 Results'并修复副标题中的拼写错误"
```

注意：

- 页码取决于工具的版本/配置，可能是从 0 开始或从 1 开始；如果结果看起来差了一页，请尝试使用另一种方式。
- 在发送输出 PDF 之前一定要仔细检查。