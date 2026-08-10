package scheduler

import (
	"context"
	"sync"
	"sync/atomic"
)

// RunCPUWork executes bounded CPU work in multiple goroutines and returns the
// number of loop iterations that actually completed.
func RunCPUWork(tasks, iterations int) uint64 {
	return RunCPUWorkContext(context.Background(), tasks, iterations)
}

// RunCPUWorkContext is the cancellable form used by the local lab server.
func RunCPUWorkContext(ctx context.Context, tasks, iterations int) uint64 {
	if tasks < 1 {
		tasks = 1
	}
	if tasks > 64 {
		tasks = 64
	}
	if iterations < 1 {
		iterations = 1
	}
	if iterations > 10_000_000 {
		iterations = 10_000_000
	}

	var completed atomic.Uint64
	var wg sync.WaitGroup
	for range tasks {
		wg.Go(func() {
			var local uint64
			for index := range iterations {
				if index%1_024 == 0 {
					select {
					case <-ctx.Done():
						completed.Add(local)
						return
					default:
					}
				}
				local++
			}
			completed.Add(local)
		})
	}
	wg.Wait()
	return completed.Load()
}
