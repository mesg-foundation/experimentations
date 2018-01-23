#!/bin/bash

$GETH_PATH/geth \
  --networkid 37173 \
  --datadir ./data \
  --rpc \
  --identity Antho \
  --cache 1024 \
  --syncmode full \
  --bootnodes enode://406d2754ad66dcfe227ce3b27ed33353edc7fb3090276c10e2bec7b30f1a0b8ef2f4c9058dee2e22a8a3f1369e590c7ab9b936c7616b638e456a22a8ce5b1ec6@174.138.16.123:30303
#  --ethstats yournode:MESG-test@laughing-murdock-37ecaf.netlify.com \
 # --bootnodes enode://cc936b11ce49018a65c94cc8fe601dbc0ea5d8123bccd6e142e5ade5decb7c5aec6bb2c72583676f0728427793acec8b39c236e637ae28b04e6e2ad523df4644@174.138.31.131:30303
  #--bootnodes enode://8ca4fb1b3e5308c43b8bc6a30e29bd79a1209e989a221b88f58013fa564d51b4ea0201f2a8b26dd751b4aafe81dbec15b9c2d546643b848aefc12221b11be30f@139.59.114.186:30301 \
