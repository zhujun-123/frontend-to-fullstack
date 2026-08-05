# 贡献指南

这个项目希望帮助前端开发者把已有经验迁移到服务端和 Go，而不是重复制造一份通用 Go 语法手册。

## 内容标准

每个映射或全链路专题应当回答：

1. 前端开发者已经熟悉什么？
2. 两边解决的共同问题是什么？
3. 类比在哪些范围成立？
4. 哪些地方不能照搬？
5. 在真实项目中最容易出现什么问题？
6. 读者可以完成什么练习来验证理解？
7. 不依赖当前工具品牌的第一性原理是什么？
8. 什么证据能够证明读者已经完成这一阶段？

## Frontmatter

```yaml
---
title: Promise 与 Goroutine
description: 区分异步任务、未来结果、并发通信和取消机制。
type: mapping
summary: 一句话核心结论。
firstPrinciple: 不依赖具体框架和工具的底层问题。
frontendAnalogy: 前端开发者已经掌握的认知起点。
prerequisites:
  - Promise 与 async/await
related:
  - Context
sourceRefs:
  - title: Go 官方文档
    url: https://go.dev/
    kind: official
    publisher: Go Team
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
pnpm lint
pnpm types:check
pnpm build
```

提交 Pull Request 前，请确认没有引入未注明来源的大段第三方内容。
