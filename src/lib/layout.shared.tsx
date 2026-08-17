import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName } from './shared';

const primaryLinks: NonNullable<BaseLayoutProps['links']> = [
  {
    text: '完整链路',
    url: '/docs/fullstack-lifecycle',
  },
  {
    text: '学习路线',
    url: '/docs/roadmap',
  },
  {
    text: '任务配方',
    url: '/docs/playbooks',
  },
  {
    text: 'Skills / 提示词',
    url: '/docs/skills',
  },
  {
    text: 'Agent 工程',
    url: '/docs/agent-engineering',
  },
  {
    text: '前端 → Go',
    url: '/docs/frontend-to-go',
  },
  {
    text: '资源库',
    url: '/docs/resources',
  },
];

export function baseOptions(options?: { includePrimaryLinks?: boolean }): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: options?.includePrimaryLinks === false ? undefined : primaryLinks,
  };
}
