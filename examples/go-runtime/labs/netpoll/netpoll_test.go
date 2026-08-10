package netpoll

import (
	"bytes"
	"context"
	"testing"
	"time"
)

func TestLoopbackRoundTrip(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	payload := []byte("netpoll")
	response, err := LoopbackRoundTrip(ctx, payload)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(response, payload) {
		t.Fatalf("response = %q, want %q", response, payload)
	}
}

func TestLoopbackRoundTripHonorsCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := LoopbackRoundTrip(ctx, []byte("cancelled")); err == nil {
		t.Fatal("LoopbackRoundTrip() unexpectedly succeeded with a cancelled context")
	}
}

func BenchmarkLoopbackRoundTrip(b *testing.B) {
	for range b.N {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		_, err := LoopbackRoundTrip(ctx, []byte("benchmark"))
		cancel()
		if err != nil {
			b.Fatal(err)
		}
	}
}
