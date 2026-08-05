import Link from 'next/link';

const supportingPaths = [
  {
    label: '任务配方',
    title: '把 AI 带进真实工作现场',
    description: '接手项目、改接口、查日志、审流水线，都从真实证据和完成标准开始。',
    href: '/docs/playbooks',
  },
  {
    label: 'Skills / Prompt',
    title: '把官方知识装进 Agent',
    description: '精选官方与高质量工程 Skills，并给出可以带着真实证据直接使用的提示词。',
    href: '/docs/skills',
  },
  {
    label: '学习路线',
    title: '从一次接口修改开始',
    description: '先进入真实项目，再补数据、可靠性和部署知识。',
    href: '/docs/roadmap',
  },
  {
    label: '原理映射',
    title: '把前端经验迁移到 Go',
    description: '说明哪些概念可以类比，哪些地方不能照搬。',
    href: '/docs/frontend-to-go',
  },
  {
    label: '资料来源',
    title: '官方文档与实践仓库',
    description: '原理回到官方文档核对，动手练习使用开放仓库。',
    href: '/docs/resources',
  },
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="home-intro">
        <div className="home-masthead">
          <p className="home-edition">前端走向全栈 · 开放知识库</p>
          <h1>
            <span className="home-title-primary">从一次请求开始，</span>
            <span className="home-title-secondary">补齐服务端，</span>
            <span className="home-title-secondary">再走到生产环境。</span>
          </h1>
          <p className="home-summary">
            你已经会处理交互、状态和接口。这里继续往后走：服务如何保存数据，代码如何发布，
            线上问题又如何找到证据。每个专题都从前端概念出发，同时说明类比的边界。
          </p>
          <Link href="/docs/fullstack-lifecycle" className="home-start-link">
            从完整链路开始
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <aside className="home-notes" aria-label="知识库当前内容">
          <p>目前整理</p>
          <dl>
            <div>
              <dt>交付链路</dt>
              <dd>7 个阶段</dd>
            </div>
            <div>
              <dt>前端类比</dt>
              <dd>30 组映射</dd>
            </div>
            <div>
              <dt>基础内容</dt>
              <dd>6 篇专题</dd>
            </div>
            <div>
              <dt>任务配方</dt>
              <dd>12 个场景</dd>
            </div>
            <div>
              <dt>Skill 来源</dt>
              <dd>14 组精选</dd>
            </div>
          </dl>
          <p className="home-notes-caption">内容优先使用官方文档校验，并保留来源和适用边界。</p>
        </aside>
      </section>

      <section className="home-paths">
        <article className="home-feature-path">
          <p>建议先读</p>
          <h2>一次需求的完整链路</h2>
          <p>
            用户操作如何变成请求，如何经过业务、数据库和异步任务，再由流水线发布到生产，
            最后通过日志、指标和 Trace 被观察。
          </p>
          <Link href="/docs/fullstack-lifecycle">进入完整链路 →</Link>
        </article>

        <nav className="home-path-list" aria-label="其他学习入口">
          {supportingPaths.map((entry, index) => (
            <Link href={entry.href} className="home-path-row" key={entry.href}>
              <span className="home-path-index">0{index + 2}</span>
              <span className="home-path-copy">
                <small>{entry.label}</small>
                <strong>{entry.title}</strong>
                <span>{entry.description}</span>
              </span>
              <span className="home-path-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
