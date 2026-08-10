package labserver

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLabEndpoints(t *testing.T) {
	mux := http.NewServeMux()
	New(slog.New(slog.NewTextHandler(io.Discard, nil))).Register(mux)
	for _, path := range []string{
		"/healthz",
		"/work/cpu?tasks=2&iterations=100",
		"/work/pipeline?count=3&buffer=1",
		"/work/allocate?count=2&size=64",
		"/work/io?delay_ms=1",
	} {
		t.Run(strings.ReplaceAll(path, "/", "_"), func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, path, nil)
			response := httptest.NewRecorder()
			mux.ServeHTTP(response, request)
			if response.Code != http.StatusOK {
				t.Fatalf("GET %s returned %d: %s", path, response.Code, response.Body.String())
			}
		})
	}
}
