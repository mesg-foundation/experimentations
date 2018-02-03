package service

import (
	"fmt"
	ioutil "io/ioutil"

	yaml "gopkg.in/yaml.v2"
)

const servicePath = "./service/implementations/"
const serviceConfig = "/config.yml"

// Service is a definition for a service to run
type Service struct {
	Name        string   `yaml:"name"`
	Description string   `yaml:"description"`
	Commands    Commands `yaml:"commands"`
	Events      Events   `yaml:"events"`
}

// Start a new services if not started yet
func Start(serviceName string) *Service {
	configFile, err := ioutil.ReadFile(servicePath + serviceName + serviceConfig)
	if err != nil {
		fmt.Println("yamlFile.Get err", err)
	}

	service := Service{}
	yaml.Unmarshal(configFile, &service)
	return &service
}

// Stop a specific service if this service is running
func Stop() bool {
	return true
}

// Restart a specific service or start the service if it's not running
func Restart(serviceName string) *Service {
	Stop()
	return Start(serviceName)
}

func init() {
	fmt.Println("INIT Service")
}
