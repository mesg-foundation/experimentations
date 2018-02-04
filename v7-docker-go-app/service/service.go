package service

import (
	"errors"
	"strings"

	"github.com/docker/cli/cli/command"
	"github.com/docker/cli/cli/command/stack/options"
	"github.com/docker/cli/cli/command/stack/swarm"
	yaml "gopkg.in/yaml.v2"
)

var dockerCli command.Cli

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
	service := Service{}

	configFile, err := ConfigFile(serviceName, config)
	if err != nil {
		return &service, err
	}
	err = yaml.Unmarshal(configFile, &service)
	if err != nil {
		return &service, err
	}
	if !service.IsValid() {
		return &service, errors.New("Invalid service")
	}
	return &service, err
}

func (service *Service) namespace() string {
	return strings.Join([]string{"MESG", service.Name}, "-")
}

// Start a service
func (service *Service) Start() (*Service, error) {

	// file, err := ioutil.TempFile(os.TempDir(), service.Name)
	err := swarm.RunDeploy(dockerCli, options.Deploy{
		Namespace:    service.namespace(),
		Prune:        true,
		ResolveImage: "changed",
		Composefile:  "./service/implementations/ethereum/docker-compose.yml",
	})

	// defer os.Remove(file.Name())

	return service, err
}

// Stop a service
func (service *Service) Stop() (*Service, error) {
	err := swarm.RunRemove(dockerCli, options.Remove{
		Namespaces: []string{
			service.namespace(),
		},
	})
	return service, err
}

// Restart a service
func (service *Service) Restart() (*Service, error) {
	service.Stop()
	return service.Start()
}

func init() {
	cli, err := CreateDockerCli()
	dockerCli = cli
	if err != nil {
		panic(err)
	}
}

// IsValid returns if the service is valid
func (service *Service) IsValid() bool {
	if service.Name == "" {
		return false
	}
	if len(service.Commands)+len(service.Events) == 0 {
		return false
	}
	return true
}
