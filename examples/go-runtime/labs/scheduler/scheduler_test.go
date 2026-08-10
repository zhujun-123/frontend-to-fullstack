package scheduler

import (
	"context"
	"runtime"
	"testing"
)

func TestRunCPUWorkCompletesAllTasks(t *testing.T) {
	previous := runtime.GOMAXPROCS(2)
	defer runtime.GOMAXPROCS(previous)

	if got, want := RunCPUWork(8, 10_000), uint64(80_000); got != want {
		t.Fatalf("completed iterations = %d, want %d", got, want)
	}
}

func TestRunCPUWorkStopsAfterCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if got, maximum := RunCPUWorkContext(ctx, 64, 10_000_000), uint64(640_000_000); got >= maximum {
		t.Fatalf("cancelled work completed %d iterations, want less than %d", got, maximum)
	}
}

func BenchmarkRunCPUWork(b *testing.B) {
	for range b.N {
		RunCPUWork(8, 20_000)
	}
}
