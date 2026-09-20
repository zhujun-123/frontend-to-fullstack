package acceptance

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"
)

func request(t *testing.T, client *http.Client, method, url, user, key, body string) (int, []byte) {
	t.Helper()
	r, err := http.NewRequest(method, url, strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	r.Header.Set("X-Demo-User", user)
	r.Header.Set("Idempotency-Key", key)
	response, err := client.Do(r)
	if err != nil {
		t.Error(err)
		return 0, nil
	}
	defer response.Body.Close()
	data, err := io.ReadAll(response.Body)
	if err != nil {
		t.Error(err)
	}
	return response.StatusCode, data
}

func count(t *testing.T, server *httptest.Server, mode, user, key string) int {
	t.Helper()
	status, data := request(t, server.Client(), "GET", server.URL+"/api/orders?mode="+mode+"&key="+key, user, "", "")
	if status != 200 {
		t.Fatalf("list status = %d", status)
	}
	var state struct {
		Count int `json:"count"`
	}
	if err := json.Unmarshal(data, &state); err != nil {
		t.Fatal(err)
	}
	return state.Count
}

func TestRetryAndConcurrentUniqueness(t *testing.T) {
	for _, mode := range []string{"broken", "fixed"} {
		t.Run(mode, func(t *testing.T) {
			server := httptest.NewServer(New().Handler())
			defer server.Close()
			var wg sync.WaitGroup
			for range 20 {
				wg.Go(func() {
					status, _ := request(t, server.Client(), "POST", server.URL+"/api/orders?mode="+mode, "alice", "same-operation", `{"product":"book"}`)
					if status != 200 && status != 201 {
						t.Errorf("status = %d", status)
					}
				})
			}
			wg.Wait()
			want := 20
			if mode == "fixed" {
				want = 1
			}
			if got := count(t, server, mode, "alice", "same-operation"); got != want {
				t.Fatalf("got %d writes, want %d", got, want)
			}
		})
	}
}

func TestSameKeyConflictAndUserIsolation(t *testing.T) {
	server := httptest.NewServer(New().Handler())
	defer server.Close()
	url := server.URL + "/api/orders?mode=fixed"
	_, original := request(t, server.Client(), "POST", url, "alice", "operation", `{"product":"book"}`)
	status, replay := request(t, server.Client(), "POST", url, "alice", "operation", `{"product":"book"}`)
	if status != 200 || string(replay) != string(original) {
		t.Fatalf("replay changed result: %d %s", status, replay)
	}
	status, _ = request(t, server.Client(), "POST", url, "alice", "operation", `{"product":"other"}`)
	if status != 409 {
		t.Fatalf("conflict status = %d", status)
	}
	if count(t, server, "fixed", "bob", "operation") != 0 {
		t.Fatal("Bob can see Alice orders")
	}
	status, _ = request(t, server.Client(), "POST", url, "bob", "operation", `{"product":"other"}`)
	if status != 201 {
		t.Fatalf("key was not scoped to user: %d", status)
	}
	if count(t, server, "fixed", "alice", "operation") != 1 {
		t.Fatal("conflict caused another write")
	}
}

func TestCancellationReachesSearch(t *testing.T) {
	s := New()
	// Wait for the handler to receive the request before disconnecting.
	started := make(chan struct{})
	handler := s.Handler()
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		close(started)
		handler.ServeHTTP(w, r)
	}))
	defer server.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	r, _ := http.NewRequestWithContext(ctx, "GET", server.URL+"/api/search?q=old&delay=5000", nil)
	done := make(chan error, 1)
	go func() {
		response, err := server.Client().Do(r)
		if response != nil {
			response.Body.Close()
		}
		done <- err
	}()
	select {
	case <-started:
	case <-time.After(2 * time.Second):
		t.Fatal("request never arrived")
	}
	cancel()
	select {
	case err := <-done:
		if err == nil {
			t.Fatal("expected client cancellation")
		}
	case <-time.After(2 * time.Second):
		t.Fatal("client did not cancel")
	}
	deadline := time.Now().Add(2 * time.Second)
	for s.cancelled.Load() == 0 && time.Now().Before(deadline) {
		time.Sleep(time.Millisecond)
	}
	if s.cancelled.Load() != 1 {
		t.Fatal("server did not observe cancellation")
	}
}

func TestLostResponseDoesNotUndoWrite(t *testing.T) {
	server := httptest.NewServer(New().Handler())
	defer server.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	r, _ := http.NewRequestWithContext(ctx, "POST", server.URL+"/api/orders?mode=fixed&delay=5000", strings.NewReader(`{"product":"book"}`))
	r.Header.Set("X-Demo-User", "alice")
	r.Header.Set("Idempotency-Key", "lost-reply")
	done := make(chan error, 1)
	go func() {
		response, err := server.Client().Do(r)
		if response != nil {
			response.Body.Close()
		}
		done <- err
	}()
	deadline := time.Now().Add(2 * time.Second)
	for count(t, server, "fixed", "alice", "lost-reply") == 0 {
		if time.Now().After(deadline) {
			t.Fatal("write never committed")
		}
		time.Sleep(time.Millisecond)
	}
	cancel()
	select {
	case err := <-done:
		if err == nil {
			t.Fatal("expected lost response")
		}
	case <-time.After(2 * time.Second):
		t.Fatal("request stuck")
	}
	status, _ := request(t, server.Client(), "POST", server.URL+"/api/orders?mode=fixed", "alice", "lost-reply", `{"product":"book"}`)
	if status != 200 || count(t, server, "fixed", "alice", "lost-reply") != 1 {
		t.Fatal("retry created another order")
	}
}

func TestResourceAuthorization(t *testing.T) {
	server := httptest.NewServer(New().Handler())
	defer server.Close()
	for _, tc := range []struct {
		mode, user string
		want       int
	}{
		{"broken", "alice", 200}, {"fixed", "alice", 403}, {"fixed", "bob", 200}, {"fixed", "", 401}, {"fixed", "mallory", 401},
	} {
		status, body := request(t, server.Client(), "GET", server.URL+"/api/documents/bob-note?mode="+tc.mode, tc.user, "", "")
		if status != tc.want {
			t.Errorf("%+v: status %d", tc, status)
		}
		if status != 200 && strings.Contains(string(body), "Bob 的演示笔记") {
			t.Fatal("denied response leaked content")
		}
	}
}

func TestInvalidInputsDoNotWrite(t *testing.T) {
	server := httptest.NewServer(New().Handler())
	defer server.Close()
	for _, body := range []string{`{`, `{}`, `{"product":""}`, `{"product":"x","admin":true}`, `{"product":"x"} {}`} {
		status, _ := request(t, server.Client(), "POST", server.URL+"/api/orders?mode=fixed", "alice", "invalid", body)
		if status != 400 {
			t.Errorf("%s: status %d", body, status)
		}
	}
	if count(t, server, "fixed", "alice", "invalid") != 0 {
		t.Fatal("invalid input wrote state")
	}
}
