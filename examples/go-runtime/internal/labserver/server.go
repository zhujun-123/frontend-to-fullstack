package labserver

import (
	"context"
	"encoding/json"
	"expvar"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	channellab "example.com/frontend-to-fullstack/go-runtime/labs/channel"
	gclab "example.com/frontend-to-fullstack/go-runtime/labs/gc"
	"example.com/frontend-to-fullstack/go-runtime/labs/scheduler"
)

var requestCount = expvar.NewInt("lab_requests_total")

const requestTimeout = 5 * time.Second

type Server struct {
	logger *slog.Logger
}

func New(logger *slog.Logger) *Server {
	return &Server{logger: logger}
}

func (server *Server) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /healthz", server.wrap(server.health))
	mux.HandleFunc("GET /work/cpu", server.wrap(server.cpu))
	mux.HandleFunc("GET /work/pipeline", server.wrap(server.pipeline))
	mux.HandleFunc("GET /work/allocate", server.wrap(server.allocate))
	mux.HandleFunc("GET /work/io", server.wrap(server.waitIO))
}

func (server *Server) wrap(next http.HandlerFunc) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		started := time.Now()
		requestCount.Add(1)
		ctx, cancel := context.WithTimeout(request.Context(), requestTimeout)
		defer cancel()
		next(response, request.WithContext(ctx))
		server.logger.Info("lab request", "method", request.Method, "path", request.URL.Path, "duration", time.Since(started))
	}
}

func (*Server) health(response http.ResponseWriter, _ *http.Request) {
	writeJSON(response, http.StatusOK, map[string]any{"status": "ok"})
}

func (*Server) cpu(response http.ResponseWriter, request *http.Request) {
	tasks := boundedInt(request, "tasks", 8, 1, 64)
	iterations := boundedInt(request, "iterations", 100_000, 1, 10_000_000)
	completed := scheduler.RunCPUWorkContext(request.Context(), tasks, iterations)
	if err := request.Context().Err(); err != nil {
		writeJSON(response, http.StatusRequestTimeout, map[string]any{"error": err.Error(), "completed": completed})
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{"tasks": tasks, "iterations": iterations, "completed": completed})
}

func (*Server) pipeline(response http.ResponseWriter, request *http.Request) {
	count := boundedInt(request, "count", 8, 1, 256)
	buffer := boundedInt(request, "buffer", 2, 0, 128)
	values := make([]int, count)
	for index := range values {
		values[index] = index
	}
	var results []int
	for value := range channellab.SquarePipeline(request.Context(), values, buffer) {
		results = append(results, value)
	}
	writeJSON(response, http.StatusOK, map[string]any{"count": count, "buffer": buffer, "results": results})
}

func (*Server) allocate(response http.ResponseWriter, request *http.Request) {
	count := boundedInt(request, "count", 64, 1, 1_024)
	size := boundedInt(request, "size", 1_024, 1, 32*1_024)
	before := gclab.ReadSnapshot()
	batches, err := gclab.AllocateBatchesContext(request.Context(), count, size)
	after := gclab.ReadSnapshot()
	if err != nil {
		writeJSON(response, http.StatusRequestTimeout, map[string]any{"error": err.Error(), "allocated_batches": len(batches)})
		return
	}
	writeJSON(response, http.StatusOK, map[string]any{
		"batches": len(batches), "bytes_per_batch": size, "before": before, "after": after,
	})
}

func (*Server) waitIO(response http.ResponseWriter, request *http.Request) {
	delay := time.Duration(boundedInt(request, "delay_ms", 100, 1, 2_000)) * time.Millisecond
	timer := time.NewTimer(delay)
	defer timer.Stop()
	select {
	case <-timer.C:
		writeJSON(response, http.StatusOK, map[string]any{"waited": delay.String()})
	case <-request.Context().Done():
		writeJSON(response, http.StatusRequestTimeout, map[string]any{"error": request.Context().Err().Error()})
	}
}

func boundedInt(request *http.Request, name string, fallback, minimum, maximum int) int {
	value, err := strconv.Atoi(request.URL.Query().Get(name))
	if err != nil {
		return fallback
	}
	if value < minimum {
		return minimum
	}
	if value > maximum {
		return maximum
	}
	return value
}

func writeJSON(response http.ResponseWriter, status int, value any) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(status)
	_ = json.NewEncoder(response).Encode(value)
}
