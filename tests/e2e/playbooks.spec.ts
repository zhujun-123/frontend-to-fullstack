import { expect, test } from '@playwright/test';

test('each playbook exports its own unverified acceptance criteria', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/playbooks');
  const choices = page.getByRole('navigation', { name: '任务配方列表' }).getByRole('button');
  expect(await choices.count()).toBe(12);
  for (let index = 0; index < 12; index++) {
    await choices.nth(index).click();
    const title = await page.locator('.playbook-detail-header h3').textContent();
    const criteria = await page.getByRole('heading', { name: '完成标准', exact: true }).locator('..').locator('li').allTextContents();
    await page.getByRole('button', { name: '复制验收模板', exact: true }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(`# ${title} · 验收记录`);
    for (const criterion of criteria) expect(copied).toContain(criterion);
    expect(copied.match(/\| 未验证 \|/g)).toHaveLength(criteria.length);
    expect(copied).toContain('提交 / 制品版本：待填写');
  }
  await page.getByRole('searchbox', { name: '按问题、工具或材料查找' }).fill('不存在的任务xyz');
  await expect(page.getByRole('button', { name: '复制验收模板' })).toHaveCount(0);
});

test('clipboard rejection offers manual access to the actual template', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      value: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')),
    });
  });
  await page.goto('/docs/playbooks');
  await page.getByRole('button', { name: '复制验收模板', exact: true }).click();
  await expect(page.locator('.playbook-detail').getByRole('alert')).toContainText('复制失败');
  await page.getByText('预览验收模板 / 手动复制', { exact: true }).click();
  await expect(page.getByRole('region', { name: '验收证据模板' }).locator('pre')).toBeVisible();
  await expect(page.getByRole('region', { name: '验收证据模板' }).locator('pre')).toContainText('接手一个陌生 Go 服务 · 验收记录');
});

test('acceptance guide connects all three rendered tutorials', async ({ page }) => {
  await page.goto('/docs/ai-acceptance');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI 辅助全栈开发验收指南');
  for (const slug of ['search-race', 'idempotent-retry', 'resource-authorization']) {
    const href = `/docs/ai-acceptance/${slug}`;
    await page.locator(`a[href="${href}"]`).first().click();
    await expect(page.getByRole('heading', { name: /^完成检查表/ })).toBeVisible();
    await expect(page.locator('.knowledge-lab')).toContainText('pnpm test:e2e');
    await page.goto('/docs/ai-acceptance');
  }
});
