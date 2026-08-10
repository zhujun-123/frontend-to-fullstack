package channel

import "context"

// SquarePipeline owns every channel it creates and stops when the context is
// cancelled. The returned channel is closed by its only sender.
func SquarePipeline(ctx context.Context, values []int, buffer int) <-chan int {
	if buffer < 0 {
		buffer = 0
	}
	if buffer > 128 {
		buffer = 128
	}

	input := make(chan int, buffer)
	output := make(chan int, buffer)

	go func() {
		defer close(input)
		for _, value := range values {
			select {
			case input <- value:
			case <-ctx.Done():
				return
			}
		}
	}()

	go func() {
		defer close(output)
		for value := range input {
			select {
			case output <- value * value:
			case <-ctx.Done():
				return
			}
		}
	}()

	return output
}
