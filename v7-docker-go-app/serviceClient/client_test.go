package serviceClient_test

import (
	"testing"

	"./"
	"github.com/stvp/assert"
)

func TestNewClient(t *testing.T) {
	client, err := serviceClient.NewClient()
	assert.Nil(t, err)
	assert.NotNil(t, client.DockerCli)
}
