package service

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/docker/docker/api/types/swarm"
	docker "github.com/fsouza/go-dockerclient"
	yaml "gopkg.in/yaml.v2"
)

var dockerCli *docker.Client

const (
	labelImage     = "com.docker.stack.image"
	labelNamespace = "com.docker.stack.namespace"
)

// Config is the struct related to where to find the service configurations
type Config struct {
	Directory string
	File      string
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
func (service *Service) Start() error {
	var err error
	fmt.Println("[Start] " + service.Name)
	for app, s := range service.Applications {
		fmt.Println("\t- " + app)
		ports := make([]swarm.PortConfig, len(s.Ports))
		for i, p := range s.Ports {
			split := strings.Split(p, ":")
			from, _ := strconv.Atoi(split[0])
			to, _ := strconv.Atoi(split[1])
			ports[i] = swarm.PortConfig{
				Protocol:      swarm.PortConfigProtocolTCP,
				PublishMode:   "ingress",
				TargetPort:    uint32(to),
				PublishedPort: uint32(from),
			}
		}
		s.SwarmService, err = dockerCli.CreateService(docker.CreateServiceOptions{
			ServiceSpec: swarm.ServiceSpec{
				Annotations: swarm.Annotations{
					Name: strings.Join([]string{service.namespace(), app}, "_"),
					Labels: map[string]string{
						labelImage:     s.Image,
						labelNamespace: service.namespace(),
					},
				},
				TaskTemplate: swarm.TaskSpec{
					ContainerSpec: &swarm.ContainerSpec{
						Image: s.Image,
						Args:  strings.Fields(s.Command),
						Labels: map[string]string{
							labelNamespace: service.namespace(),
						},
					},
				},
				EndpointSpec: &swarm.EndpointSpec{
					Ports: ports,
				},
			},
		})
	}
	// Disgrasfully close the service because there is an error
	if err != nil {
		service.Stop()
	}
	return err
}

// Stop a service
func (service *Service) Stop() error {
	var err error
	fmt.Println("[Stop] " + service.Name)
	for app, s := range service.Applications {
		if s.SwarmService != nil {
			fmt.Println("\t- " + app)
			err = dockerCli.RemoveService(docker.RemoveServiceOptions{
				ID: s.SwarmService.ID,
			})
		}
	}
	return err
}

// Restart a service
func (service *Service) Restart() error {
	service.Stop()
	return service.Start()
}

// IsValid returns if the service is valid
func (service *Service) IsValid() bool {
	return service.Name != "" &&
		len(service.Commands)+len(service.Events) > 0 &&
		len(service.Applications) > 0
}

func init() {
	endpoint := "unix:///var/run/docker.sock"
	client, err := docker.NewClient(endpoint)
	if err != nil {
		panic(err)
	}
	dockerCli = client
}
