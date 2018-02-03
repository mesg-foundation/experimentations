package service

// Parameter is the definition of a parameter for a command
type Parameter struct {
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
	Type        string `yaml:"type"`
	Optional    bool   `yaml:"optional"`
}

// Parameters is a list of Parameters
type Parameters []Parameter
