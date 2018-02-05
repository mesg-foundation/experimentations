package service

import "github.com/docker/docker/api/types/swarm"

// Service is a definition for a service to run
type Service struct {
	Name         string       `yaml:"name"`
	Description  string       `yaml:"description"`
	Commands     Commands     `yaml:"commands"`
	Events       Events       `yaml:"events"`
	Applications Applications `yaml:"services"`
}

// Command is a definition of a command from a service
type Command struct {
	Name        string     `yaml:"name"`
	Description string     `yaml:"description"`
	Arguments   Parameters `yaml:"args"`
	Events      Events     `yaml:"events"`
}

// Commands is a list of Commands
type Commands map[string]*Command

// Event is the definition of an event emitted from a service
type Event struct {
	Name        string     `yaml:"name"`
	Description string     `yaml:"description"`
	Data        Parameters `yaml:"data"`
}

// Events is a list of Events
type Events map[string]*Event

// Parameter is the definition of a parameter for a command
type Parameter struct {
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
	Type        string `yaml:"type"`
	Optional    bool   `yaml:"optional"`
}

// Parameters is a list of Parameters
type Parameters []*Parameter

// Application is the docker informations about the application
type Application struct {
	Image        string   `yaml:"image"`
	Volumes      []string `yaml:"volumes"`
	Ports        []string `yaml:"ports"`
	Command      string   `yaml:"command"`
	SwarmService *swarm.Service
}

// Applications is a list of Applications
type Applications map[string]*Application
