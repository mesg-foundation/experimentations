package main

import (
	"fmt"

	"./backend"
	"./service"
	"github.com/davecgh/go-spew/spew"
)

func main() {
	service, err := service.LoadFromConfig("ethereum", nil)
	if err != nil {
		panic(err)
	}
	err = service.Start()
	if err != nil {
		fmt.Println(err)
		return
	}

	// err = service.Stop()
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
	spew.Dump(service)
	backend.TestEthereum()
}
