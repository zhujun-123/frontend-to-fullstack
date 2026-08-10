package memory

type Record struct {
	ID   int
	Name string
}

func BuildRecords(count int, preallocate bool) []Record {
	if count < 0 {
		count = 0
	}
	if count > 100_000 {
		count = 100_000
	}

	var records []Record
	if preallocate {
		records = make([]Record, 0, count)
	}
	for id := range count {
		records = append(records, Record{ID: id, Name: "record"})
	}
	return records
}

func EscapedRecord(id int) *Record {
	record := Record{ID: id, Name: "escaped"}
	return &record
}
