'use client';

import Link from 'next/link';
import { useState } from 'react';
import { fullstackLifecycleStages } from '@/data/fullstack-lifecycle';

export function LifecycleExplorer() {
  const [activeId, setActiveId] = useState(fullstackLifecycleStages[0].id);
  const activeStage =
    fullstackLifecycleStages.find((stage) => stage.id === activeId) ?? fullstackLifecycleStages[0];

  return (
    <section className="lifecycle-explorer">
      <div className="lifecycle-track" aria-label="全栈交付生命周期">
        {fullstackLifecycleStages.map((stage) => (
          <button
            aria-pressed={stage.id === activeStage.id}
            className={stage.id === activeStage.id ? 'is-active' : ''}
            key={stage.id}
            onClick={() => setActiveId(stage.id)}
            type="button"
          >
            <span>{stage.order}</span>
            <strong>{stage.title}</strong>
          </button>
        ))}
      </div>

      <article className="lifecycle-detail">
        <div className="lifecycle-detail-heading">
          <span>第 {activeStage.order} 阶段</span>
          <h3>{activeStage.title}</h3>
          <p>{activeStage.question}</p>
        </div>

        <div className="lifecycle-comparison">
          <div>
            <span>前端认知起点</span>
            <p>{activeStage.frontend}</p>
          </div>
          <div>
            <span>第一性原理</span>
            <p>{activeStage.principle}</p>
          </div>
        </div>

        <div className="lifecycle-responsibilities">
          <span>需要承担的工程责任</span>
          <ul>
            {activeStage.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="lifecycle-evidence">
          <span>完成证据</span>
          <p>{activeStage.evidence}</p>
        </div>

        <div className="lifecycle-footer">
          <div className="lifecycle-tools">
            {activeStage.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
          <Link href={activeStage.href}>进入专题 →</Link>
        </div>
      </article>
    </section>
  );
}
