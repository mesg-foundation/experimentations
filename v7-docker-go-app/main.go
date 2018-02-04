package main

// command "github.com/docker/cli/cli/command"
// types "github.com/docker/docker/api/types"
// term "github.com/docker/docker/pkg/term"
// context "golang.org/x/net/context"

import (
	"context"
	"fmt"

	"./service"
	"github.com/ethereum/go-ethereum/common"
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

func main() {
	service, err := service.LoadFromConfig("ethereum", nil)
	if err != nil {
		panic(err)
	}
	service.Start()
	service.Stop()
	// spew.Dump(service)
	// testEthereum()
}
