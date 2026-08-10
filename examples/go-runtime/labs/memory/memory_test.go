package memory

import "testing"

func TestBuildRecords(t *testing.T) {
	records := BuildRecords(3, true)
	if len(records) != 3 || records[2].ID != 2 {
		t.Fatalf("unexpected records: %#v", records)
	}
}

func TestPreallocationReducesAllocations(t *testing.T) {
	without := testing.AllocsPerRun(20, func() { _ = BuildRecords(1_000, false) })
	with := testing.AllocsPerRun(20, func() { _ = BuildRecords(1_000, true) })
	if with >= without {
		t.Fatalf("preallocated allocations = %.1f, want less than %.1f", with, without)
	}
}

func BenchmarkBuildRecords(b *testing.B) {
	for _, preallocate := range []bool{false, true} {
		b.Run(map[bool]string{false: "grow", true: "preallocate"}[preallocate], func(b *testing.B) {
			for range b.N {
				_ = BuildRecords(10_000, preallocate)
			}
		})
	}
}
