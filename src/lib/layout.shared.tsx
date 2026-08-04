import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: [
      {
        text: '学习路线',
        url: '/docs/roadmap',
      },
      {
        text: '前端 → Go',
        url: '/docs/frontend-to-go',
      },
      {
        text: '资源库',
        url: '/docs/resources/github',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
