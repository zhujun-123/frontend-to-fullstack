package maplab

func WordCounts(words []string) map[string]int {
	counts := make(map[string]int, len(words))
	for _, word := range words {
		counts[word]++
	}
	return counts
}

func Lookup[K comparable, V any](values map[K]V, key K) (V, bool) {
	value, ok := values[key]
	return value, ok
}
