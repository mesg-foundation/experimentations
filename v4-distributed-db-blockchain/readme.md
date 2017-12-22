## Create the address for the authority

```#GETH_PATH/geth account new --datadir authority```

the one in the /authority is **1ea3b231019f14ba0c24b428dbb42d12f97cac8d** with the password **12345678**

## Create network

```
$GETH_PATH/puppeth
```
Please specify a network name to administer (no spaces, please): **mesg-test**
What would you like to do? (default = stats): **2**
Which consensus engine to use? (default = clique): **2**
How many seconds should blocks take? (default = 15): **10**
Which accounts are allowed to seal? (mandatory at least one): **1ea3b231019f14ba0c24b428dbb42d12f97cac8d**
Which accounts should be pre-funded? (advisable at least one): *another adresse created with the geth account command*
Specify your chain/network ID if you want an explicit one (default = random): **random**
Anything fun to embed into the genesis block? (max 32 bytes): **MESG is awesome**

## Create the ethstats
What would you like to do? (default = stats): **2**
What would you like to deploy? (recommended order): **1**
Which server do you want to interact with?: **1**
Please enter remote server's address: **127.0.0.1**






ethstats  :3000
Bootnode  :30303
faucet    : 3001
