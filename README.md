# 前端走向全栈

面向前端开发者的开放知识库，通过“前端原理 → Go 原理”的映射，逐步补齐服务端、数据库、部署和生产排查能力。

## 当前内容

- 从真实接口修改开始的全栈学习路线
- 从用户请求到生产排障的 7 阶段全链路
- 请求契约、服务边界、数据库、缓存与异步基础
- Jenkins、Docker、Kubernetes 与 Helm 的职责拆分
- Loki、Prometheus、OpenTelemetry 与生产排障方法
- Event Loop → Go Scheduler
- Promise → Goroutine / Channel / Context
- JavaScript Array → Go Array / Slice
- AbortController → Context
- Fetch → `net/http.Client`
- TypeScript Interface → Go Interface
- try/catch → Go error
- 10 篇带官方来源、版本边界、可运行 Lab 与生产证据的已验证专题
- 统一使用餐厅故事增加大白话解释，并在每个比喻后标明失效边界
- 6 篇经过官方资料校对、等待补齐独立实验的专题
- 43 条带明确成熟度、可搜索可筛选的结构化映射
- Go 1.26.5 Runtime Labs 与本地 pprof / expvar 实验服务
- 12 条覆盖接手、开发、数据、发布和生产排障的任务配方
- 任务配方支持按阶段、输入材料筛选和一键复制
- 基于 localStorage 的学习进度
- 分类整理的官方文档和经过许可证筛选的 GitHub 学习资源

## 技术栈

- Next.js 16
- Fumadocs
- MDX
- Orama 本地搜索
- Mermaid 原理图
- Vercel 部署

由于 Next.js 16 的 Turbopack 在部分中文本地路径下存在字符边界问题，开发与构建脚本暂时固定使用官方 Webpack 模式。

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000>。

## 校验

```bash
pnpm content:check
pnpm lint
pnpm types:check
pnpm build
pnpm labs:vet
pnpm labs:test
pnpm labs:race
```

## 内容约定

每篇知识文章在 Frontmatter 中维护：

- `type`：内容类型
- `maturity`：`outline | reviewed | verified`
- `summary`：核心结论
- `firstPrinciple`：该主题不依赖具体工具的底层问题
- `frontendAnalogy`：前端开发者已有的认知起点
- `lastVerified`、`testedWith`：最后核验日期与真实验证环境
- `lab`：实验目录和可运行命令
- `prerequisites`：前置知识
- `related`：关联知识
- `sourceRefs`：参考来源，可附来源类型、发布方、版本、核验日期和适用说明

`verified` 专题还必须包含系统不变量、当前实现、类比范围与失效边界、正常实验、错误边界、生产故障和证据化排查。第三方资料只作为问题发现和学习索引，机制结论优先回到规范、官方文档和固定版本源码。

Go 实验说明见 [`examples/go-runtime/README.md`](./examples/go-runtime/README.md)。

贡献新内容前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
