import type { FullstackPlaybook } from '@/data/fullstack-playbooks';

function tableCell(value: string) {
  return value.replaceAll('|', '\\|').replaceAll('\n', '<br>');
}

/** Generate a blank evidence record, never a claim that checks have passed. */
export function buildAcceptanceTemplate(playbook: FullstackPlaybook): string {
  const rows = playbook.doneCriteria.map((criterion, index) =>
    `| ${index + 1} | ${tableCell(criterion)} | 待填写 | 待填写 | 待填写 | 待填写 | 未验证 |`,
  );

  return [
    `# ${playbook.title} · 验收记录`,
    '',
    '- 提交 / 制品版本：待填写',
    '- 环境 / 工具版本：待填写',
    '- 验证时间 / 验证人：待填写',
    '- 本次需求与范围：待填写',
    '- 业务后果与阻断条件：待填写',
    '',
    '## 逐项证据',
    '',
    '| 编号 | 验收要求 | 实现位置 | 操作 / 命令 | 预期结果 | 实际结果 / 证据 | 验证状态 |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
    '验证状态只使用：未验证 / 通过 / 失败 / 不适用（附理由）。实现完成不等于验证通过；代码变更后重新确认相关证据。',
    '',
    '## 异常与恢复（按任务选择，不能适用时写明理由）',
    '',
    '- 输入：空值、非法值、边界长度；预期与证据：待填写',
    '- 网络：超时、断网、请求乱序；预期与证据：待填写',
    '- 权限：未登录、过期、跨用户访问；预期与证据：待填写',
    '- 并发：重复提交、部分成功、重试；预期与证据：待填写',
    '- 恢复：状态查询、取消、回滚；预期与证据：待填写',
    '',
    '## 尚缺证据与结论',
    '',
    '- 未验证项及影响：待填写',
    '- 停止 / 回滚条件与目标：待填写',
    '- 结论：待验收（禁止把空模板当作通过记录）',
    '',
    '证据请脱敏；日志、截图和测试输出必须对应上面的版本与环境。',
    '方法说明：/docs/ai-acceptance',
  ].join('\n');
}
