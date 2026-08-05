'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  frontendGoMappings,
  mappingCategories,
  mappingRelations,
  type MappingCategory,
  type MappingRelation,
} from '@/data/frontend-go-mappings';

const storageKey = 'frontend-to-fullstack:learned-mappings:v1';

export function MappingExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | MappingCategory>('all');
  const [relation, setRelation] = useState<'all' | MappingRelation>('all');
  const [learned, setLearned] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
            setLearned(parsed);
          } else {
            window.localStorage.removeItem(storageKey);
          }
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filteredMappings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return frontendGoMappings.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesRelation = relation === 'all' || item.relation === relation;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.frontend, item.go, item.shared, item.boundary]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesRelation && matchesQuery;
    });
  }, [category, query, relation]);

  const learnedSet = useMemo(() => new Set(learned), [learned]);
  const learnedCount = learned.filter((id) => frontendGoMappings.some((item) => item.id === id)).length;
  const progress = Math.round((learnedCount / frontendGoMappings.length) * 100);

  function toggleLearned(id: string) {
    setLearned((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // The in-memory progress still works when browser storage is unavailable.
      }
      return next;
    });
  }

  return (
    <section className="mapping-explorer">
      <div className="mapping-progress">
        <div>
          <span className="mapping-overline">学习进度</span>
          <strong>{ready ? `${learnedCount} / ${frontendGoMappings.length}` : '—'}</strong>
          <p>已理解并确认边界的映射</p>
        </div>
        <div className="mapping-progress-track" aria-label={`学习进度 ${progress}%`}>
          <span style={{ width: `${ready ? progress : 0}%` }} />
        </div>
      </div>

      <div className="mapping-toolbar">
        <label className="mapping-search">
          <span>搜索映射</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="试试 Promise、Context、缓存…"
            type="search"
            value={query}
          />
        </label>

        <div className="mapping-filter-group" aria-label="按知识分类筛选">
          <button className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')} type="button">
            全部
          </button>
          {(Object.entries(mappingCategories) as [MappingCategory, string][]).map(([key, label]) => (
            <button
              className={category === key ? 'is-active' : ''}
              key={key}
              onClick={() => setCategory(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mapping-filter-group mapping-relation-filter" aria-label="按类比关系筛选">
          <button className={relation === 'all' ? 'is-active' : ''} onClick={() => setRelation('all')} type="button">
            所有关系
          </button>
          {(Object.entries(mappingRelations) as [MappingRelation, string][]).map(([key, label]) => (
            <button
              className={relation === key ? `is-active relation-${key}` : ''}
              key={key}
              onClick={() => setRelation(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mapping-result-summary">
        找到 <strong>{filteredMappings.length}</strong> 条映射
      </div>

      <div className="mapping-grid">
        {filteredMappings.map((item) => {
          const isLearned = learnedSet.has(item.id);

          return (
            <article className={`mapping-card ${isLearned ? 'is-learned' : ''}`} key={item.id}>
              <div className="mapping-card-meta">
                <span>{mappingCategories[item.category]}</span>
                <span className={`mapping-relation relation-${item.relation}`}>
                  {mappingRelations[item.relation]}
                </span>
              </div>

              <div className="mapping-concepts">
                <div>
                  <span>前端认知</span>
                  <strong>{item.frontend}</strong>
                </div>
                <span className="mapping-arrow" aria-hidden="true">
                  →
                </span>
                <div>
                  <span>Go 对应</span>
                  <strong>{item.go}</strong>
                </div>
              </div>

              <div className="mapping-explanation">
                <p>{item.shared}</p>
                <p className="mapping-boundary">
                  <span>边界</span>
                  {item.boundary}
                </p>
              </div>

              <div className="mapping-card-actions">
                <button
                  aria-pressed={isLearned}
                  className={isLearned ? 'is-complete' : ''}
                  onClick={() => toggleLearned(item.id)}
                  type="button"
                >
                  {isLearned ? '✓ 已理解' : '标记为已理解'}
                </button>
                {item.href ? <Link href={item.href}>阅读详解 →</Link> : <span>详解待补充</span>}
              </div>
            </article>
          );
        })}
      </div>

      {filteredMappings.length === 0 ? (
        <div className="mapping-empty">
          <strong>没有找到匹配内容</strong>
          <p>尝试清空搜索词或者切换分类。</p>
        </div>
      ) : null}
    </section>
  );
}
