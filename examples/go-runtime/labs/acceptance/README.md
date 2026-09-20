# 全栈验收实验

在仓库根目录运行 `pnpm labs:acceptance`，打开 <http://127.0.0.1:8091>。
也可在 `examples/go-runtime` 下执行 `go run ./cmd/acceptancelab -port 8091`。
Ctrl+C 停止。只监听 `127.0.0.1`，重启会清空订单与取消计数。

这是包含故意缺陷的本地教学服务。不要开放端口或部署，勿放入真实身份与数据。

| 场景 | 错误模式的预期观察 | 修复模式的预期观察 |
| --- | --- | --- |
| 搜索竞态 | 旧关键词最后覆盖新结果 | 最新查询保持显示，旧任务取消 |
| 响应丢失后重试 | 同一键产生两条记录 | 同一用户的同键操作仅一条，重试返回首次结果 |
| 资源授权 | Alice 可以读 Bob 的演示笔记 | Alice 403、Bob 200、无身份 401，拒绝响应不含正文 |

`invariantPassed: false` 是错误模式应当出现的证据，不是运行失败。页面若显示“实验执行失败”，则不能据此得出不变量结论。

## 验证命令

仓库根目录：

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
pnpm labs:vet
pnpm labs:test
pnpm labs:race
```

浏览器测试自动启动 3210 和 8091 服务；先关闭手动运行的同端口服务。测试结束会清理自启服务，不复用未知旧进程。

Go 单专题测试：`cd examples/go-runtime && go test -race ./labs/acceptance -v`。

## 代码地图与证据

- `web/app.js`：真实 Fetch、取消、最新请求序号、订单重试、三种身份调用。
- `server.go`：可取消查询、原子去重及保存结果、资源所有者检查。
- `server_test.go`：真实 HTTP 请求、并发写入、冲突、身份隔离、客户端取消与服务端信号。
- `tests/e2e/acceptance.spec.ts`（仓库根目录）：浏览器错误 / 修复对照；另有显式忽略取消的实验隔离序号保护效果。
- `tests/e2e/playbooks.spec.ts`：12 条验收模板、剪贴板拒绝与三篇课程入口。

错误模式的测试断言缺陷仍可复现，修复模式断言不变量成立。删掉修复保护，应当使修复模式测试失败；不要反过来修改预期掩盖问题。

## 范围与不足

- 身份通过可伪造的 `X-Demo-User` 提供，不是认证。合法值为 alice、bob。
- 内存 Map + Mutex 仅演示单进程原子性，没有数据库唯一约束、持久化、过期策略或跨实例保证。
- 响应丢失实验先用 GET 确认写入，再取消等待，避免靠时间猜测提交。延迟响应期间客户端取消不会删除已写入记录。
- 取消计数是进程累计量。特定请求的传播由隔离的 Go 测试验证。
- Chromium 测试不代表 Safari、真机、代理或真实数据库路径已验证。

每次验收记录提交 SHA、Go / 浏览器版本、命令、输出与未验证部分。只在证据对应的范围内宣布通过。
