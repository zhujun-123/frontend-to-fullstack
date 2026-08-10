package selectlab

import (
	"context"
	"errors"
	"testing"
)

func TestFirstUsesReadyChannel(t *testing.T) {
	ready := make(chan int, 1)
	ready <- 42
	value, err := First(context.Background(), nil, ready)
	if err != nil || value != 42 {
		t.Fatalf("First() = %d, %v", value, err)
	}
}

func TestFirstStopsOnCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	_, err := First[int](ctx, nil, nil)
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("First() error = %v, want context canceled", err)
	}
}

func TestFirstReportsClosedChannel(t *testing.T) {
	closed := make(chan int)
	close(closed)
	_, err := First(context.Background(), closed, nil)
	if !errors.Is(err, ErrChannelClosed) {
		t.Fatalf("First() error = %v, want closed channel", err)
	}
}

func BenchmarkSelectReadyChannel(b *testing.B) {
	channel := make(chan int, 1)
	for range b.N {
		channel <- 1
		_, _ = First(context.Background(), channel, nil)
	}
}
