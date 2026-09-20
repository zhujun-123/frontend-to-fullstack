package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	"example.com/frontend-to-fullstack/go-runtime/labs/acceptance"
)

func main() {
	port := flag.Int("port", 8091, "local demo port (loopback only)")
	flag.Parse()
	server := &http.Server{
		Addr: acceptance.Address(*port), Handler: acceptance.New().Handler(),
		ReadHeaderTimeout: 5 * time.Second, WriteTimeout: 10 * time.Second,
	}
	log.Printf("Local teaching lab: http://%s (forgeable demo users, memory only; do not deploy)", server.Addr)
	log.Fatal(server.ListenAndServe())
}
