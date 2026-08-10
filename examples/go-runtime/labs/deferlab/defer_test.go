package deferlab

import (
	"reflect"
	"testing"
)

func TestDeferOrder(t *testing.T) {
	want := []string{"body", "second registered", "first registered"}
	if got := Order(); !reflect.DeepEqual(got, want) {
		t.Fatalf("events = %v, want %v", got, want)
	}
}

func TestNamedResultAndRecover(t *testing.T) {
	if got := IncrementNamedResult(); got != 42 {
		t.Fatalf("named result = %d, want 42", got)
	}
	if got := RecoverMessage(func() { panic("boom") }); got != "boom" {
		t.Fatalf("recovered value = %v, want boom", got)
	}
}

func BenchmarkDefer(b *testing.B) {
	for range b.N {
		_ = IncrementNamedResult()
	}
}
