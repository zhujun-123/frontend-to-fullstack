'use client';

import { useMemo, useState } from 'react';
import {
  agentSkillSources,
  skillCategories,
  skillPrompts,
  skillSnapshotDate,
  type SkillCategory,
} from '@/data/agent-skills';

type CategoryFilter = '全部' | SkillCategory;

function formatStars(stars: number) {
  if (stars >= 100000) return `${(stars / 1000).toFixed(0)}k`;
  if (stars >= 10000) return `${(stars / 1000).toFixed(1)}k`;
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return String(stars);
}

export function SkillCatalog() {
  const [category, setCategory] = useState<CategoryFilter>('全部');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');

    return agentSkillSources.filter((source) => {
      if (category !== '全部' && source.category !== category) return false;
      if (!normalizedQuery) return true;

      return [
        source.name,
        source.repo,
        source.publisher,
        source.summary,
        ...source.usefulFor,
        ...source.recommendedSkills,
      ]
        .join(' ')
        .toLocaleLowerCase('zh-CN')
        .includes(normalizedQuery);
    });
  }, [category, query]);

  const filteredPrompts = skillPrompts.filter(
    (prompt) => category === '全部' || prompt.category === category,
  );

  async function copyText(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 1800);
  }

  return (
    <section className="skill-catalog">
      <div className="skill-toolbar">
        <label className="skill-search">
          <span>查找产品、场景或 Skill</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：Firestore、Go、日志、发布、安全"
            type="search"
            value={query}
          />
        </label>
        <div className="skill-filter-row" aria-label="按 Skill 类型筛选">
          {(['全部', ...skillCategories] as CategoryFilter[]).map((item) => (
            <button
              aria-pressed={category === item}
              className={category === item ? 'is-active' : ''}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="skill-catalog-heading">
        <p>
          收录 <strong>{agentSkillSources.length}</strong> 个来源，当前筛选显示{' '}
          <strong>{filteredSources.length}</strong> 个。
        </p>
        <span>Star 快照：{skillSnapshotDate} · 只用于判断关注度，不代表质量</span>
      </div>

      <div className="skill-source-grid">
        {filteredSources.map((source) => (
          <article className="skill-source-card" key={source.id}>
            <header>
              <div>
                <span>{source.category} · {source.provenance}</span>
                <h3>{source.name}</h3>
                <p>{source.repo}</p>
              </div>
              <div className="skill-source-stats">
                <strong>★ {formatStars(source.stars)}</strong>
                <span>{source.license}</span>
              </div>
            </header>

            <p className="skill-source-summary">{source.summary}</p>

            <div className="skill-source-section">
              <h4>适合解决</h4>
              <ul>
                {source.usefulFor.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div className="skill-source-section">
              <h4>优先看这些 Skill</h4>
              <div className="skill-tags">
                {source.recommendedSkills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>

            {source.installCommand ? (
              <div className="skill-install-row">
                <code>{source.installCommand}</code>
                <button onClick={() => copyText(`install-${source.id}`, source.installCommand!)} type="button">
                  {copied === `install-${source.id}` ? '已复制' : '复制'}
                </button>
              </div>
            ) : null}

            <p className="skill-caution"><strong>边界：</strong>{source.caution}</p>

            <footer>
              <span>{source.publisher}</span>
              <a href={source.url} rel="noreferrer" target="_blank">查看源仓库 ↗</a>
            </footer>
          </article>
        ))}
      </div>

      {filteredSources.length === 0 ? (
        <div className="skill-empty">
          <strong>没有匹配的 Skill 来源</strong>
          <p>清空搜索词，或切换分类后再试。</p>
        </div>
      ) : null}

      <section className="skill-prompt-library">
        <div className="skill-prompt-intro">
          <p>真实提示词</p>
          <h2>不要只说“使用这个 Skill”</h2>
          <span>把目标、证据、权限边界、输出结构和完成标准一起交给 Agent。</span>
        </div>

        <div className="skill-prompt-list">
          {filteredPrompts.map((prompt, index) => (
            <details className="skill-prompt-card" key={prompt.id} open={index === 0 && category === '全部'}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <small>{prompt.category}</small>
                  <strong>{prompt.title}</strong>
                  <p>{prompt.summary}</p>
                </div>
                <i aria-hidden="true">＋</i>
              </summary>
              <div className="skill-prompt-body">
                <div className="skill-prompt-skills">
                  <span>调用</span>
                  {prompt.skills.map((skill) => <code key={skill}>{skill}</code>)}
                </div>
                <div className="skill-prompt-copy-row">
                  <span>复制后替换 &lt;占位符&gt;；敏感信息先脱敏</span>
                  <button onClick={() => copyText(`prompt-${prompt.id}`, prompt.prompt)} type="button">
                    {copied === `prompt-${prompt.id}` ? '已复制' : '复制提示词'}
                  </button>
                </div>
                <pre>{prompt.prompt}</pre>
                <div className="skill-done-criteria">
                  <h4>完成证据</h4>
                  <ul>
                    {prompt.doneCriteria.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
