package interfaces

import "io"

type NilWriter struct{}

func (*NilWriter) Write(p []byte) (int, error) { return len(p), nil }

func TypedNilWriter() io.Writer {
	var writer *NilWriter
	return writer
}

type Counter int

func (counter Counter) Value() int  { return int(counter) }
func (counter *Counter) Increment() { (*counter)++ }

type Valuer interface {
	Value() int
}

type Incrementer interface {
	Increment()
}
