package selectlab

import (
	"context"
	"errors"
)

var ErrChannelClosed = errors.New("selected channel is closed")

func First[T any](ctx context.Context, left, right <-chan T) (T, error) {
	select {
	case value, ok := <-left:
		if !ok {
			var zero T
			return zero, ErrChannelClosed
		}
		return value, nil
	case value, ok := <-right:
		if !ok {
			var zero T
			return zero, ErrChannelClosed
		}
		return value, nil
	case <-ctx.Done():
		var zero T
		return zero, ctx.Err()
	}
}

func TryReceive[T any](channel <-chan T) (T, bool) {
	select {
	case value := <-channel:
		return value, true
	default:
		var zero T
		return zero, false
	}
}
