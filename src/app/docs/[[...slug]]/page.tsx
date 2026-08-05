import { getPageImageUrl, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

const typeLabels = {
  overview: '专题概览',
  roadmap: '学习路线',
  conceptual: '原理知识',
  mapping: '原理映射',
  guide: '实践指南',
  practice: '动手练习',
  playbook: '任务配方',
  resource: '资源整理',
} as const;

const sourceKindLabels = {
  official: '官方文档',
  specification: '标准 / 规范',
  project: '官方项目',
  practice: '实践资料',
} as const;

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} />
      </div>
      {(page.data.summary ||
        page.data.firstPrinciple ||
        page.data.frontendAnalogy ||
        page.data.prerequisites.length > 0 ||
        page.data.related.length > 0) && (
        <div className="knowledge-meta">
          <div className="knowledge-meta-row">
            <span className="knowledge-meta-label">内容类型</span>
            <span className="knowledge-meta-chip">{typeLabels[page.data.type]}</span>
          </div>
          {page.data.summary ? (
            <div className="knowledge-meta-row">
              <span className="knowledge-meta-label">核心结论</span>
              <span>{page.data.summary}</span>
            </div>
          ) : null}
          {page.data.firstPrinciple ? (
            <div className="knowledge-meta-row">
              <span className="knowledge-meta-label">第一性原理</span>
              <span>{page.data.firstPrinciple}</span>
            </div>
          ) : null}
          {page.data.frontendAnalogy ? (
            <div className="knowledge-meta-row">
              <span className="knowledge-meta-label">前端认知起点</span>
              <span>{page.data.frontendAnalogy}</span>
            </div>
          ) : null}
          {page.data.prerequisites.length > 0 ? (
            <div className="knowledge-meta-row">
              <span className="knowledge-meta-label">前置知识</span>
              <span className="knowledge-meta-values">
                {page.data.prerequisites.map((item) => (
                  <span className="knowledge-meta-chip" key={item}>
                    {item}
                  </span>
                ))}
              </span>
            </div>
          ) : null}
          {page.data.related.length > 0 ? (
            <div className="knowledge-meta-row">
              <span className="knowledge-meta-label">关联知识</span>
              <span className="knowledge-meta-values">
                {page.data.related.map((item) => (
                  <span className="knowledge-meta-chip" key={item}>
                    {item}
                  </span>
                ))}
              </span>
            </div>
          ) : null}
        </div>
      )}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        {page.data.sourceRefs.length > 0 ? (
          <section className="source-list">
            <h2>参考来源</h2>
            <ul>
              {page.data.sourceRefs.map((sourceRef) => (
                <li key={sourceRef.url}>
                  <div className="source-ref-row">
                    <a href={sourceRef.url} rel="noreferrer" target="_blank">
                      {sourceRef.title}
                    </a>
                    <span className="source-ref-meta">
                      {sourceRef.kind ? sourceKindLabels[sourceRef.kind] : null}
                      {sourceRef.publisher ? ` · ${sourceRef.publisher}` : null}
                      {sourceRef.license ? ` · ${sourceRef.license}` : null}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
