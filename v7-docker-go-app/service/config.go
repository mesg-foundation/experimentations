package service

import (
	ioutil "io/ioutil"
)

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
