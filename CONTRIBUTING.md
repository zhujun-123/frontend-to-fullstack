# 贡献指南

这个项目希望帮助前端开发者把已有经验迁移到服务端和 Go，而不是重复制造一份通用 Go 语法手册。

## 内容标准

每个 `verified` 映射专题必须回答：

1. 用统一生活场景“先说人话”，并明确角色映射与类比边界。
2. 问题与系统不变量。
3. 前端认知起点。
4. 最小心智模型。
5. 当前 Go 版本如何实现。
6. 类比成立范围。
7. 类比失效边界。
8. 可运行实验、命令和预期现象。
9. 真实生产故障场景。
10. pprof、trace、日志或指标证据。
11. 常见错误与版本变化。
12. 完成检查表。
13. 稳定的官方来源。

`reviewed` 表示解释已经过官方来源校对但没有独立 Lab；`outline` 只作为概念索引，不作为完成专题。

## Frontmatter

```yaml
---
title: Promise 与 Goroutine
description: 区分异步任务、未来结果、并发通信和取消机制。
type: mapping
maturity: verified
summary: 一句话核心结论。
firstPrinciple: 不依赖具体框架和工具的底层问题。
frontendAnalogy: 前端开发者已经掌握的认知起点。
lastVerified: '2026-08-10'
testedWith:
  - Go 1.26.5 darwin/arm64
lab:
  path: examples/go-runtime/labs/topic
  commands:
    - 'cd examples/go-runtime && go test ./labs/topic'
prerequisites:
  - Promise 与 async/await
related:
  - Context
sourceRefs:
  - title: Go 官方文档
    url: https://go.dev/
    kind: official
    publisher: Go Team
    version: Go 1.26.5
    note: 该来源用于核验什么结论。
    verifiedAt: '2026-08-10'
---
```

## 来源与许可证

- 优先使用官方文档、一手设计资料和开放许可证仓库核对事实。
- 不直接复制第三方文章或者书籍正文。
- 使用 CC BY、CC BY-SA 等内容时，需要保留作者、来源和许可证信息。
- 标注为 NC 或 ND 的内容只作为阅读和事实查证来源，不进行商业转载或改编。
- AI 生成内容必须由贡献者核验代码、技术边界和引用来源。

## 本地检查

```bash
pnpm install
pnpm content:check
pnpm lint
pnpm types:check
pnpm build
pnpm labs:vet
pnpm labs:test
pnpm labs:race
```

提交 Pull Request 前，请确认没有引入未注明来源的大段第三方内容。
