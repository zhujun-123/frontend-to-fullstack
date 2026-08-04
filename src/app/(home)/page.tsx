import Link from 'next/link';

const entries = [
  {
    eyebrow: 'ROADMAP',
    title: '从一次接口修改开始',
    description: '不从语法目录出发，以独立交付为目标，按请求、数据、可靠性和部署逐层补齐。',
    href: '/docs/roadmap',
  },
  {
    eyebrow: 'MENTAL MODEL',
    title: '前端原理映射 Go 原理',
    description: '从 Event Loop、Promise、Interface 等熟悉概念，迁移到 Scheduler、Goroutine 和 Go Interface。',
    href: '/docs/frontend-to-go',
  },
  {
    eyebrow: 'OPEN SOURCE',
    title: '经过筛选的 GitHub 资源',
    description: '记录用途、维护状态和许可证边界，让资料成为来源，而不是未经核验的复制内容。',
    href: '/docs/resources/github',
  },
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="hero-section">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />

        <div className="hero-content">
          <p className="hero-kicker">FRONTEND → FULLSTACK</p>
          <h1>
            用已有的前端认知，
            <span>建立服务端思维。</span>
          </h1>
          <p className="hero-description">
            一个面向前端开发者的开放知识库。重点不是背完另一门语言，
            而是理解一次请求如何经过服务、数据、部署和生产环境，最终形成独立交付能力。
          </p>
          <div className="hero-actions">
            <Link href="/docs" className="primary-action">
              开始学习
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/docs/frontend-to-go" className="secondary-action">
              查看前端 → Go 映射
            </Link>
          </div>
        </div>

        <div className="hero-metrics" aria-label="项目规划数据">
          <div>
            <strong>9</strong>
            <span>知识领域</span>
          </div>
          <div>
            <strong>30</strong>
            <span>首批原理映射</span>
          </div>
          <div>
            <strong>120</strong>
            <span>规划知识点</span>
          </div>
        </div>
      </section>

      <section className="entry-section">
        <div className="entry-heading">
          <p>KNOWLEDGE PATHS</p>
          <h2>从熟悉的地方出发</h2>
        </div>
        <div className="entry-grid">
          {entries.map((entry, index) => (
            <Link href={entry.href} className="entry-card" key={entry.href}>
              <div className="entry-number">0{index + 1}</div>
              <p className="entry-eyebrow">{entry.eyebrow}</p>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <span className="entry-link">进入专题 →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
