'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  evidenceTypes,
  fullstackPlaybooks,
  playbookStages,
  type EvidenceType,
  type PlaybookStage,
} from '@/data/fullstack-playbooks';

type StageFilter = '全部阶段' | PlaybookStage;
type EvidenceFilter = '全部材料' | EvidenceType;

export function PlaybookExplorer() {
  const [stage, setStage] = useState<StageFilter>('全部阶段');
  const [evidence, setEvidence] = useState<EvidenceFilter>('全部材料');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(fullstackPlaybooks[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPlaybooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');

    return fullstackPlaybooks.filter((playbook) => {
      if (stage !== '全部阶段' && playbook.stage !== stage) return false;
      if (evidence !== '全部材料' && !playbook.evidenceTypes.includes(evidence)) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        playbook.title,
        playbook.summary,
        playbook.when,
        ...playbook.tools,
        ...playbook.materials,
      ]
        .join(' ')
        .toLocaleLowerCase('zh-CN');

      return searchable.includes(normalizedQuery);
    });
  }, [evidence, query, stage]);

  const activePlaybook =
    filteredPlaybooks.find((playbook) => playbook.id === activeId) ?? filteredPlaybooks[0];

  async function copyPrompt(id: string, prompt: string) {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1800);
  }

  return (
    <section className="playbook-explorer">
      <div className="playbook-toolbar">
        <label className="playbook-search">
          <span>按问题、工具或材料查找</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：500、Jenkins、幂等、慢 SQL"
            type="search"
            value={query}
          />
        </label>

        <div className="playbook-filter-row" aria-label="按工作阶段筛选">
          {(['全部阶段', ...playbookStages] as StageFilter[]).map((item) => (
            <button
              aria-pressed={stage === item}
              className={stage === item ? 'is-active' : ''}
              key={item}
              onClick={() => setStage(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="playbook-filter-row playbook-evidence-filters" aria-label="按输入材料筛选">
          {(['全部材料', ...evidenceTypes] as EvidenceFilter[]).map((item) => (
            <button
              aria-pressed={evidence === item}
              className={evidence === item ? 'is-active' : ''}
              key={item}
              onClick={() => setEvidence(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="playbook-result-summary">
        找到 <strong>{filteredPlaybooks.length}</strong> 条任务配方。选择最接近当前工作的场景，再替换提示词中的占位符。
      </p>

      {activePlaybook ? (
        <div className="playbook-workbench">
          <nav className="playbook-list" aria-label="任务配方列表">
            {filteredPlaybooks.map((playbook) => (
              <button
                aria-pressed={playbook.id === activePlaybook.id}
                className={playbook.id === activePlaybook.id ? 'is-active' : ''}
                key={playbook.id}
                onClick={() => setActiveId(playbook.id)}
                type="button"
              >
                <span className="playbook-list-order">{playbook.order}</span>
                <span className="playbook-list-copy">
                  <small>{playbook.stage}</small>
                  <strong>{playbook.title}</strong>
                  <span>{playbook.summary}</span>
                </span>
              </button>
            ))}
          </nav>

          <article className="playbook-detail">
            <header className="playbook-detail-header">
              <div>
                <p>{activePlaybook.stage} · {activePlaybook.order}</p>
                <h3>{activePlaybook.title}</h3>
                <span>{activePlaybook.summary}</span>
              </div>
              <button
                className="playbook-copy-button"
                onClick={() => copyPrompt(activePlaybook.id, activePlaybook.prompt)}
                type="button"
              >
                {copiedId === activePlaybook.id ? '已复制' : '复制提示词'}
              </button>
            </header>

            <section className="playbook-when">
              <h4>什么时候使用</h4>
              <p>{activePlaybook.when}</p>
            </section>

            <section className="playbook-materials">
              <h4>先准备真实材料</h4>
              <ul>
                {activePlaybook.materials.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </section>

            <section className="playbook-prompt">
              <div className="playbook-section-heading">
                <h4>可直接复制的提示词</h4>
                <span>替换 &lt;占位符&gt;，Secret 和用户隐私先脱敏</span>
              </div>
              <pre>{activePlaybook.prompt}</pre>
            </section>

            <div className="playbook-two-column">
              <section>
                <h4>AI 必须输出</h4>
                <ol>
                  {activePlaybook.outputFormat.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </section>
              <section>
                <h4>完成标准</h4>
                <ul>
                  {activePlaybook.doneCriteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="playbook-pitfalls">
              <h4>常见误区</h4>
              <ul>
                {activePlaybook.pitfalls.map((pitfall) => (
                  <li key={pitfall}>{pitfall}</li>
                ))}
              </ul>
            </section>

            <footer className="playbook-detail-footer">
              <div>
                <span>关联知识</span>
                {activePlaybook.related.map((item) => (
                  <Link href={item.href} key={item.href}>
                    {item.title}
                  </Link>
                ))}
              </div>
              <div>
                <span>事实来源</span>
                {activePlaybook.sources.map((source) => (
                  <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
                    {source.title}
                  </a>
                ))}
              </div>
              <div className="playbook-tool-list">
                <span>常见工具</span>
                <p>{activePlaybook.tools.join(' / ')}</p>
              </div>
            </footer>
          </article>
        </div>
      ) : (
        <div className="playbook-empty">
          <strong>没有匹配的任务配方</strong>
          <p>清空搜索词，或换一种材料类型再试。</p>
        </div>
      )}
    </section>
  );
}
