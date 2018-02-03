package main

// command "github.com/docker/cli/cli/command"
// types "github.com/docker/docker/api/types"
// term "github.com/docker/docker/pkg/term"
// context "golang.org/x/net/context"

import (
	"context"
	"fmt"

	service "./service"
	command "github.com/docker/cli/cli/command"
	cliflags "github.com/docker/cli/cli/flags"
	types "github.com/docker/docker/api/types"
	term "github.com/docker/docker/pkg/term"
	common "github.com/ethereum/go-ethereum/common"
	ethClient "github.com/ethereum/go-ethereum/ethClient"
)

func testEthereum() {
	client, err := ethClient.Dial("https://mainnet.infura.io")

	if err != nil {
		fmt.Println("Something went wrong", err)
	}
	ctx := context.Background()
	tx, pending, _ := client.TransactionByHash(ctx, common.HexToHash("0xa3f68b643bacc5b881d666e8db4fb031601f9e74af6e494e0e445faf3eb6e517"))

	// sync, err := conn.SyncProgress(context.Background())
	fmt.Println(tx, pending)
}

func testService() {
	service := service.Start("webhook")
	fmt.Println(service)
}

func testDocker() {
	stdin, stdout, stderr := term.StdStreams()
	cli := command.NewDockerCli(stdin, stdout, stderr)
	cli.Initialize(&cliflags.ClientOptions{
		Common: &cliflags.CommonOptions{
			Hosts: []string{"unix:///var/run/docker.sock"},
		},
	})
	client := cli.Client()
	ctx := context.Background()
	// containers, err := client.ContainerList(context.Background(), &types.ContainerListOptions{})
	container, _ := client.ContainerInspect(ctx, "prisma-db")
	options := types.ContainerListOptions{
		All: true,
	}
	containers, err := client.ContainerList(ctx, options)
	fmt.Println(container)

	// ctx := context.Background()
	// // options := types.ContainerListOptions{
	// // 	All: true,
	// // }
	// cs, err := client.ContainerInspect(ctx, "6a64838cd60c")
	// fmt.Println("passe", cs, err)
	// // cs, error := client.ContainerList(ctx, options)
	// // fmt.Println(cs)
}

func main() {
	// testService()
	// testEthereum()
	testDocker()
}
