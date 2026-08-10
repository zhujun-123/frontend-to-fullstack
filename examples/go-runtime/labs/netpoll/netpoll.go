package netpoll

import (
	"context"
	"fmt"
	"io"
	"net"
	"time"
)

func LoopbackRoundTrip(ctx context.Context, payload []byte) ([]byte, error) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return nil, fmt.Errorf("listen: %w", err)
	}
	defer listener.Close()

	serverErr := make(chan error, 1)
	go func() {
		connection, acceptErr := listener.Accept()
		if acceptErr != nil {
			serverErr <- acceptErr
			return
		}
		defer connection.Close()
		request := make([]byte, len(payload))
		if _, acceptErr = io.ReadFull(connection, request); acceptErr == nil {
			_, acceptErr = connection.Write(request)
		}
		serverErr <- acceptErr
	}()

	dialer := net.Dialer{}
	connection, err := dialer.DialContext(ctx, "tcp", listener.Addr().String())
	if err != nil {
		return nil, fmt.Errorf("dial: %w", err)
	}
	defer connection.Close()
	if deadline, ok := ctx.Deadline(); ok {
		_ = connection.SetDeadline(deadline)
	} else {
		_ = connection.SetDeadline(time.Now().Add(2 * time.Second))
	}

	if _, err = connection.Write(payload); err != nil {
		return nil, fmt.Errorf("write: %w", err)
	}
	response := make([]byte, len(payload))
	if _, err = io.ReadFull(connection, response); err != nil {
		return nil, fmt.Errorf("read: %w", err)
	}
	if err = <-serverErr; err != nil {
		return nil, fmt.Errorf("echo server: %w", err)
	}
	return response, nil
}
