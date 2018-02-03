package serviceClient

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

const dockerHost = "unix:///var/run/docker.sock"
const apiVersion = "1.35"

// Client is the data structure that contains the connector to the docker api
type Client struct {
	DockerCli *client.Client
}

// ContainerOptions is the struct that contains all informations about a container
type ContainerOptions struct {
	Image string
}

// NewClient initialize a new client to interact with docker
func NewClient() (*Client, error) {
	headers := map[string]string{
		"User-Agent": "MESG",
	}
	dockerClient, err := client.NewClient(dockerHost, apiVersion, nil, headers)
	if err != nil {
		return nil, err
	}
	return &Client{
		DockerCli: dockerClient,
	}, nil
}

// StartContainer will create and run a new containers
func (client *Client) StartContainer(opts *ContainerOptions) error {
	res, err := client.DockerCli.ContainerList(context.Background(), types.ContainerListOptions{
		All: false,
	})
	// container, err := client.dockerCli.ContainerInspect(context.Background(), "prisma-db")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(res)
	return err
}
