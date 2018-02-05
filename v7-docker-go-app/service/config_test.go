package service_test

import (
	"testing"

	"./"
	"github.com/stvp/assert"
)

func TestConfigFile(t *testing.T) {
	file, err := service.ConfigFile("ethereum", &service.Config{
		Directory: "./implementations",
	})
	assert.Nil(t, err)
	assert.Contains(t, "name: ethereum", string(file))
}

func TestWrongConfigFile(t *testing.T) {
	// this should fails because we don't set the config which are necessary for testing
	_, err := service.ConfigFile("ethereum", nil)
	assert.NotNil(t, err)
}
