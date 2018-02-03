package service

// Command is a definition of a command from a service
type Command struct {
	Name        string     `yaml:"name"`
	Description string     `yaml:"description"`
	Arguments   Parameters `yaml:"args"`
	Events      Events     `yaml:"events"`
}

// Commands is a list of Commands
type Commands map[string]Command
