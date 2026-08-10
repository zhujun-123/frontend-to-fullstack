package interfaces

import "testing"

func TestTypedNilInterfaceIsNotNil(t *testing.T) {
	if writer := TypedNilWriter(); writer == nil {
		t.Fatal("typed nil interface unexpectedly compared equal to nil")
	}
}

func TestMethodSets(t *testing.T) {
	value := Counter(1)
	var valuer Valuer = value
	var pointerValuer Valuer = &value
	var incrementer Incrementer = &value
	incrementer.Increment()
	if valuer.Value() != 1 || pointerValuer.Value() != 2 {
		t.Fatalf("unexpected method-set results: value=%d pointer=%d", valuer.Value(), pointerValuer.Value())
	}
}

func BenchmarkInterfaceCall(b *testing.B) {
	var value Valuer = Counter(42)
	for range b.N {
		_ = value.Value()
	}
}
