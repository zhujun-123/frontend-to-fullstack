import { expect, test } from '@playwright/test';

const labURL = 'http://127.0.0.1:8091';

test('search: reproduce stale results and verify cancellation', async ({ page }) => {
  await page.goto(labURL);
  await page.getByRole('button', { name: '复现搜索错误' }).click();
  await expect(page.locator('#search-evidence')).toContainText('"invariantPassed": false');
  await expect(page.locator('#search-result')).toHaveText('旧关键词');
  await page.getByRole('button', { name: '验证搜索修复' }).click();
  await expect(page.locator('#search-evidence')).toContainText('"invariantPassed": true');
  await expect(page.locator('#search-evidence')).toContainText('取消：旧关键词');
  await expect(page.locator('#search-result')).toHaveText('新关键词');
});

test('search: sequence guard survives work that ignores abort', async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      if (String(input).startsWith('/api/search')) {
        return originalFetch(input, { ...init, signal: undefined });
      }
      return originalFetch(input, init);
    };
  });
  await page.goto(labURL);
  await page.getByRole('button', { name: '验证搜索修复' }).click();
  await expect(page.locator('#search-evidence')).toContainText('"invariantPassed": true');
  await expect(page.locator('#search-result')).toHaveText('新关键词');
  await expect(page.locator('#search-evidence')).not.toContainText('取消：');
});

test('orders: lost response creates duplicates only in broken mode', async ({ page }) => {
  await page.goto(labURL);
  await page.getByRole('button', { name: '复现重复创建' }).click();
  await expect(page.locator('#orders-evidence')).toContainText('"invariantPassed": false');
  await expect(page.locator('#orders-evidence')).toContainText('"count": 2');
  await page.getByRole('button', { name: '验证幂等修复' }).click();
  await expect(page.locator('#orders-evidence')).toContainText('"invariantPassed": true');
  await expect(page.locator('#orders-evidence')).toContainText('"count": 1');
  await expect(page.locator('#orders-evidence')).toContainText('客户端停止等待');
});

test('auth: deny cross-user data while preserving legitimate access', async ({ page }) => {
  await page.goto(labURL);
  await page.getByRole('button', { name: '复现资源越权' }).click();
  await expect(page.locator('#auth-evidence')).toContainText('"invariantPassed": false');
  await expect(page.locator('#auth-evidence')).toContainText('Bob 的演示笔记');
  await page.getByRole('button', { name: '验证权限修复' }).click();
  await expect(page.locator('#auth-evidence')).toContainText('"invariantPassed": true');
  const evidence = JSON.parse((await page.locator('#auth-evidence').textContent())!);
  expect(evidence).toMatchObject({ aliceStatus: 403, bobStatus: 200, anonymousStatus: 401 });
  expect(evidence.aliceBody).not.toContain('Bob 的演示笔记');
});

test('lab: failure is visible and controls recover', async ({ page }) => {
  await page.goto(labURL);
  await page.route('**/api/search?**', (route) => route.abort('failed'));
  await page.getByRole('button', { name: '验证搜索修复' }).click();
  await expect(page.locator('#search-evidence')).toContainText('实验执行失败');
  await expect(page.getByRole('button', { name: '验证搜索修复' })).toBeEnabled();
});
