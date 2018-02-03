package service

// Event is the definition of an event emitted from a service
type Event struct {
	Name        string     `yaml:"name"`
	Description string     `yaml:"description"`
	Data        Parameters `yaml:"data"`
}

// Events is a list of Events
type Events map[string]Event
