package channel

import (
	"context"
	"reflect"
	"testing"
	"time"
)

func TestSquarePipeline(t *testing.T) {
	var got []int
	for value := range SquarePipeline(context.Background(), []int{1, 2, 3}, 1) {
		got = append(got, value)
	}
	if want := []int{1, 4, 9}; !reflect.DeepEqual(got, want) {
		t.Fatalf("pipeline output = %v, want %v", got, want)
	}
}

func TestSquarePipelineStopsAfterCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	output := SquarePipeline(ctx, []int{1, 2, 3, 4, 5}, 0)
	cancel()

	select {
	case _, ok := <-output:
		if ok {
			for range output {
			}
		}
	case <-time.After(time.Second):
		t.Fatal("pipeline did not stop after cancellation")
	}
}

func BenchmarkSquarePipeline(b *testing.B) {
	values := make([]int, 128)
	for range b.N {
		for range SquarePipeline(context.Background(), values, 16) {
		}
	}
}
