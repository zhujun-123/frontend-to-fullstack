package synclab

import (
	"sync"
	"sync/atomic"
)

type MutexCounter struct {
	mu    sync.Mutex
	value uint64
}

func (counter *MutexCounter) Add(delta uint64) {
	counter.mu.Lock()
	counter.value += delta
	counter.mu.Unlock()
}

func (counter *MutexCounter) Load() uint64 {
	counter.mu.Lock()
	defer counter.mu.Unlock()
	return counter.value
}

type AtomicCounter struct{ value atomic.Uint64 }

func (counter *AtomicCounter) Add(delta uint64) { counter.value.Add(delta) }
func (counter *AtomicCounter) Load() uint64     { return counter.value.Load() }
