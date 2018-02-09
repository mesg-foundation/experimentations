package backend

import (
	"context"
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/common"
	ethClient "github.com/ethereum/go-ethereum/ethClient"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/node"
)

// TestEthereum ...
func TestEthereum() {
	ctx := context.Background()
	client, err := ethClient.Dial("https://mainnet.infura.io")

	if err != nil {
		fmt.Println("Something went wrong", err)
	}
	tx, pending, _ := client.TransactionByHash(ctx, common.HexToHash("0xa3f68b643bacc5b881d666e8db4fb031601f9e74af6e494e0e445faf3eb6e517"))

	// sync, err := conn.SyncProgress(context.Background())
	fmt.Println(tx, pending)

	config := node.DefaultConfig
	config.Name = "MESG"
	config.DataDir = "./tmp"
	log.Root().SetHandler(log.LvlFilterHandler(log.Lvl(log.LvlDebug), log.StreamHandler(os.Stderr, log.TerminalFormat(true))))
	mesgNode, err := node.New(&config)
	if err != nil {
		panic(err)
	}
	err = mesgNode.Start()
	if err != nil {
		panic(err)
	}
	mesgNode.Wait()
	// node := makeFullNode(ctx)
	// startNode(ctx, node)
	// node.Wait()
}
