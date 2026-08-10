package gc

import (
	"context"
	"runtime"
)

type Snapshot struct {
	HeapAlloc uint64
	HeapInuse uint64
	NumGC     uint32
}

func ReadSnapshot() Snapshot {
	var stats runtime.MemStats
	runtime.ReadMemStats(&stats)
	return Snapshot{HeapAlloc: stats.HeapAlloc, HeapInuse: stats.HeapInuse, NumGC: stats.NumGC}
}

func AllocateBatches(count, bytesPerBatch int) [][]byte {
	batches, _ := AllocateBatchesContext(context.Background(), count, bytesPerBatch)
	return batches
}

func AllocateBatchesContext(ctx context.Context, count, bytesPerBatch int) ([][]byte, error) {
	if count < 0 {
		count = 0
	}
	if count > 2_048 {
		count = 2_048
	}
	if bytesPerBatch < 1 {
		bytesPerBatch = 1
	}
	if bytesPerBatch > 64*1024 {
		bytesPerBatch = 64 * 1024
	}

	batches := make([][]byte, count)
	for index := range batches {
		select {
		case <-ctx.Done():
			return batches[:index], ctx.Err()
		default:
		}
		batches[index] = make([]byte, bytesPerBatch)
		batches[index][0] = byte(index)
	}
	return batches, nil
}
