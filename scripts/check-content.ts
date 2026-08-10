import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { knowledgePageSchema, type ContentMaturity } from '../src/lib/content-schema';
import { frontendGoMappings } from '../src/data/frontend-go-mappings';

const root = process.cwd();
const docsRoot = path.join(root, 'content/docs');
const frontendGoRoot = path.join(docsRoot, 'frontend-to-go');
const today = new Date();
const maxVerificationAgeDays = 180;

const requiredVerifiedSections = [
  '先说人话',
  '问题与系统不变量',
  '前端认知起点',
  '最小心智模型',
  'Go 1.26.5 当前实现',
  '类比成立范围',
  '类比失效边界',
  '可运行实验',
  '真实生产故障场景',
  '证据与排查',
  '常见错误与版本变化',
  '完成检查表',
] as const;

type ParsedDocument = {
  absolutePath: string;
  relativePath: string;
  route: string;
  body: string;
  frontmatter: Record<string, unknown>;
  maturity: ContentMaturity;
};

const errors: string[] = [];
const warnings: string[] = [];

function walkMdx(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkMdx(target);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [target] : [];
  });
}

function routeForFile(file: string): string {
  const relative = path.relative(docsRoot, file).replaceAll(path.sep, '/').replace(/\.mdx$/, '');
  return `/docs/${relative.replace(/\/index$/, '')}`;
}

function resolveInternalRoute(route: string): string | undefined {
  const normalized = route.split('#')[0].split('?')[0].replace(/^\/docs\/?/, '').replace(/\/$/, '');
  const candidates = [path.join(docsRoot, `${normalized}.mdx`), path.join(docsRoot, normalized, 'index.mdx')];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function sectionExists(body: string, title: string): boolean {
  return body.split('\n').some((line) => line.trim() === `## ${title}`);
}

function isOfficialSource(source: Record<string, unknown>): boolean {
  return ['official', 'specification', 'project'].includes(String(source.kind));
}

const documents: ParsedDocument[] = walkMdx(docsRoot).map((absolutePath) => {
  const raw = fs.readFileSync(absolutePath, 'utf8');
  const parsedMatter = matter(raw);
  const relativePath = path.relative(root, absolutePath).replaceAll(path.sep, '/');
  const parsedSchema = knowledgePageSchema.safeParse(parsedMatter.data);

  if (!parsedSchema.success) {
    for (const issue of parsedSchema.error.issues) {
      errors.push(`${relativePath}: frontmatter.${issue.path.join('.')} ${issue.message}`);
    }
  }

  const maturity = (parsedSchema.success ? parsedSchema.data.maturity : parsedMatter.data.maturity) as ContentMaturity;
  return {
    absolutePath,
    relativePath,
    route: routeForFile(absolutePath),
    body: parsedMatter.content,
    frontmatter: parsedMatter.data,
    maturity,
  };
});

const documentByRoute = new Map(documents.map((document) => [document.route, document]));

for (const document of documents) {
  const internalLinks = document.body.matchAll(/\]\((\/docs\/[^)\s#]+)(?:#[^)]+)?\)/g);
  for (const match of internalLinks) {
    if (!resolveInternalRoute(match[1])) {
      errors.push(`${document.relativePath}: 内部链接不存在 ${match[1]}`);
    }
  }

  const isFrontendGoMapping = document.absolutePath.startsWith(frontendGoRoot) && document.frontmatter.type === 'mapping';
  if (isFrontendGoMapping && !Object.hasOwn(document.frontmatter, 'maturity')) {
    errors.push(`${document.relativePath}: 原理映射必须显式声明 maturity`);
  }

  if (document.maturity !== 'verified') continue;

  const lastVerified = document.frontmatter.lastVerified;
  const testedWith = document.frontmatter.testedWith;
  const lab = document.frontmatter.lab as { path?: unknown; commands?: unknown } | undefined;
  const sourceRefs = document.frontmatter.sourceRefs;

  if (typeof lastVerified !== 'string') errors.push(`${document.relativePath}: verified 缺少 lastVerified`);
  if (!Array.isArray(testedWith) || testedWith.length === 0) errors.push(`${document.relativePath}: verified 缺少 testedWith`);
  if (!lab || typeof lab.path !== 'string' || !Array.isArray(lab.commands) || lab.commands.length === 0) {
    errors.push(`${document.relativePath}: verified 缺少可运行 lab.path 或 lab.commands`);
  } else {
    const labPath = path.resolve(root, lab.path);
    if (!fs.existsSync(labPath)) errors.push(`${document.relativePath}: Lab 路径不存在 ${lab.path}`);
    if (!lab.commands.some((command) => typeof command === 'string' && command.includes('go test'))) {
      errors.push(`${document.relativePath}: Lab 命令至少需要一个 go test 入口`);
    }
  }

  if (!Array.isArray(sourceRefs) || !sourceRefs.some((source) => isOfficialSource(source))) {
    errors.push(`${document.relativePath}: verified 至少需要一个官方文档、规范或官方项目来源`);
  } else {
    sourceRefs.forEach((source, index) => {
      if (!source.version || !source.note || !source.verifiedAt) {
        errors.push(`${document.relativePath}: sourceRefs[${index}] 必须包含 version、note、verifiedAt`);
      }
    });
  }

  for (const section of requiredVerifiedSections) {
    if (!sectionExists(document.body, section)) {
      errors.push(`${document.relativePath}: verified 缺少章节“${section}”`);
    }
  }

  if (!document.body.includes('<AnalogyStory')) {
    errors.push(`${document.relativePath}: verified 缺少 AnalogyStory 生动比喻`);
  }

  if (typeof lastVerified === 'string') {
    const verifiedDate = new Date(`${lastVerified}T00:00:00Z`);
    const ageDays = Math.floor((today.getTime() - verifiedDate.getTime()) / 86_400_000);
    if (ageDays > maxVerificationAgeDays) {
      warnings.push(`${document.relativePath}: 已超过 ${maxVerificationAgeDays} 天未核验（${lastVerified}）`);
    }
  }
}

for (const mapping of frontendGoMappings) {
  if (!mapping.maturity) errors.push(`映射 ${mapping.id}: 缺少 maturity`);
  if (!mapping.href) continue;

  const target = documentByRoute.get(mapping.href);
  if (!target) {
    errors.push(`映射 ${mapping.id}: 目标文章不存在 ${mapping.href}`);
    continue;
  }
  if (target.maturity !== mapping.maturity) {
    errors.push(`映射 ${mapping.id}: 卡片为 ${mapping.maturity}，目标文章为 ${target.maturity}`);
  }
}

const frontendGoDocuments = documents.filter((document) => document.absolutePath.startsWith(frontendGoRoot));
const maturityCounts = frontendGoDocuments.reduce<Record<ContentMaturity, number>>(
  (counts, document) => {
    if (document.frontmatter.type === 'mapping') counts[document.maturity] += 1;
    return counts;
  },
  { outline: 0, reviewed: 0, verified: 0 },
);

if (frontendGoMappings.length !== 43) errors.push(`概念映射应为 43 条，实际为 ${frontendGoMappings.length} 条`);
if (maturityCounts.verified !== 10) errors.push(`已验证专题应为 10 篇，实际为 ${maturityCounts.verified} 篇`);
if (maturityCounts.reviewed !== 6) errors.push(`已校对专题应为 6 篇，实际为 ${maturityCounts.reviewed} 篇`);

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR ${error}`);
  console.error(`\n内容校验失败：${errors.length} 个错误，${warnings.length} 个警告。`);
  process.exit(1);
}

console.log(
  `内容校验通过：${maturityCounts.verified} 篇已验证、${maturityCounts.reviewed} 篇已校对、${frontendGoMappings.length} 条概念映射，${warnings.length} 个警告。`,
);
