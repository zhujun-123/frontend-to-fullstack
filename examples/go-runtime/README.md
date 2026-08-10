# Go Runtime Labs

这里的程序只用于本地学习和验证文档中的趋势，不是生产服务模板。模块声明 `go 1.26`，并通过 `toolchain go1.26.5` 固定实际验证版本。

## 全量校验

```bash
go version
go vet ./...
go test ./...
go test -race ./...
go test -bench=. -benchmem ./...
```

Benchmark 用来比较同一台机器、同一版本下的趋势，不设置跨机器固定阈值。

## 单专题 Trace

```bash
go test -run TestRunCPUWorkCompletesAllTasks -trace scheduler.trace ./labs/scheduler
go tool trace scheduler.trace
```

Trace 中应能看到多个 Goroutine 进入可运行和执行状态。具体调度顺序不稳定，不应写成测试断言。

## 可观测实验服务

```bash
go run ./cmd/labserver
```

服务默认只监听 `127.0.0.1:8080`，参数都有限制：

- `GET /healthz`
- `GET /work/cpu?tasks=8&iterations=100000`
- `GET /work/pipeline?count=8&buffer=2`
- `GET /work/allocate?count=64&size=1024`
- `GET /work/io?delay_ms=100`
- `GET /debug/vars`
- `GET /debug/pprof/`

示例：

```bash
curl 'http://127.0.0.1:8080/work/cpu?tasks=8&iterations=100000'
go tool pprof 'http://127.0.0.1:8080/debug/pprof/profile?seconds=10'
curl http://127.0.0.1:8080/debug/vars
```

故意泄漏、永久阻塞和数据竞争只应放在隔离测试或临时实验中，不应加入默认服务入口。
