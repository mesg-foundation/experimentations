package service

import (
	ioutil "io/ioutil"

	"github.com/docker/cli/cli/command"
	"github.com/docker/cli/cli/flags"
	"github.com/docker/docker/pkg/term"
)

const dockerHost = "unix:///var/run/docker.sock"
const apiVersion = "1.35"

const defaultServiceDirectory = "./service/implementations"
const defaultServiceConfigFile = "config.yml"

// ConfigFile returns the config file of the service
func ConfigFile(serviceName string, config *Config) ([]byte, error) {
	if config == nil {
		config = &Config{}
	}
	if config.Directory == "" {
		config.Directory = defaultServiceDirectory
	}
	if config.File == "" {
		config.File = defaultServiceConfigFile
	}
	return ioutil.ReadFile(config.Directory + "/" + serviceName + "/" + config.File)
}

// CreateDockerCli creates a new docker cli interface
func CreateDockerCli() (command.Cli, error) {
	stdin, stdout, stderr := term.StdStreams()
	cli := command.NewDockerCli(stdin, stdout, stderr)
	err := cli.Initialize(&flags.ClientOptions{
		Common: &flags.CommonOptions{
			Hosts: []string{dockerHost},
		},
	})
	return cli, err
}
