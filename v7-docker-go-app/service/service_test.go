package service_test

import (
	"testing"

	"./"
	"github.com/stvp/assert"
)

func TestLoadFromExistingConfig(t *testing.T) {
	service, err := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	assert.Nil(t, err)
	assert.NotEqual(t, service.Name, "")
}

func TestLoadFromNonExistingConfig(t *testing.T) {
	_, err := service.LoadFromConfig("xxx", &service.Config{
		Directory: "./implementations",
	})
	assert.NotNil(t, err)
}

func TestContainsRequiredFields(t *testing.T) {
	service, _ := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	assert.Equal(t, len(service.Events), 1)
}
