import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const knowledgePageSchema = pageSchema.extend({
  type: z
    .enum(['overview', 'roadmap', 'conceptual', 'mapping', 'guide', 'practice', 'playbook', 'resource'])
    .default('conceptual'),
  summary: z.string().optional(),
  firstPrinciple: z.string().optional(),
  frontendAnalogy: z.string().optional(),
  prerequisites: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  sourceRefs: z
    .array(
      z.object({
        title: z.string(),
        url: z.url(),
        kind: z.enum(['official', 'specification', 'project', 'practice']).optional(),
        publisher: z.string().optional(),
        license: z.string().optional(),
      }),
    )
    .default([]),
});

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: knowledgePageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
