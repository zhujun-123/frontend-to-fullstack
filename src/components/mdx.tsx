import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { AnalogyStory } from './analogy-story';
import { Mermaid } from './mermaid';
import { MappingExplorer } from './mapping-explorer';
import { LifecycleExplorer } from './lifecycle-explorer';
import { PlaybookExplorer } from './playbook-explorer';
import { SkillCatalog } from './skill-catalog';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    AnalogyStory,
    LifecycleExplorer,
    MappingExplorer,
    Mermaid,
    PlaybookExplorer,
    SkillCatalog,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
