// Package acceptance contains deliberately broken and corrected local teaching APIs.
// It is not a production service: demo identities are forgeable and data is in memory.
package acceptance

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"sync"
	"sync/atomic"
	"time"
)

//go:embed web/*
var web embed.FS

type Order struct {
	ID      int    `json:"id"`
	Product string `json:"product"`
}

type orderKey struct{ user, mode, key string }

type Server struct {
	mu        sync.Mutex
	orders    map[orderKey][]Order
	nextID    int
	cancelled atomic.Int64
}

func New() *Server { return &Server{orders: make(map[orderKey][]Order)} }

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func mode(r *http.Request) (string, bool) {
	m := r.URL.Query().Get("mode")
	return m, m == "broken" || m == "fixed"
}

func delay(r *http.Request) (time.Duration, bool) {
	raw := r.URL.Query().Get("delay")
	if raw == "" {
		return 0, true
	}
	ms, err := strconv.Atoi(raw)
	return time.Duration(ms) * time.Millisecond, err == nil && ms >= 0 && ms <= 5000
}

// wait preserves request cancellation instead of detaching downstream work.
func wait(r *http.Request, duration time.Duration) bool {
	timer := time.NewTimer(duration)
	defer timer.Stop()
	select {
	case <-r.Context().Done():
		return false
	case <-timer.C:
		return r.Context().Err() == nil
	}
}

func demoUser(r *http.Request) (string, bool) {
	u := r.Header.Get("X-Demo-User")
	return u, u == "alice" || u == "bob"
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		body, _ := web.ReadFile("web/index.html")
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write(body)
	})
	mux.HandleFunc("GET /app.js", func(w http.ResponseWriter, r *http.Request) {
		body, _ := web.ReadFile("web/app.js")
		w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
		_, _ = w.Write(body)
	})
	mux.HandleFunc("GET /api/search", func(w http.ResponseWriter, r *http.Request) {
		d, ok := delay(r)
		if !ok {
			http.Error(w, "invalid delay", http.StatusBadRequest)
			return
		}
		if !wait(r, d) {
			s.cancelled.Add(1)
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"query": r.URL.Query().Get("q")})
	})
	mux.HandleFunc("GET /api/stats", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]int64{"cancelledSearches": s.cancelled.Load()})
	})
	mux.HandleFunc("POST /api/orders", s.createOrder)
	mux.HandleFunc("GET /api/orders", s.listOrders)
	mux.HandleFunc("GET /api/documents/{id}", func(w http.ResponseWriter, r *http.Request) {
		user, ok := demoUser(r)
		if !ok {
			http.Error(w, "demo identity required", http.StatusUnauthorized)
			return
		}
		m, ok := mode(r)
		if !ok {
			http.Error(w, "invalid mode", http.StatusBadRequest)
			return
		}
		if r.PathValue("id") != "bob-note" {
			http.NotFound(w, r)
			return
		}
		if m == "fixed" && user != "bob" {
			http.Error(w, "resource access denied", http.StatusForbidden)
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"owner": "bob", "content": "Bob 的演示笔记"})
	})
	return mux
}

func (s *Server) createOrder(w http.ResponseWriter, r *http.Request) {
	user, ok := demoUser(r)
	if !ok {
		http.Error(w, "demo identity required", http.StatusUnauthorized)
		return
	}
	m, ok := mode(r)
	if !ok {
		http.Error(w, "invalid mode", http.StatusBadRequest)
		return
	}
	d, ok := delay(r)
	if !ok {
		http.Error(w, "invalid delay", http.StatusBadRequest)
		return
	}
	key := r.Header.Get("Idempotency-Key")
	if key == "" || len(key) > 100 {
		http.Error(w, "idempotency key required (max 100 bytes)", http.StatusBadRequest)
		return
	}
	var input struct {
		Product string `json:"product"`
	}
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1024))
	decoder.DisallowUnknownFields()
	if decoder.Decode(&input) != nil || input.Product == "" || decoder.Decode(&struct{}{}) != io.EOF {
		http.Error(w, "one JSON product required", http.StatusBadRequest)
		return
	}

	// The lock models an atomic unique constraint + stored result for ONE process.
	// Production needs durable transactions and a shared uniqueness constraint.
	k := orderKey{user, m, key}
	s.mu.Lock()
	existing := s.orders[k]
	status := http.StatusCreated
	var order Order
	if m == "fixed" && len(existing) > 0 {
		order = existing[0]
		if order.Product != input.Product {
			s.mu.Unlock()
			http.Error(w, "same key, different product", http.StatusConflict)
			return
		}
		status = http.StatusOK
	} else {
		s.nextID++
		order = Order{ID: s.nextID, Product: input.Product}
		s.orders[k] = append(existing, order)
	}
	s.mu.Unlock()

	// Commit first, delay the reply second: losing the reply cannot undo the write.
	if !wait(r, d) {
		return
	}
	writeJSON(w, status, order)
}

func (s *Server) listOrders(w http.ResponseWriter, r *http.Request) {
	user, ok := demoUser(r)
	if !ok {
		http.Error(w, "demo identity required", http.StatusUnauthorized)
		return
	}
	m, ok := mode(r)
	if !ok {
		http.Error(w, "invalid mode", http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	orders := append([]Order{}, s.orders[orderKey{user, m, r.URL.Query().Get("key")}]...)
	s.mu.Unlock()
	writeJSON(w, http.StatusOK, map[string]any{"count": len(orders), "orders": orders})
}

func Address(port int) string { return fmt.Sprintf("127.0.0.1:%d", port) }
