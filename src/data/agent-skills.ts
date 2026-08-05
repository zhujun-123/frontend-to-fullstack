export type SkillCategory = '官方产品' | '工程工作流' | 'Go 与后端' | '安全与审计';

export interface AgentSkillSource {
  id: string;
  name: string;
  repo: string;
  url: string;
  publisher: string;
  provenance: '官方' | '社区' | '安全工具';
  category: SkillCategory;
  stars: number;
  license: string;
  summary: string;
  usefulFor: string[];
  recommendedSkills: string[];
  installCommand?: string;
  caution: string;
}

export interface SkillPrompt {
  id: string;
  title: string;
  category: SkillCategory;
  summary: string;
  skills: string[];
  prompt: string;
  doneCriteria: string[];
}

export const skillSnapshotDate = '2026-08-05';

export const skillCategories: SkillCategory[] = [
  '官方产品',
  '工程工作流',
  'Go 与后端',
  '安全与审计',
];

export const agentSkillSources: AgentSkillSource[] = [
  {
    id: 'google-skills',
    name: 'Google Skills',
    repo: 'google/skills',
    url: 'https://github.com/google/skills',
    publisher: 'Google',
    provenance: '官方',
    category: '官方产品',
    stars: 15587,
    license: 'Apache-2.0',
    summary: 'Google 产品与 Google Cloud 的官方 Skills 总库，覆盖数据库、Cloud Run、日志、监控、GKE、认证和架构评审。',
    usefulFor: [
      '需要按当前 Google Cloud 产品文档实施，而不是依赖模型记忆',
      '从前端继续学习部署、数据库、日志、指标和云上权限',
      '为 Cloud Run、Cloud SQL 或 GKE 任务建立可执行步骤',
    ],
    recommendedSkills: [
      'cloud-run-basics',
      'cloud-sql-basics',
      'cloud-logging-query-generation',
      'google-cloud-recipe-auth',
      'google-cloud-waf-reliability',
    ],
    installCommand: 'npx skills add google/skills',
    caution: '仓库仍在快速更新。只安装当前任务需要的 Skill，并先核对目标项目、区域、版本和权限。',
  },
  {
    id: 'firebase-agent-skills',
    name: 'Firebase Agent Skills',
    repo: 'firebase/agent-skills',
    url: 'https://github.com/firebase/agent-skills',
    publisher: 'Firebase',
    provenance: '官方',
    category: '官方产品',
    stars: 396,
    license: 'Apache-2.0',
    summary: 'Firebase 官方 Skills。Firestore Skill 会先识别数据库版本，再进入数据模型、安全规则、索引和 SDK 集成。',
    usefulFor: [
      '审核或实现 Firestore 数据模型、查询、索引与 Security Rules',
      '排查 Firebase Auth、Hosting、App Hosting、Crashlytics',
      '把 Firebase CLI、模拟器和官方参考资料放进同一工作流',
    ],
    recommendedSkills: [
      'firebase-firestore',
      'firebase-security-rules-auditor',
      'firebase-auth-basics',
      'firebase-app-hosting-basics',
      'firebase-crashlytics',
    ],
    installCommand: 'npx skills add firebase/agent-skills --skill firebase-firestore',
    caution: 'Star 不高但来源最直接。Firestore、Auth、Hosting 是不同 Skill，不要让一个 Skill 越过自己的产品边界。',
  },
  {
    id: 'vercel-agent-skills',
    name: 'Vercel Agent Skills',
    repo: 'vercel-labs/agent-skills',
    url: 'https://github.com/vercel-labs/agent-skills',
    publisher: 'Vercel',
    provenance: '官方',
    category: '官方产品',
    stars: 29756,
    license: '按具体 Skill',
    summary: 'Vercel 官方工程 Skills，重点不是生成页面，而是审查 React/Next.js 性能、Web 设计规范和部署成本。',
    usefulFor: [
      '检查 React 与 Next.js 的数据瀑布、Bundle 和渲染开销',
      '审查可访问性、表单、交互、动画和移动端体验',
      '用真实 Vercel 指标定位慢路由、缓存和函数成本',
    ],
    recommendedSkills: [
      'react-best-practices',
      'web-design-guidelines',
      'vercel-optimize',
      'composition-patterns',
      'deploy-to-vercel',
    ],
    installCommand: 'npx skills add vercel-labs/agent-skills',
    caution: '性能建议要与当前 React、Next.js 和部署版本对应；优化结论必须由构建产物与线上指标验证。',
  },
  {
    id: 'cloudflare-skills',
    name: 'Cloudflare Skills',
    repo: 'cloudflare/skills',
    url: 'https://github.com/cloudflare/skills',
    publisher: 'Cloudflare',
    provenance: '官方',
    category: '官方产品',
    stars: 2545,
    license: 'Apache-2.0',
    summary: '覆盖 Workers、D1、KV、R2、Queues、Durable Objects、Wrangler、可观测性和边缘安全。',
    usefulFor: [
      '把前端项目扩展为运行在边缘的 API 或全栈应用',
      '理解无服务器计算、存储、队列和有状态协调的边界',
      '用 Wrangler 完成部署并沿平台日志排查问题',
    ],
    recommendedSkills: ['cloudflare', 'workers-best-practices', 'wrangler', 'durable-objects', 'web-perf'],
    installCommand: 'npx skills add https://github.com/cloudflare/skills',
    caution: 'KV、D1、R2 和 Durable Objects 的一致性与使用模型不同，不能因为都属于 Cloudflare 就互相替换。',
  },
  {
    id: 'supabase-agent-skills',
    name: 'Supabase Agent Skills',
    repo: 'supabase/agent-skills',
    url: 'https://github.com/supabase/agent-skills',
    publisher: 'Supabase',
    provenance: '官方',
    category: 'Go 与后端',
    stars: 2475,
    license: 'MIT',
    summary: '用 Postgres、RLS、Auth、Realtime 和 Edge Functions 补齐数据与权限知识，适合前端开发者进入后端。',
    usefulFor: [
      '评审表结构、索引、连接池、锁与慢查询',
      '理解 Row-Level Security 与前端登录态之间的真实安全边界',
      '在 Next.js 等前端框架中正确处理服务端会话',
    ],
    recommendedSkills: ['supabase', 'supabase-postgres-best-practices'],
    installCommand: 'npx skills add supabase/agent-skills --skill supabase-postgres-best-practices',
    caution: 'RLS 不是前端路由守卫。所有策略都应通过不同角色的真实 SQL 或集成测试验证。',
  },
  {
    id: 'openai-skills',
    name: 'OpenAI Skills Catalog',
    repo: 'openai/skills',
    url: 'https://github.com/openai/skills',
    publisher: 'OpenAI',
    provenance: '官方',
    category: '工程工作流',
    stars: 24528,
    license: '按具体 Skill',
    summary: 'Codex 的官方 Skill 目录，包含文档核验、部署、浏览器测试、安全评审、Issue/CI 处理和文档产物工作流。',
    usefulFor: [
      '让 Codex 在处理特定产物或平台前先加载完整操作规范',
      '把安全评审、浏览器验证和 CI 修复变成可重复流程',
      '参考一个成熟 Skill 应如何拆分说明、脚本与参考资料',
    ],
    recommendedSkills: ['openai-docs', 'playwright', 'security-threat-model', 'gh-fix-ci', 'vercel-deploy'],
    installCommand: 'npx skills add openai/skills',
    caution: '目录中既有系统 Skill 也有精选 Skill；安装前检查具体目录的许可、脚本和外部服务要求。',
  },
  {
    id: 'github-awesome-copilot',
    name: 'Awesome Copilot',
    repo: 'github/awesome-copilot',
    url: 'https://github.com/github/awesome-copilot',
    publisher: 'GitHub',
    provenance: '官方',
    category: '工程工作流',
    stars: 37459,
    license: 'MIT',
    summary: 'GitHub 维护的社区指令、Agent、Skill 和 Prompt 集合，适合查找真实仓库工作流的参考实现。',
    usefulFor: [
      '为代码评审、Issue、测试、文档和语言栈寻找可复用模板',
      '比较 instructions、prompt、agent 和 skill 的职责差异',
      '从成熟样例中提炼团队自己的仓库规范',
    ],
    recommendedSkills: ['instructions', 'prompts', 'agents', 'skills', 'collections'],
    installCommand: 'npx skills add github/awesome-copilot',
    caution: '内容由社区贡献，质量并不一致。优先阅读源文件、适用版本和权限范围，再决定是否安装。',
  },
  {
    id: 'gsap-skills',
    name: 'GSAP Skills',
    repo: 'greensock/gsap-skills',
    url: 'https://github.com/greensock/gsap-skills',
    publisher: 'GSAP',
    provenance: '官方',
    category: '官方产品',
    stars: 13042,
    license: 'MIT',
    summary: 'GSAP 官方动画 Skills，适合在复杂交互动效中约束时间线、插件用法、性能和清理逻辑。',
    usefulFor: [
      '实现可维护的 timeline、scroll 动画和页面过渡',
      '避免重复注册、内存泄漏和影响主线程的动画写法',
      '让 AI 使用当前 GSAP API，而不是拼接旧版代码',
    ],
    recommendedSkills: ['gsap-core', 'scrolltrigger', 'react-gsap', 'performance'],
    installCommand: 'npx skills add greensock/gsap-skills',
    caution: '动画正确不等于体验正确；还要验证 reduced motion、输入方式、帧率和页面可读性。',
  },
  {
    id: 'superpowers',
    name: 'Superpowers',
    repo: 'obra/superpowers',
    url: 'https://github.com/obra/superpowers',
    publisher: 'Jesse Vincent / 社区',
    provenance: '社区',
    category: '工程工作流',
    stars: 266768,
    license: 'MIT',
    summary: '高 Star 的软件开发方法 Skill 集，强调先澄清、再计划、分步实施、测试和验证。',
    usefulFor: [
      '把模糊需求变成可以逐项验证的实施计划',
      '避免 AI 一次性修改大量文件后再补测试',
      '形成调试、TDD、代码评审和完成检查的固定节奏',
    ],
    recommendedSkills: ['brainstorming', 'systematic-debugging', 'test-driven-development', 'verification-before-completion'],
    installCommand: 'npx skills add obra/superpowers',
    caution: '它提供的是工作方法，不了解你的业务事实。使用时仍要写清范围、风险和真实验收标准。',
  },
  {
    id: 'mattpocock-skills',
    name: 'Skills for Real Engineers',
    repo: 'mattpocock/skills',
    url: 'https://github.com/mattpocock/skills',
    publisher: 'Matt Pocock',
    provenance: '社区',
    category: '工程工作流',
    stars: 203862,
    license: 'MIT',
    summary: '从真实工程实践整理的研究、诊断、实现、TDD、代码评审、交接和知识讲解 Skills。',
    usefulFor: [
      '先定位代码路径和失败机制，再动手修 Bug',
      '将需求转为规范、Ticket、测试和实现步骤',
      '在长任务或多人协作中留下可继续执行的交接材料',
    ],
    recommendedSkills: ['diagnosing-bugs', 'wayfinder', 'to-spec', 'tdd', 'code-review', 'handoff'],
    installCommand: 'npx skills add mattpocock/skills',
    caution: '个人方法论不等于团队规范。先选择与你当前任务相符的 Skill，不要一次加载全部内容。',
  },
  {
    id: 'addyosmani-agent-skills',
    name: 'Production-grade Engineering Skills',
    repo: 'addyosmani/agent-skills',
    url: 'https://github.com/addyosmani/agent-skills',
    publisher: 'Addy Osmani',
    provenance: '社区',
    category: '工程工作流',
    stars: 81710,
    license: 'MIT',
    summary: '覆盖来源驱动开发、上下文工程、增量实施、API、性能、可观测性、安全和发布。',
    usefulFor: [
      '先识别依赖版本，再依据官方文档实现框架功能',
      '把大改动拆成可以独立测试和回滚的增量',
      '在交付前补齐性能、安全、可观测性和发布检查',
    ],
    recommendedSkills: ['source-driven-development', 'incremental-implementation', 'observability-and-instrumentation', 'shipping-and-launch'],
    installCommand: 'npx skills add addyosmani/agent-skills',
    caution: '官方来源只能证明 API 与推荐模式，不能替代本项目代码、配置、流量和业务约束。',
  },
  {
    id: 'golang-skills',
    name: 'Golang Agent Skills',
    repo: 'samber/cc-skills-golang',
    url: 'https://github.com/samber/cc-skills-golang',
    publisher: 'Samber',
    provenance: '社区',
    category: 'Go 与后端',
    stars: 2853,
    license: 'MIT',
    summary: '面向生产 Go 项目的原子化 Skills，覆盖数据库、Context、错误、安全、可观测性、测试、并发和项目结构。',
    usefulFor: [
      '前端开发者在真实 Go 服务中做知识迁移',
      '评审 Context 传递、错误处理、并发与资源释放',
      '补齐数据库、测试、日志、指标和性能工程能力',
    ],
    recommendedSkills: ['golang-database', 'golang-context', 'golang-error-handling', 'golang-observability', 'golang-testing'],
    installCommand: 'npx skills add https://github.com/samber/cc-skills-golang --all',
    caution: '仓库建议通用 Go Skills 成组安装，因为规则相互引用；框架或团队约定冲突时，以当前项目证据为准。',
  },
  {
    id: 'trailofbits-skills',
    name: 'Trail of Bits Security Skills',
    repo: 'trailofbits/skills',
    url: 'https://github.com/trailofbits/skills',
    publisher: 'Trail of Bits',
    provenance: '官方',
    category: '安全与审计',
    stars: 6437,
    license: 'CC-BY-SA-4.0',
    summary: '安全研究团队维护的审计 Skills，覆盖差异评审、入口分析、不安全默认值、供应链和静态分析。',
    usefulFor: [
      '在发布前检查危险默认值、鉴权边界和供应链风险',
      '围绕一次代码 Diff 做威胁和影响分析',
      '借助 Semgrep、CodeQL、属性测试等方法补充人工评审',
    ],
    recommendedSkills: ['differential-review', 'entry-point-analyzer', 'insecure-defaults', 'supply-chain-risk-auditor', 'semgrep'],
    installCommand: 'npx skills add trailofbits/skills',
    caution: '部分 Skill 面向专业安全研究，可能运行扫描器或读取更多代码。使用前必须审查脚本、参数和数据范围。',
  },
  {
    id: 'skillspector',
    name: 'SkillSpector',
    repo: 'NVIDIA/SkillSpector',
    url: 'https://github.com/NVIDIA/SkillSpector',
    publisher: 'NVIDIA',
    provenance: '安全工具',
    category: '安全与审计',
    stars: 14200,
    license: 'Apache-2.0',
    summary: '安装第三方 Skill 前的安全扫描工具，关注提示词注入、数据外传、恶意脚本和供应链风险。',
    usefulFor: [
      '审查来源不熟悉或会执行脚本的第三方 Skill',
      '在团队引入 Skill 前形成统一安全门槛',
      '识别隐藏网络请求、敏感目录读取和命令执行风险',
    ],
    recommendedSkills: ['静态扫描', 'Prompt injection 检测', '数据外传检测', '供应链检查'],
    caution: '它是审计工具，不是业务 Skill。自动扫描只能提供风险信号，不能替代人工阅读 SKILL.md 与脚本。',
  },
];

export const skillPrompts: SkillPrompt[] = [
  {
    id: 'firestore-design-review',
    title: '审核 Firestore 数据模型、规则与索引',
    category: '官方产品',
    summary: '直接调用 Firebase 官方 Firestore Skill，先确认实例版本，再讨论结构与代码。',
    skills: ['firebase-firestore', 'firebase-security-rules-auditor'],
    prompt: `请使用 firebase-firestore 和 firebase-security-rules-auditor Skill，对下面的 Firestore 方案做只读审核。不要直接修改项目，也不要先生成 SDK 代码。

目标：<业务目标与用户动作>
项目与数据库：<project id、database id、region；未知就明确写未知>
数据库版本：<STANDARD / ENTERPRISE；未知时先说明如何用 Firebase CLI 确认>
集合与示例文档：<脱敏后的路径、字段和 2～3 条样例>
主要读写：<谁在什么条件下读写哪些路径>
现有 Security Rules：<粘贴>
现有 indexes：<粘贴 firestore.indexes.json 或控制台信息>
规模与性能目标：<日增量、热点键、常见查询、P95 目标>

请按顺序输出：
1. 已确认事实、设计假设和缺失证据，三者分开
2. 版本选择会影响的数据模型、查询和 SDK 边界
3. 集合/文档设计：嵌套、反范式、热点与写放大风险
4. Security Rules：逐条说明允许者、资源条件和越权路径
5. 每个索引对应的真实查询，以及不需要创建的索引
6. Emulator 测试矩阵：允许、拒绝、跨租户、字段篡改和并发场景
7. 最小变更、数据迁移、灰度与回滚顺序

任何无法从材料证明的结论都标记为“待验证”。`,
    doneCriteria: ['确认数据库版本而非默认猜测', '每条规则都有允许与拒绝测试', '每个索引都对应真实查询', '迁移和回滚边界清楚'],
  },
  {
    id: 'cloud-log-incident',
    title: '从 Request ID 收敛一次线上错误',
    category: '官方产品',
    summary: '用 Google Cloud Logging Skill 生成可执行查询，并强制区分日志事实与根因假设。',
    skills: ['cloud-logging-query-generation', 'cloud-monitoring-metric-selection'],
    prompt: `请使用 cloud-logging-query-generation Skill，帮我为一次线上故障生成最小范围的 Cloud Logging 查询。先查证据，不要直接宣布根因。

项目：<project id>
时间范围：<带时区的开始与结束时间>
资源类型：<Cloud Run / GKE / 其他>
服务、版本与区域：<填写>
请求标识：<request id / trace id / user id，必须脱敏>
已知现象：<状态码、延迟、用户看到的结果>
相关发布：<版本、发布时间、变更摘要>

输出：
1. 第一条最窄查询：固定时间、服务、版本和请求标识
2. 如果没有结果，逐级放宽过滤条件的顺序
3. 沿 trace/request id 关联上下游日志的查询
4. 按错误类型、版本和实例聚合的查询
5. 每一步可能确认或否定的假设
6. 需要补充的指标，以及成功/异常信号

不要把单条 error 日志当成根因；明确区分“请求失败位置”和“导致失败的原因”。`,
    doneCriteria: ['查询带明确时间和资源范围', '每次只放宽一个条件', '事实与根因假设分开', '能关联版本、实例和上下游'],
  },
  {
    id: 'go-service-orientation',
    title: '用前端认知接手陌生 Go 服务',
    category: 'Go 与后端',
    summary: '让 Go Skills 聚焦真实请求路径，并把新概念映射到熟悉的前端机制。',
    skills: ['golang-project-layout', 'golang-context', 'golang-error-handling', 'golang-observability'],
    prompt: `请使用 golang-project-layout、golang-context、golang-error-handling 和 golang-observability Skills，帮助一名前端开发者接手下面的 Go 服务。只根据仓库证据分析，不要凭目录名补全架构。

目录树：<粘贴到 2～3 层>
go.mod：<粘贴>
启动入口与路由：<粘贴>
一个真实请求：<curl、响应和 request id>
相关 Handler / Service / Repository：<粘贴>
配置与部署方式：<脱敏后粘贴>

请输出：
1. 从进程启动到监听端口的路径
2. 从 HTTP 请求到数据库/外部服务的调用链
3. Context 的创建、传递、超时和取消点
4. 错误如何包装、记录并转换为 HTTP 响应
5. 日志、指标、Trace 在哪里产生，缺什么观测能力
6. 对应到前端概念的类比，以及类比失效的地方
7. 风险最低的第一个修改点和验证命令

把“文件证明的事实”和“仍需问维护者的问题”分开。`,
    doneCriteria: ['可以从 URL 定位到数据访问层', '理解 Context 和错误边界', '类比明确写出失效边界', '有真实启动与请求验证'],
  },
  {
    id: 'postgres-review',
    title: '评审 Postgres Schema 与慢查询',
    category: 'Go 与后端',
    summary: '使用 Supabase 的 Postgres 实践，但要求所有建议回到执行计划与业务不变量。',
    skills: ['supabase-postgres-best-practices'],
    prompt: `请使用 supabase-postgres-best-practices Skill 评审下面的 Postgres 设计。不要只给“加索引”或“使用缓存”这类通用建议。

业务不变量：<必须始终成立的规则>
Schema / Migration：<粘贴>
主要 SQL 与参数：<粘贴>
EXPLAIN (ANALYZE, BUFFERS)：<安全环境中的真实输出>
表行数、字段基数与增长：<填写>
连接池、并发和延迟目标：<填写>
RLS / 角色：<如使用则粘贴>

输出：
1. 数据库已经保证与仍靠应用代码保证的不变量
2. 执行计划中直接可见的耗时、估算偏差和扫描方式
3. 索引候选及其写放大、存储和锁风险
4. 事务隔离、并发更新和连接池风险
5. RLS 的允许/拒绝测试矩阵
6. 每次只改变一个变量的验证实验
7. Migration、灰度、监控与回滚方案

缺少数据分布或执行计划时，不要假定某个索引一定有效。`,
    doneCriteria: ['约束来自业务事实', '优化前后可重复对比', '索引代价被说明', '权限与并发都有测试'],
  },
  {
    id: 'next-performance-audit',
    title: '基于证据审查 React / Next.js 性能',
    category: '官方产品',
    summary: '组合 Vercel 官方 Skills，先读取版本与性能证据，再检查代码模式。',
    skills: ['react-best-practices', 'vercel-optimize', 'web-design-guidelines'],
    prompt: `请使用 react-best-practices、vercel-optimize 和 web-design-guidelines Skills 审查这个 React / Next.js 页面。不要为了套规则而重构。

依赖版本：<package.json>
目标页面与用户动作：<URL、操作路径>
真实数据：<Web Vitals、Profiler、Bundle、Vercel 指标或浏览器 Trace>
相关组件与数据请求：<粘贴关键代码>
设备与网络目标：<填写>

请输出：
1. 指标已经证明的问题，按用户影响排序
2. 请求瀑布、Bundle、服务端计算、缓存和重渲染证据
3. 每个建议对应的文件、规则依据和预期指标变化
4. 不应修改的部分，避免无收益重构
5. 最小实现顺序和每一步的回归测试
6. 可访问性、reduced motion、键盘与移动端检查

如果没有性能证据，先给采集方案，不要从代码外观推断瓶颈。`,
    doneCriteria: ['先有性能基线', '建议映射到具体证据', '每一步可单独验证', '性能和可访问性都回归'],
  },
  {
    id: 'source-driven-change',
    title: '按当前版本的官方文档实施功能',
    category: '工程工作流',
    summary: '使用 Source-driven Development，避免 AI 写出已经过时但看起来合理的 API。',
    skills: ['source-driven-development', 'incremental-implementation'],
    prompt: `请使用 source-driven-development 和 incremental-implementation Skills 实现下面的功能。

需求与验收：<填写>
允许修改的范围：<目录/文件>
依赖文件：<package.json、go.mod、pyproject.toml 等>
现有实现与测试：<粘贴关键内容>
风险约束：<兼容性、数据、权限、上线窗口>

开始编码前先输出：
1. 从依赖文件确认的框架、库和精确版本
2. 与本功能直接相关的官方文档链接和关键约束
3. 现有代码与官方推荐模式的冲突
4. 可以独立验证、独立回滚的最小实施步骤
5. 每一步要增加或运行的测试

实施后再输出变更文件、验证结果、未验证项和来源。找不到官方依据的模式必须标记为 UNVERIFIED，不能用模型记忆补齐。`,
    doneCriteria: ['版本从项目文件确认', '关键模式有官方来源', '变更可分步回滚', '未验证项不伪装成结论'],
  },
  {
    id: 'release-readiness',
    title: '审核一次云上发布是否真的完成',
    category: '工程工作流',
    summary: '组合平台 Skill 与发布方法，避免把“构建成功”误判为“生产可用”。',
    skills: ['shipping-and-launch', 'cloud-run-basics / deploy-to-vercel / wrangler'],
    prompt: `请使用 shipping-and-launch，并根据实际平台选择 cloud-run-basics、deploy-to-vercel 或 wrangler Skill，审核这次发布。只读分析，不执行生产变更。

平台与环境：<填写>
Commit / Tag / Artifact：<填写>
构建与发布日志：<粘贴>
部署配置：<容器、环境变量、探针、流量、区域>
数据库 Migration：<如有>
上线前后指标：<错误率、延迟、容量、业务成功率>
回滚方式：<填写>

输出：
1. 代码、构建物、配置和实际运行版本是否一致
2. 启动、就绪、流量切换与连接排空风险
3. Migration 与应用版本的兼容窗口
4. 发布成功必须满足的技术和业务信号
5. 停止发布与触发回滚的阈值
6. 可直接执行的验证清单，但不要代替我执行生产写操作

“流水线绿色”“Pod Running”“域名可打开”都不能单独作为发布成功证据。`,
    doneCriteria: ['运行版本可追溯到 Commit', '健康与业务信号同时满足', '回滚阈值明确', '数据变更考虑兼容窗口'],
  },
  {
    id: 'skill-security-review',
    title: '安装第三方 Skill 前做安全审查',
    category: '安全与审计',
    summary: '先读 Skill 和脚本，再决定是否允许它进入本机或仓库。',
    skills: ['SkillSpector', 'supply-chain-risk-auditor'],
    prompt: `请对下面的第三方 Agent Skill 做安装前安全审查。不要执行它的脚本、安装命令或网络请求。

仓库与 Commit：<固定到具体 URL / SHA>
SKILL.md：<粘贴或提供只读路径>
脚本与依赖文件：<列出并粘贴关键内容>
计划安装位置：<全局 / 当前仓库>
它将访问的数据：<代码、浏览器、Token、文档、生产环境等>

请输出：
1. Skill 的触发条件、实际动作和外部依赖
2. 文件读写、命令执行、网络访问和凭据使用范围
3. Prompt injection、数据外传、持久化和供应链风险
4. 模糊或超出其描述的行为
5. 最小权限安装方案：固定 Commit、隔离目录、禁用或删除哪些脚本
6. 结论：允许 / 有条件允许 / 拒绝，并逐条给出证据

Star 数、作者名和自动扫描“安全”都不能替代人工阅读。`,
    doneCriteria: ['固定仓库版本', '读完 SKILL.md 和脚本', '权限与数据范围明确', '结论有文件证据'],
  },
];
