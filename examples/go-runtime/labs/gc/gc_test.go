package gc

import (
	"runtime"
	"testing"
)

func TestSnapshotAndCollection(t *testing.T) {
	before := ReadSnapshot()
	batches := AllocateBatches(64, 4*1024)
	if len(batches) != 64 {
		t.Fatalf("batch count = %d, want 64", len(batches))
	}
	batches = nil
	runtime.GC()
	after := ReadSnapshot()
	if after.NumGC <= before.NumGC {
		t.Fatalf("GC cycles did not advance: before=%d after=%d", before.NumGC, after.NumGC)
	}
}

func BenchmarkAllocateBatches(b *testing.B) {
	for range b.N {
		_ = AllocateBatches(256, 1024)
	}
}
