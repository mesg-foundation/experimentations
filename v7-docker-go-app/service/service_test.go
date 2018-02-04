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

func TestLoadFromWrongConfig(t *testing.T) {
	_, err := service.LoadFromConfig("invalid-config", &service.Config{
		Directory: "./test",
	})
	assert.NotNil(t, err)
}

func TestContainsRequiredFields(t *testing.T) {
	service, _ := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	assert.Equal(t, len(service.Events), 1)
}

func TestStart(t *testing.T) {
	s, _ := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	s.Start()
}

func TestStop(t *testing.T) {
	s, _ := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	s.Stop()
}

func TestRestart(t *testing.T) {
	s, _ := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	s.Restart()
}

func TestIsValid(t *testing.T) {
	s1, _ := service.LoadFromConfig("ethereum", &service.Config{
		Directory: "./implementations",
	})
	s2, _ := service.LoadFromConfig("invalid-config", &service.Config{
		Directory: "./test",
	})
	assert.True(t, s1.IsValid())
	assert.False(t, s2.IsValid())
}
