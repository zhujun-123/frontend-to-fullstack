package maplab

import "testing"

func TestLookupDistinguishesMissingFromZero(t *testing.T) {
	values := map[string]int{"present": 0}
	if value, ok := Lookup(values, "present"); value != 0 || !ok {
		t.Fatalf("present lookup = %d, %v", value, ok)
	}
	if value, ok := Lookup(values, "missing"); value != 0 || ok {
		t.Fatalf("missing lookup = %d, %v", value, ok)
	}
}

func TestNilMapReadAndWriteBoundary(t *testing.T) {
	var values map[string]int
	if values["missing"] != 0 {
		t.Fatal("nil map read did not return zero value")
	}
	defer func() {
		if recover() == nil {
			t.Fatal("writing a nil map did not panic")
		}
	}()
	values["write"] = 1
}

func BenchmarkLookup(b *testing.B) {
	values := WordCounts([]string{"a", "b", "c", "d", "e", "f", "g", "h"})
	for range b.N {
		_, _ = Lookup(values, "h")
	}
}
