import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const contentMaturities = ['outline', 'reviewed', 'verified'] as const;

export const knowledgePageSchema = pageSchema.extend({
  type: z
    .enum(['overview', 'roadmap', 'conceptual', 'mapping', 'guide', 'practice', 'playbook', 'resource'])
    .default('conceptual'),
  maturity: z.enum(contentMaturities).default('reviewed'),
  summary: z.string().optional(),
  firstPrinciple: z.string().optional(),
  frontendAnalogy: z.string().optional(),
  lastVerified: z.string().date().optional(),
  testedWith: z.array(z.string()).default([]),
  lab: z
    .object({
      path: z.string().min(1),
      commands: z.array(z.string().min(1)).min(1),
    })
    .optional(),
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
        version: z.string().optional(),
        note: z.string().optional(),
        verifiedAt: z.string().date().optional(),
      }),
    )
    .default([]),
});

export type ContentMaturity = (typeof contentMaturities)[number];
