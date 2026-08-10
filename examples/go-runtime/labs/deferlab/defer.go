package deferlab

func Order() (events []string) {
	defer func() { events = append(events, "first registered") }()
	defer func() { events = append(events, "second registered") }()
	events = append(events, "body")
	return events
}

func IncrementNamedResult() (result int) {
	defer func() { result++ }()
	return 41
}

func RecoverMessage(action func()) (message any) {
	defer func() { message = recover() }()
	action()
	return nil
}
