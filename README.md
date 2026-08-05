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
- 30 条可搜索、可筛选的结构化映射
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
pnpm lint
pnpm types:check
pnpm build
```

## 内容约定

每篇知识文章在 Frontmatter 中维护：

- `type`：内容类型
- `summary`：核心结论
- `firstPrinciple`：该主题不依赖具体工具的底层问题
- `frontendAnalogy`：前端开发者已有的认知起点
- `prerequisites`：前置知识
- `related`：关联知识
- `sourceRefs`：参考来源，可附来源类型、发布方和许可证

第三方资料只作为事实来源和学习索引，正文需要独立编写，并遵守对应许可证。

贡献新内容前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
