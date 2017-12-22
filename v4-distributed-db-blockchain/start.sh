#!/bin/bash

$GETH_PATH/geth \
  --datadir ./data \
  --identity MESG \
  --rpc \
  --rpcapi db,eth,net,web3,personal \
  --rpccorsdomain "*" \
  --ws \
  --wsorigins "*" \
  --ipcdisable \
  --nodiscover \
  --mine \
  --minerthreads 1