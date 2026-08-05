export interface LifecycleStage {
  id: string;
  order: string;
  title: string;
  question: string;
  frontend: string;
  principle: string;
  responsibilities: string[];
  tools: string[];
  evidence: string;
  href: string;
}

export const fullstackLifecycleStages: LifecycleStage[] = [
  {
    id: 'intent-contract',
    order: '01',
    title: '用户意图与请求契约',
    question: '用户的一次点击，如何变成后端可以验证的输入？',
    frontend: '事件处理、表单校验、Fetch、TypeScript 类型',
    principle: '跨越系统边界的信息必须被显式描述、验证并兼容演进。',
    responsibilities: ['定义请求和响应', '区分体验校验与服务端校验', '约定错误码、身份与幂等键'],
    tools: ['HTTP', 'OpenAPI', 'curl', 'DevTools'],
    evidence: '请求可以被独立复现，异常输入会得到稳定、可解释的响应。',
    href: '/docs/fullstack-lifecycle/request-and-service',
  },
  {
    id: 'service-boundary',
    order: '02',
    title: '服务边界与业务规则',
    question: '请求进入服务以后，哪些代码负责协议，哪些代码负责业务？',
    frontend: 'Router、Middleware、Hooks、Service 层、状态机',
    principle: '业务规则不应依赖某个页面、HTTP 框架或数据库实现。',
    responsibilities: ['拆分 Handler、Service、Repository', '传播 Context 与错误', '保持核心规则可测试'],
    tools: ['Go net/http', 'Middleware', 'Context', 'Table-driven Test'],
    evidence: '同一业务规则可以被 HTTP、任务消费者或测试代码复用。',
    href: '/docs/fullstack-lifecycle/request-and-service',
  },
  {
    id: 'data-state',
    order: '03',
    title: '数据与状态',
    question: '什么是系统事实，如何让它在并发和重启后仍然可信？',
    frontend: 'localStorage、IndexedDB、React Query Cache、共享 Store',
    principle: '持久化的本质是维护可恢复、可约束、可并发修改的系统事实。',
    responsibilities: ['设计表与约束', '使用事务保护不变量', '区分数据库、缓存和进程状态'],
    tools: ['PostgreSQL', 'SQL', 'sqlc', 'Redis', 'Migration'],
    evidence: '重复请求、并发更新和服务重启不会破坏关键业务状态。',
    href: '/docs/fullstack-lifecycle/database-and-state',
  },
  {
    id: 'async-decoupling',
    order: '04',
    title: '缓存与异步解耦',
    question: '什么时候应该同步完成，什么时候应该缓存或排队？',
    frontend: 'React Query 缓存、Web Worker、事件队列',
    principle: '缓存用一致性换延迟，消息队列用即时完成换解耦和削峰。',
    responsibilities: ['定义过期与失效策略', '保证重复消费幂等', '处理重试、积压和死信'],
    tools: ['Redis', 'Kafka', 'RabbitMQ', 'Pub/Sub'],
    evidence: '系统能够说明缓存何时失效、消息是否可能重复、失败如何恢复。',
    href: '/docs/fullstack-lifecycle/database-and-state',
  },
  {
    id: 'build-release',
    order: '05',
    title: '构建、发布与运行',
    question: '本地可运行的代码，如何成为可重复、可回滚的生产版本？',
    frontend: 'Vite Build、环境变量、Vercel Preview、前端版本回滚',
    principle: '交付的不是源码，而是经过验证、不可变、可追踪的运行制品。',
    responsibilities: ['自动执行测试和构建', '生成并保存镜像', '配置健康检查、灰度和回滚'],
    tools: ['Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes', 'Helm'],
    evidence: '任一生产实例都能追溯到提交、流水线和镜像，并能快速回滚。',
    href: '/docs/fullstack-lifecycle/delivery-and-deployment',
  },
  {
    id: 'observability',
    order: '06',
    title: '可观测性',
    question: '系统内部不可见时，如何从外部证据推断发生了什么？',
    frontend: 'console、Network、Performance、错误上报',
    principle: '无法观察的系统无法被可靠维护；日志、指标和链路回答不同问题。',
    responsibilities: ['输出结构化日志和 Request ID', '定义延迟、流量、错误和饱和度指标', '贯穿跨服务 Trace'],
    tools: ['Loki', 'Prometheus', 'Grafana', 'OpenTelemetry', 'Tempo'],
    evidence: '一次异常请求可以通过同一个标识关联日志、指标、链路和版本。',
    href: '/docs/fullstack-lifecycle/observability',
  },
  {
    id: 'debug-improve',
    order: '07',
    title: '生产排障与机制改进',
    question: '发现故障后，如何从现象走到根因，并防止再次发生？',
    frontend: '复现步骤、Network 对比、Source Map、性能录制',
    principle: '排障是证据收敛过程；修复完成的标准是验证恢复并建立防复发机制。',
    responsibilities: ['固定时间、版本和请求证据', '区分网关、服务、数据和依赖故障', '补测试、告警、回滚和复盘'],
    tools: ['LogQL', 'kubectl', 'SQL EXPLAIN', 'pprof', 'Delve'],
    evidence: '结论包含现象、证据、根因、修复、验证和防复发动作。',
    href: '/docs/fullstack-lifecycle/production-debugging',
  },
];
