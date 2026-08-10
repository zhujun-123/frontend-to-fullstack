package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"syscall"
	"time"

	"example.com/frontend-to-fullstack/go-runtime/internal/labserver"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	labserver.New(logger).Register(http.DefaultServeMux)

	server := &http.Server{
		Addr:              "127.0.0.1:8080",
		Handler:           http.DefaultServeMux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = server.Shutdown(shutdownCtx)
	}()

	logger.Info("lab server listening", "address", server.Addr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("lab server failed", "error", err)
		os.Exit(1)
	}
}
