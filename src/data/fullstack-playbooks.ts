export type PlaybookStage = '接手项目' | '开发设计' | '数据与异步' | '发布部署' | '生产排障';

export type EvidenceType = '代码' | '请求' | 'SQL' | '配置' | '日志' | '指标';

export interface PlaybookSource {
  title: string;
  url: string;
}

export interface PlaybookLink {
  title: string;
  href: string;
}

export interface FullstackPlaybook {
  id: string;
  order: string;
  title: string;
  summary: string;
  stage: PlaybookStage;
  evidenceTypes: EvidenceType[];
  tools: string[];
  when: string;
  materials: string[];
  prompt: string;
  outputFormat: string[];
  doneCriteria: string[];
  pitfalls: string[];
  related: PlaybookLink[];
  sources: PlaybookSource[];
}

export const playbookStages: PlaybookStage[] = [
  '接手项目',
  '开发设计',
  '数据与异步',
  '发布部署',
  '生产排障',
];

export const evidenceTypes: EvidenceType[] = ['代码', '请求', 'SQL', '配置', '日志', '指标'];

export const fullstackPlaybooks: FullstackPlaybook[] = [
  {
    id: 'orient-go-service',
    order: '01',
    title: '接手一个陌生 Go 服务',
    summary: '不先通读全部代码，用入口、路由、配置和一次请求建立最小可用地图。',
    stage: '接手项目',
    evidenceTypes: ['代码', '配置', '请求'],
    tools: ['Go', 'rg', 'curl', 'Mermaid'],
    when: '第一次进入公司的 Go 仓库，需要尽快定位一次需求会经过哪些代码和外部依赖。',
    materials: [
      '仓库目录树，至少展开到第二或第三层',
      'go.mod、main.go 或 cmd 目录中的启动入口',
      '路由注册、中间件和配置加载代码',
      '一个真实接口的请求方法、路径、请求体和响应',
      'README、启动命令，以及已知的部署方式',
    ],
    prompt: `我是有经验的前端开发者，正在接手一个陌生 Go 服务。请只根据我提供的仓库证据分析，不要凭框架惯例补全不存在的结构，也不要直接修改代码。

目标：让我能沿着一个真实请求理解这个服务，并找到风险最低的第一个修改点。

我会提供：
1. 目录树：<粘贴目录树>
2. go.mod：<粘贴内容>
3. 启动入口：<粘贴 main.go 或 cmd 入口>
4. 路由与中间件：<粘贴相关代码>
5. 配置加载：<粘贴配置代码，Secret 必须脱敏>
6. 真实请求：<方法、URL、Header、Body、响应>

请按以下顺序输出：
A. 已确认事实：每条注明证据来自哪个文件或请求
B. 启动路径：从进程启动到开始监听端口
C. 请求路径：网关/路由 → 中间件 → Handler → Service → Repository/外部依赖
D. 关键边界：鉴权、参数校验、事务、缓存、异步任务、超时和错误转换分别在哪里
E. 最安全的第一个修改点：说明改动范围、验证方法和回滚方式
F. 仍属推断的部分：单独列出，不要混入事实
G. 向后端或运维同事确认的 5 个高价值问题

最后给出一张 Mermaid 请求路径图。如果现有材料不足以得出结论，先指出缺少哪个文件或运行证据。`,
    outputFormat: ['已确认事实与文件证据', '启动路径和请求路径', '边界与风险清单', '最小修改建议', 'Mermaid 路径图', '待确认问题'],
    doneCriteria: [
      '能从一个 URL 定位到 Handler、Service 和数据访问代码',
      '事实与推断被明确分开',
      '知道本地如何启动、如何复现请求、如何验证修改',
      '形成一组可以向项目维护者确认的具体问题',
    ],
    pitfalls: ['只让 AI 介绍项目用了什么框架', '一次性粘贴整个仓库而没有目标请求', '把 AI 根据目录名作出的推断当成事实'],
    related: [
      { title: '请求与服务边界', href: '/docs/fullstack-lifecycle/request-and-service' },
      { title: 'Fetch 与 Go HTTP Client', href: '/docs/frontend-to-go/fetch-vs-http-client' },
    ],
    sources: [
      { title: 'Go Modules Reference', url: 'https://go.dev/ref/mod' },
      { title: 'Go net/http', url: 'https://pkg.go.dev/net/http' },
    ],
  },
  {
    id: 'change-first-api',
    order: '02',
    title: '安全修改第一个后端接口',
    summary: '先锁定契约、数据副作用和验证方式，再让 AI 给出最小改动计划。',
    stage: '开发设计',
    evidenceTypes: ['代码', '请求', 'SQL'],
    tools: ['Go', 'OpenAPI', 'curl', 'go test'],
    when: '需要新增字段、修改校验或补一个 CRUD 接口，但还不熟悉服务端的影响范围。',
    materials: [
      '修改前后的接口期望，包含兼容性要求',
      '真实请求和响应，以及失败响应样例',
      'Handler、Service、Repository 和相关 Model 代码',
      '表结构、迁移文件或外部 API 契约',
      '现有测试、调用方和发布约束',
    ],
    prompt: `我要修改一个 Go 后端接口。请先做影响分析和实施计划，不要直接生成一大段替换代码。

需求：<描述用户行为和验收结果>
现有请求/响应：<粘贴 curl、Body、状态码和响应>
目标请求/响应：<写清新增、删除或语义变化>
相关代码：
- Handler：<粘贴>
- Service：<粘贴>
- Repository：<粘贴>
- Model/DTO：<粘贴>
- 数据表或外部接口：<粘贴>
- 现有测试：<粘贴>

请输出：
1. 契约变化：字段、状态码、错误语义和向后兼容性
2. 调用路径：这次修改会经过的文件、函数和依赖
3. 数据副作用：读写哪些表，是否需要事务、幂等、锁或迁移
4. 最小改动顺序：逐文件说明“为什么改”，不要猜测未提供的文件
5. 测试矩阵：正常、边界、权限、重复请求、依赖失败和回归场景
6. 可直接运行的 curl 验证命令，变量使用占位符
7. 发布与回滚关注点
8. 尚缺证据和需要找后端同事确认的事项

把“必须修改”“可能修改”“无需修改”分开。若需求本身会破坏兼容性，先明确指出，不要用代码掩盖设计问题。`,
    outputFormat: ['契约 Diff', '影响路径', '数据副作用', '逐文件改动计划', '测试矩阵', 'curl 验证', '发布风险'],
    doneCriteria: [
      '修改前后契约可以被请求样例清楚表达',
      '正常和失败路径都有自动化或可复现验证',
      '数据库和外部依赖的副作用已被识别',
      '回滚不会留下无法解释的数据状态',
    ],
    pitfalls: ['只描述“新增一个接口”而不提供调用方', '先改 Handler，最后才发现数据库约束不允许', '只测试 200 响应，不测试权限、重复请求和依赖失败'],
    related: [
      { title: '请求与服务边界', href: '/docs/fullstack-lifecycle/request-and-service' },
      { title: '可靠性与安全', href: '/docs/fullstack-lifecycle/reliability-and-security' },
    ],
    sources: [
      { title: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
      { title: 'Go Testing', url: 'https://pkg.go.dev/testing' },
    ],
  },
  {
    id: 'schema-review',
    order: '03',
    title: '从业务不变量设计数据表',
    summary: '不从字段列表开始，而是先识别系统事实、唯一性和并发下必须成立的规则。',
    stage: '数据与异步',
    evidenceTypes: ['SQL', '请求', '代码'],
    tools: ['PostgreSQL', 'Migration', 'ER Diagram'],
    when: '准备新建表、给现有业务加状态字段，或发现数据规则主要靠代码 if 判断维护。',
    materials: [
      '业务动作、角色以及至少 3 个真实使用场景',
      '必须始终成立的规则和允许发生的状态变化',
      '预估数据量、查询方式和保留周期',
      '现有表结构、索引、外键和命名约定',
      '删除、审计、租户隔离与合规要求',
    ],
    prompt: `请帮我评审一个数据库设计。不要先列字段，请先从业务事实和不变量推导约束。

业务目标：<要解决的问题>
角色与动作：<谁在什么条件下做什么>
典型场景：<至少 3 个真实场景>
必须成立的不变量：<例如同一租户订单号唯一、余额不能为负>
主要查询：<查询条件、排序、分页、聚合>
规模预估：<日增量、总量、读写比例、保留周期>
现有 Schema：<粘贴 CREATE TABLE/索引/外键>
技术环境：<PostgreSQL/MySQL 版本、ORM 或 sqlc>

请输出：
1. 业务事实与派生数据：哪些必须存，哪些可以计算
2. 表、字段、类型、可空性以及命名理由
3. 应由数据库保证的不变量：PRIMARY KEY、UNIQUE、CHECK、FOREIGN KEY
4. 状态流转和并发写入风险
5. 基于真实查询模式推导的索引，不要给“可能有用”的索引
6. 删除、审计、租户隔离和敏感信息处理
7. 可回滚的 Migration 草案与旧数据回填策略
8. 需要用 EXPLAIN 或并发测试验证的假设

每项结论标注“业务已确认”或“设计假设”。最后列出 5 个在写 SQL 前必须由产品/后端确认的问题。`,
    outputFormat: ['事实与不变量', 'Schema 草案', '数据库约束', '查询与索引依据', 'Migration 计划', '待验证假设'],
    doneCriteria: [
      '关键规则能够由数据库约束或事务保护',
      '每个索引都对应真实查询，而不是凭感觉添加',
      '迁移包含旧数据处理、发布顺序和回滚边界',
      '业务事实和可重新计算的派生数据被区分',
    ],
    pitfalls: ['把 TypeScript Interface 直接翻译成数据表', '所有字段都允许 NULL', '只讨论建表，不讨论旧数据迁移和并发写入'],
    related: [{ title: '数据库与状态', href: '/docs/fullstack-lifecycle/database-and-state' }],
    sources: [
      { title: 'PostgreSQL Constraints', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
      { title: 'PostgreSQL Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html' },
    ],
  },
  {
    id: 'slow-sql',
    order: '04',
    title: '用执行计划定位慢 SQL',
    summary: '让 AI 解读真实执行计划和数据分布，而不是凭 SQL 外观建议“加索引”。',
    stage: '生产排障',
    evidenceTypes: ['SQL', '指标', '日志'],
    tools: ['PostgreSQL', 'EXPLAIN ANALYZE', 'pg_stat_statements'],
    when: '接口变慢，已定位到 SQL，但还不知道是扫描、排序、Join、锁还是数据分布问题。',
    materials: [
      '脱敏后的完整 SQL 与参数值类型',
      'EXPLAIN (ANALYZE, BUFFERS) 输出；生产环境先评估执行风险',
      '相关表、索引、行数和字段基数',
      '慢查询耗时分布、调用频率和业务可接受延迟',
      '数据库版本、资源限制和近期数据量变化',
    ],
    prompt: `请基于真实执行计划诊断这条慢 SQL。不要只说“加索引”，也不要在缺少数据分布时假定索引一定生效。

数据库与版本：<例如 PostgreSQL 16>
SQL 与参数：<粘贴，敏感数据脱敏>
执行计划：<粘贴 EXPLAIN (ANALYZE, BUFFERS)>
表结构与现有索引：<粘贴>
表行数与关键字段基数：<粘贴统计结果>
线上表现：<P50/P95/P99、调用频率、超时阈值>
近期变化：<数据量、版本、参数或流量变化>

请输出：
1. 从计划中直接读到的事实：实际行数、估算偏差、耗时热点、Buffer、排序和扫描方式
2. 最可能的瓶颈，按证据强弱排序
3. 最小验证实验：每次只改变一个变量，并说明成功信号
4. 如建议索引，给出列顺序、部分条件/覆盖列、写放大和存储代价
5. 如不应加索引，说明应改 SQL、统计信息、数据模型、分页或缓存的理由
6. 变更后的对比指标和回滚条件
7. 仍缺哪些证据

请把“计划明确证明的事实”和“需要实验确认的假设”分成两栏。`,
    outputFormat: ['执行计划事实', '瓶颈排序', '单变量验证实验', '优化候选及代价', '对比指标', '缺失证据'],
    doneCriteria: [
      '优化前后使用同一参数和数据集对比',
      '能够解释计划变化，而不只是看到耗时下降',
      '新索引的写入和存储代价已评估',
      '线上成功指标与回滚阈值明确',
    ],
    pitfalls: ['只粘贴 SQL，不提供执行计划和参数', '在生产直接运行高风险 ANALYZE', '为了一个低频查询增加高成本索引'],
    related: [
      { title: '数据库与状态', href: '/docs/fullstack-lifecycle/database-and-state' },
      { title: '生产排障', href: '/docs/fullstack-lifecycle/production-debugging' },
    ],
    sources: [
      { title: 'PostgreSQL Using EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
      { title: 'pg_stat_statements', url: 'https://www.postgresql.org/docs/current/pgstatstatements.html' },
    ],
  },
  {
    id: 'transaction-idempotency',
    order: '05',
    title: '评审事务、重试与幂等',
    summary: '把“请求会不会重复”和“哪些状态必须一起变化”说清楚，再决定锁与幂等键。',
    stage: '数据与异步',
    evidenceTypes: ['代码', '请求', 'SQL'],
    tools: ['Go', 'PostgreSQL', 'Idempotency-Key'],
    when: '处理创建订单、扣费、发放权益或调用第三方接口，失败重试可能造成重复副作用。',
    materials: [
      '完整业务步骤和每一步的读写对象',
      '请求唯一标识、重试来源和超时策略',
      '事务代码、SQL、唯一约束和隔离级别',
      '外部依赖是否支持幂等或查询结果',
      '部分成功后的补偿、对账与人工处理方式',
    ],
    prompt: `请评审下面这条业务链路的事务与幂等设计。重点不是生成代码，而是找出重复执行、部分成功和并发竞争下会破坏的业务不变量。

业务动作：<例如创建订单并扣减额度>
步骤与副作用：<按时间顺序列出数据库写入、缓存、消息和外部 API>
请求标识：<request_id/order_id/idempotency_key 的来源>
重试来源：<前端重试、网关、服务、队列、人工补偿>
事务与 SQL：<粘贴代码和约束>
外部依赖语义：<超时、幂等、查询和回调能力>
当前失败处理：<粘贴>

请输出：
1. 必须始终成立的业务不变量
2. 重复请求、并发请求、超时未知、进程崩溃、消息重复五种情况下的状态变化
3. 本地事务能保护什么，跨系统事务不能保护什么
4. 幂等键的生成、存储、唯一约束、结果复用和过期策略
5. 建议的执行顺序，以及 Outbox、补偿或对账是否必要
6. 最小并发/故障注入测试矩阵
7. 监控指标、告警和人工恢复入口

如果只能做到“至少一次”，请明确指出重复副作用如何被消除；不要用“加分布式锁”作为缺少不变量分析的替代品。`,
    outputFormat: ['业务不变量', '五类失败时序', '事务边界', '幂等记录设计', '恢复机制', '故障测试矩阵'],
    doneCriteria: [
      '相同业务请求重复执行不会产生重复权益或扣费',
      '超时未知状态可以查询、对账或恢复',
      '数据库约束与应用逻辑共同保护关键不变量',
      '并发与故障测试可以稳定复现设计承诺',
    ],
    pitfalls: ['把 HTTP 200 当作唯一完成证据', '误以为数据库事务可以覆盖第三方 API', '只有随机 Request ID，却没有业务唯一约束'],
    related: [
      { title: '数据库与状态', href: '/docs/fullstack-lifecycle/database-and-state' },
      { title: '可靠性与安全', href: '/docs/fullstack-lifecycle/reliability-and-security' },
    ],
    sources: [
      { title: 'PostgreSQL Transaction Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html' },
      { title: 'AWS Builders Library - Making retries safe', url: 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/' },
    ],
  },
  {
    id: 'redis-decision',
    order: '06',
    title: '判断是否真的需要 Redis',
    summary: '先量化数据库压力与延迟目标，再讨论缓存对象、失效和一致性成本。',
    stage: '数据与异步',
    evidenceTypes: ['指标', 'SQL', '代码'],
    tools: ['Redis', 'PostgreSQL', 'Prometheus'],
    when: '有人提出“加个缓存就快了”，但团队还没有说明慢在哪里、缓存错了会发生什么。',
    materials: [
      '当前请求链路及耗时拆分',
      '读写比例、QPS、热点分布和延迟目标',
      '数据库查询与执行计划',
      '数据允许陈旧多久，以及错误数据的业务后果',
      '现有缓存代码、容量、命中率和故障表现',
    ],
    prompt: `请评审这个场景是否应该引入 Redis。不要默认缓存一定正确，先用数据判断瓶颈和一致性代价。

用户场景：<请求在完成什么>
当前链路与耗时：<网关、服务、SQL、下游的 P50/P95/P99>
流量：<QPS、读写比例、峰值、热点 Key 分布>
数据库证据：<SQL、执行计划、连接池和负载>
一致性要求：<最多允许陈旧多久，错误数据会造成什么后果>
数据规模：<对象大小、数量、增长和过期规律>
当前方案：<代码或架构图>

请输出：
1. 当前瓶颈是否已经被证据定位
2. 不加 Redis 的候选方案：SQL/索引、批处理、本地缓存、CDN、读模型等
3. 如使用 Redis：缓存对象、Key、Value、TTL、容量估算和淘汰策略
4. Cache Aside 的读写时序，缓存穿透、击穿、雪崩和热 Key 风险
5. 一致性边界：更新、删除、失败和 Redis 不可用时的行为
6. 上线实验：命中率、延迟、数据库负载、错误率和回滚阈值
7. 最终建议：现在引入 / 暂不引入 / 先补证据

结论必须引用我提供的数据。若没有延迟或负载证据，默认结论应是“先测量”，不是“加 Redis”。`,
    outputFormat: ['瓶颈证据', '无缓存替代方案', '缓存数据模型', '失败与一致性时序', '容量和指标', '明确决策'],
    doneCriteria: [
      '引入缓存前已有可复现的性能基线',
      'Redis 故障不会让核心业务完全不可用或写错数据',
      '失效和一致性策略可以画成明确时序',
      '命中率、容量和回滚阈值可被监控',
    ],
    pitfalls: ['没有性能数据就缓存', '只设计命中路径，不设计更新和故障路径', '把 Redis 当成无需约束的主数据库'],
    related: [{ title: '数据库、缓存与异步', href: '/docs/fullstack-lifecycle/database-and-state' }],
    sources: [
      { title: 'Redis Documentation', url: 'https://redis.io/docs/latest/' },
      { title: 'AWS Caching Challenges and Strategies', url: 'https://aws.amazon.com/builders-library/caching-challenges-and-strategies/' },
    ],
  },
  {
    id: 'queue-decision',
    order: '07',
    title: '判断是否该使用消息队列',
    summary: '从响应时限、生产消费速率和失败恢复出发，而不是因为“解耦”就引入队列。',
    stage: '数据与异步',
    evidenceTypes: ['代码', '指标', '配置'],
    tools: ['Kafka', 'RabbitMQ', 'Pub/Sub'],
    when: '同步接口耗时过长、流量有尖峰，或多个下游需要消费同一业务事件。',
    materials: [
      '当前同步流程和用户必须立即看到的结果',
      '峰值生产速率、平均消费速率和允许积压时间',
      '消息体、业务唯一键、顺序和一致性要求',
      '消费者副作用、重试策略和当前监控',
      '停机、重复、乱序和毒消息的业务处理规则',
    ],
    prompt: `请评审下面的流程是否应该改为消息队列。先区分用户必须同步得到的结果和可以延后完成的工作。

当前同步流程：<步骤、耗时、依赖和返回结果>
用户时限：<接口超时和用户必须立即看到的状态>
流量：<平均/峰值生产速率、消费能力、可接受积压时间>
事件与消息：<业务事件、消息体、唯一键、顺序要求>
消费者副作用：<数据库写入、通知、第三方 API 等>
失败现状：<超时、重试、重复、人工恢复>

请输出：
1. 同步核心与异步候选的边界
2. 不引入队列的简单方案，以及它们何时不够用
3. 如引入队列：Topic/Queue、分区或路由键、消息 Schema 和兼容演进
4. 至少一次投递下的消费者幂等设计
5. 重试退避、死信、毒消息、积压和乱序处理
6. 容量估算：峰值积压量、恢复时间和消费者扩容信号
7. 用户如何查询最终状态，运维如何重放或人工恢复
8. 最终建议和最小验证实验

不要把“发送成功”当成业务完成；必须说明消息最终处理结果在哪里被记录和查询。`,
    outputFormat: ['同步与异步边界', '简单替代方案', '消息契约', '幂等与失败处理', '容量估算', '状态查询和恢复'],
    doneCriteria: [
      '用户响应语义不会与实际处理状态混淆',
      '重复、乱序、积压和毒消息都有可执行处理方式',
      '生产和消费速率有量化依据',
      '能够查询、重放并审计失败任务',
    ],
    pitfalls: ['只说解耦，不算积压和恢复时间', '消费者没有幂等保护', '消息 Schema 变化没有兼容策略'],
    related: [{ title: '数据库、缓存与异步', href: '/docs/fullstack-lifecycle/database-and-state' }],
    sources: [
      { title: 'Apache Kafka Documentation', url: 'https://kafka.apache.org/documentation/' },
      { title: 'RabbitMQ Reliability Guide', url: 'https://www.rabbitmq.com/docs/reliability' },
    ],
  },
  {
    id: 'jenkins-release-review',
    order: '08',
    title: '发布前审核 Jenkins 流水线',
    summary: '把 Jenkinsfile 当成交付契约，检查测试、制品、迁移、发布、观察和回滚是否闭环。',
    stage: '发布部署',
    evidenceTypes: ['配置', '代码'],
    tools: ['Jenkins', 'Docker', 'Helm', 'Kubernetes'],
    when: '第一次负责后端服务上线，或修改了 Jenkinsfile、Dockerfile、Helm values 和数据库结构。',
    materials: [
      '完整 Jenkinsfile 与共享 Library 调用',
      'Dockerfile、构建参数和镜像标签规则',
      'Helm Chart/values 或 Kubernetes YAML',
      '测试、Migration、健康检查和回滚命令',
      '目标环境、审批规则、Secret 来源和观察指标',
    ],
    prompt: `请以“可追溯、可停止、可回滚”为标准审核这次 Jenkins 发布。只根据提供的流水线和部署配置下结论，不要假设平台会自动完成未写出的步骤。

目标环境：<测试/预发/生产、集群和 Namespace>
变更内容：<代码、配置、数据库、依赖>
Jenkinsfile：<粘贴，凭证脱敏>
Dockerfile：<粘贴>
Helm values/Kubernetes YAML：<粘贴>
Migration：<粘贴执行与回滚方式>
健康检查与观察指标：<粘贴>

请逐阶段审核：
1. Checkout：提交、分支和依赖是否可追溯
2. Test：哪些失败会阻断发布，是否缺少集成/迁移测试
3. Build：制品是否不可变，镜像标签能否定位到 Commit
4. Security：Secret 是否进入日志、参数、镜像层或仓库
5. Deploy：配置、健康检查、资源、滚动策略和超时
6. Migration：与新旧版本的兼容顺序，失败后数据如何处理
7. Observe：发布后看哪些日志、指标和业务信号，观察多久
8. Rollback：回到哪个镜像/配置，哪些数据库变化不可直接回滚

最终输出一张发布 Go/No-Go 检查表。每个风险标为“阻断发布 / 发布前修复 / 可接受但需观察”，并引用对应配置行或阶段。`,
    outputFormat: ['逐阶段证据审核', '风险等级', 'Go/No-Go 检查表', '发布观察窗口', '明确回滚目标'],
    doneCriteria: [
      '生产实例可追溯到提交、流水线和不可变镜像',
      '测试失败、健康检查失败会真正阻断或终止发布',
      '数据库变更与应用版本的发布顺序明确',
      '回滚目标、操作和不可逆边界已演练或确认',
    ],
    pitfalls: ['只确认流水线显示绿色', '镜像使用 latest，无法确认实际版本', '只准备应用回滚，不分析数据库 Migration'],
    related: [{ title: '构建、发布与运行', href: '/docs/fullstack-lifecycle/delivery-and-deployment' }],
    sources: [
      { title: 'Jenkins Pipeline', url: 'https://www.jenkins.io/doc/book/pipeline/' },
      { title: 'Kubernetes Deployments', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
    ],
  },
  {
    id: 'docker-image-review',
    order: '09',
    title: '检查后端 Docker 镜像',
    summary: '从可复现构建、最小运行面、配置边界和退出行为检查镜像，而不只追求体积小。',
    stage: '发布部署',
    evidenceTypes: ['配置', '代码'],
    tools: ['Docker', 'Go', 'Trivy'],
    when: '服务本地能运行，但进入容器后出现证书、时区、权限、信号或配置问题。',
    materials: [
      'Dockerfile、.dockerignore 和构建命令',
      '应用启动命令、端口、健康检查和所需运行文件',
      '基础镜像与依赖版本',
      '容器运行参数、环境变量、Volume 和安全上下文',
      '镜像扫描结果、容器日志和退出码',
    ],
    prompt: `请审核这个 Go 服务的 Docker 镜像，目标是可复现、安全、可观测并能正确启动和停止。不要只做“减小镜像体积”的表面优化。

Dockerfile：<粘贴>
.dockerignore：<粘贴>
构建命令和目标架构：<粘贴>
运行命令与参数：<粘贴>
应用需要的文件/证书/时区：<说明>
环境变量、Volume、端口和健康检查：<粘贴，Secret 脱敏>
运行错误或扫描结果：<粘贴>

请输出：
1. 构建可复现性：依赖固定、Build Context、缓存和多阶段构建
2. 运行正确性：二进制架构、动态库、CA 证书、时区和所需文件
3. 安全边界：非 Root、最小权限、Secret、基础镜像和漏洞
4. 进程行为：PID 1、SIGTERM、优雅退出、退出码和僵尸进程
5. 可观测性：日志输出、健康检查和版本信息
6. 镜像层中是否残留源码、Token、包缓存或构建工具
7. 按风险排序的最小修改建议，以及每项 docker build/run 验证命令

区分“构建期配置”和“运行期配置”；任何 Secret 都不能通过 ARG、ENV 或 COPY 固化进镜像层。`,
    outputFormat: ['构建审核', '运行依赖', '安全与 Secret', '信号和退出行为', '逐项验证命令'],
    doneCriteria: [
      '相同提交和依赖可以得到可追溯镜像',
      '容器以非 Root 运行并能响应 SIGTERM 优雅退出',
      '镜像历史和文件系统中没有 Secret',
      '健康检查反映服务是否真的能够处理请求',
    ],
    pitfalls: ['只看镜像大小', '把 .env COPY 进镜像', '使用 shell 启动但没有正确转发终止信号'],
    related: [{ title: '构建、发布与运行', href: '/docs/fullstack-lifecycle/delivery-and-deployment' }],
    sources: [
      { title: 'Dockerfile Reference', url: 'https://docs.docker.com/reference/dockerfile/' },
      { title: 'Docker Build Best Practices', url: 'https://docs.docker.com/build/building/best-practices/' },
    ],
  },
  {
    id: 'kubernetes-rollout',
    order: '10',
    title: '检查 Kubernetes 发布与回滚',
    summary: '从期望状态、流量接入和观测证据判断发布是否完成，而不是只看 Pod Running。',
    stage: '发布部署',
    evidenceTypes: ['配置', '日志', '指标'],
    tools: ['Kubernetes', 'kubectl', 'Helm', 'Prometheus'],
    when: '准备升级后端 Deployment，或遇到 Pod 已 Running 但接口仍不可用、滚动发布卡住。',
    materials: [
      'Deployment、Service、Ingress 和 HPA 配置',
      'Helm values、镜像版本和本次 Diff',
      'readiness、liveness、startup probe 配置',
      'kubectl describe/events、Pod 日志和 rollout 状态',
      '发布前后错误率、延迟、重启和业务指标',
    ],
    prompt: `请审核这次 Kubernetes 发布是否安全，并为异常时给出证据驱动的排查顺序。Pod Running 不能作为发布成功的唯一标准。

环境：<集群、Namespace、工作负载>
发布版本：<旧镜像、新镜像、Commit>
资源配置：<Deployment/Service/Ingress/HPA/ConfigMap，Secret 脱敏>
Helm Diff 或 YAML Diff：<粘贴>
Probe：<startup/readiness/liveness>
运行证据：<kubectl rollout status、describe、events、logs>
发布前后指标：<流量、错误、延迟、重启、资源和业务成功率>

请输出：
1. 这次变更实际改变了什么：镜像、配置、资源、网络、权限或探针
2. 发布策略分析：maxUnavailable/maxSurge、终止时间、连接排空和容量风险
3. 三种 Probe 是否表达了正确语义，阈值是否可能误杀或放入未就绪实例
4. 从 Ingress → Service → EndpointSlice → Pod → 应用端口的流量检查路径
5. 当前证据更支持配置、调度、启动、探针、网络还是应用故障
6. 下一步最小 kubectl 验证命令，每条说明预期结果
7. 继续发布、暂停还是回滚的判断阈值
8. 精确回滚目标和回滚后验证清单

命令必须包含 Namespace 和资源名占位符；不要建议删除资源或强制重建，除非明确解释数据和流量影响。`,
    outputFormat: ['变更 Diff', '发布容量风险', 'Probe 语义', '流量路径', '最小验证命令', '继续/暂停/回滚判断'],
    doneCriteria: [
      '新版本实际接收到流量且业务成功率正常',
      '发布期间容量、延迟和错误率未越过阈值',
      '问题可以被定位到流量路径中的具体边界',
      '回滚后版本、配置和关键指标得到再次确认',
    ],
    pitfalls: ['只看 Pod 是 Running', 'liveness 探针过严导致故障循环', '回滚镜像却遗漏同步变化的 ConfigMap 或 Migration'],
    related: [
      { title: '构建、发布与运行', href: '/docs/fullstack-lifecycle/delivery-and-deployment' },
      { title: '可观测性', href: '/docs/fullstack-lifecycle/observability' },
    ],
    sources: [
      { title: 'Kubernetes Deployments', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
      { title: 'Kubernetes Probes', url: 'https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/' },
    ],
  },
  {
    id: 'loki-http-500',
    order: '11',
    title: '沿 Request ID 排查接口 500',
    summary: '固定环境、版本、时间和请求标识，逐层收敛网关、服务、数据与下游故障边界。',
    stage: '生产排障',
    evidenceTypes: ['日志', '请求', '配置', '指标'],
    tools: ['Loki', 'LogQL', 'Grafana', 'Kubernetes'],
    when: '线上接口返回 500，手上只有用户时间、路径或 Request ID，需要组织一条可靠排查链。',
    materials: [
      '环境、服务、时区、精确时间范围和部署版本',
      '脱敏后的完整请求与响应',
      'Request ID、Trace ID、用户或业务对象标识',
      'Loki Label、相关日志和上下文行',
      '同一时间的错误率、延迟、重启和下游状态',
    ],
    prompt: `请帮我沿 Request ID 排查一次 HTTP 500。先固定证据，再收敛故障边界；不要看到一条 error 就直接宣布根因。

环境与时区：<生产/预发，Asia/Shanghai 或 UTC>
服务与 Namespace：<填写>
时间范围：<开始和结束，保留原始时区>
部署版本：<Commit/镜像/发布时间>
请求：<方法、路径、Header、Body，敏感信息脱敏>
响应：<状态码、Body、响应 Header>
标识：<request_id、trace_id、user_id、业务对象 ID>
Loki Labels：<cluster/namespace/app/container 等实际标签>
现有日志：<粘贴命中行和前后文>
同期指标/事件：<错误率、P95、Pod 重启、发布和依赖告警>

请输出：
1. 已确认事实：时间、版本、请求、响应和日志必须互相对齐
2. 分阶段 LogQL：先确认标签和流量，再按路径/Request ID/错误特征逐步收窄
3. 故障边界表：网关、应用、数据库、缓存/队列、外部依赖分别有哪些支持和反对证据
4. 错误链：原始失败在哪里发生，经过哪些包装后成为 HTTP 500
5. 下一步最小验证：每次只补一个最有区分度的证据
6. 临时止损、根因修复和防复发动作要分开
7. 尚缺证据，明确说明缺失会阻止什么结论

LogQL 必须使用我给出的真实 Label；若 Label 未知，第一步先查询可用标签，不要编造 app、job 或 service_name。`,
    outputFormat: ['证据时间线', '递进式 LogQL', '故障边界表', '错误传播链', '最小验证动作', '缺失证据'],
    doneCriteria: [
      '请求、日志、版本和时间范围完全对齐',
      '根因结论至少有两类独立证据支持',
      '修复后使用原请求或等价请求验证恢复',
      '补充告警、结构化日志、测试或运行手册防止复发',
    ],
    pitfalls: ['不知道真实 Label 就让 AI 编写 LogQL', '只搜 error 关键词，不绑定版本和请求', '把最靠近响应的包装错误当成原始根因'],
    related: [
      { title: '可观测性', href: '/docs/fullstack-lifecycle/observability' },
      { title: '生产排障', href: '/docs/fullstack-lifecycle/production-debugging' },
    ],
    sources: [
      { title: 'Grafana Loki LogQL', url: 'https://grafana.com/docs/loki/latest/query/' },
      { title: 'OpenTelemetry Context Propagation', url: 'https://opentelemetry.io/docs/concepts/context-propagation/' },
    ],
  },
  {
    id: 'incident-postmortem',
    order: '12',
    title: '把故障复盘变成机制改进',
    summary: '复盘不寻找“谁操作错了”，而是把证据、决策和系统缺口转化成可验证改进。',
    stage: '生产排障',
    evidenceTypes: ['日志', '指标', '配置', '代码'],
    tools: ['Timeline', 'SLO', 'Runbook', 'Alerting'],
    when: '故障已恢复，需要整理时间线、影响、根因和真正能防复发的行动项。',
    materials: [
      '带时区的事件时间线和关键决策',
      '用户影响、业务损失、错误率、延迟和持续时间',
      '发布记录、配置 Diff、日志、指标和 Trace',
      '止损、恢复和验证操作及其结果',
      '现有测试、告警、发布门禁和 Runbook',
    ],
    prompt: `请把下面的故障材料整理成无责复盘。不要美化未知信息，也不要把“操作失误”当作停止追问的根因。

故障标题：<用户可感知的现象>
影响：<用户、请求、金额/数据、地区、持续时间>
时间线：<每条包含时间、时区、证据和动作>
版本与变更：<Commit、镜像、配置 Diff、发布时间>
日志/指标/Trace：<粘贴关键证据>
止损与恢复：<做了什么、为何做、结果如何>
当前根因判断：<填写并注明信心程度>
现有防线：<测试、告警、审批、灰度、回滚、Runbook>

请输出：
1. 一句话摘要：发生了什么、影响什么、持续多久
2. 只包含可证实事件的时间线；未知项标记为未知
3. 直接触发因素、技术根因和组织/流程促成因素
4. 为什么现有测试、监控、发布和恢复机制没有更早阻止或发现
5. 哪些动作只是止损，哪些修复了根因
6. 行动项：每项包含 Owner、截止时间、优先级、验证方法和完成证据
7. 将高价值动作分别沉淀为测试、告警、发布门禁、Runbook 或架构改进
8. 仍待确认的问题和需要保留的证据

行动项不能写“加强测试”“提高意识”这类无法验收的表述。优先减少故障发生概率、缩短发现时间和降低恢复成本。`,
    outputFormat: ['事故摘要', '证据时间线', '根因层次', '防线缺口', '可验收行动项', '待确认问题'],
    doneCriteria: [
      '事实、判断和未知信息严格分开',
      '行动项有负责人、时间和机器可验证的完成证据',
      '至少补上一种自动检测或自动阻断机制',
      'Runbook 能让未参与事故的人完成基本判断和恢复',
    ],
    pitfalls: ['把复盘写成流水账', '根因停在“某个人操作错误”', '行动项只有“加强意识”和“以后注意”'],
    related: [
      { title: '生产排障', href: '/docs/fullstack-lifecycle/production-debugging' },
      { title: '可靠性与安全', href: '/docs/fullstack-lifecycle/reliability-and-security' },
    ],
    sources: [
      { title: 'Google SRE - Postmortem Culture', url: 'https://sre.google/sre-book/postmortem-culture/' },
      { title: 'Google SRE - Managing Incidents', url: 'https://sre.google/sre-book/managing-incidents/' },
    ],
  },
];
