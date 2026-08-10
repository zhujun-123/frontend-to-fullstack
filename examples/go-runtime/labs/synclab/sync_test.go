package synclab

import (
	"sync"
	"testing"
)

type counter interface {
	Add(uint64)
	Load() uint64
}

func runConcurrentAdds(target counter) uint64 {
	var wg sync.WaitGroup
	for range 16 {
		wg.Go(func() {
			for range 1_000 {
				target.Add(1)
			}
		})
	}
	wg.Wait()
	return target.Load()
}

func TestCountersPreserveConcurrentUpdates(t *testing.T) {
	for name, target := range map[string]counter{
		"mutex":  &MutexCounter{},
		"atomic": &AtomicCounter{},
	} {
		t.Run(name, func(t *testing.T) {
			if got, want := runConcurrentAdds(target), uint64(16_000); got != want {
				t.Fatalf("counter = %d, want %d", got, want)
			}
		})
	}
}

func BenchmarkCounters(b *testing.B) {
	for name, target := range map[string]counter{"mutex": &MutexCounter{}, "atomic": &AtomicCounter{}} {
		b.Run(name, func(b *testing.B) {
			b.RunParallel(func(pb *testing.PB) {
				for pb.Next() {
					target.Add(1)
				}
			})
		})
	}
}
