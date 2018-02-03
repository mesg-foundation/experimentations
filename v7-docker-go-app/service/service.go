package service

import (
	ioutil "io/ioutil"

	"../serviceClient"
	yaml "gopkg.in/yaml.v2"
)

const defaultServiceDirectory = "./service/implementations"
const defaultServiceConfigFile = "config.yml"

var client *serviceClient.Client

// Config is the struct related to where to find the service configurations
type Config struct {
	Directory string
	File      string
}

// Service is a definition for a service to run
type Service struct {
	Name        string   `yaml:"name"`
	Description string   `yaml:"description"`
	Commands    Commands `yaml:"commands"`
	Events      Events   `yaml:"events"`
}

// LoadFromConfig returns a service object based on the serviceName
func LoadFromConfig(serviceName string, config *Config) (*Service, error) {
	if config == nil {
		config = &Config{}
	}
	if config.Directory == "" {
		config.Directory = defaultServiceDirectory
	}
	if config.File == "" {
		config.File = defaultServiceConfigFile
	}
	service := Service{}
	var configFile, err = ioutil.ReadFile(config.Directory + "/" + serviceName + "/" + config.File)
	if err != nil {
		return &service, err
	}

	err = yaml.Unmarshal(configFile, &service)
	if err != nil {
		return &service, err
	}
	return &service, nil
}

// Start a service
func (service *Service) Start() *Service {
	client.StartContainer(&serviceClient.ContainerOptions{
		Image: "faefea",
	})
	return service
}

// Stop a service
func (service *Service) Stop() *Service {
	return service
}

// Restart a service
func (service *Service) Restart() *Service {
	return service.
		Stop().
		Start()
}

func init() {
	var err error
	client, err = serviceClient.NewClient()
	if err != nil {
		panic(err)
	}
}
