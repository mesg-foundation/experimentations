const Web3 = require('web3')

setTimeout(() => {
  try {
    // const web1 = new Web3(new Web3.providers.WebsocketProvider('ws://ethereum_node:8546'))
    // const web2 = new Web3(new Web3.providers.WebsocketProvider('ws://mesg_ethereum_node:8546'))
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://188.166.234.120:8546'))
    
    web3.eth.subscribe('newBlockHeaders', (err, result) => {
      if (err) { console.error(err) }
      console.log(result.number)
    })
  } catch (e) {
    console.error("ERRROR")
    console.error(e)
  }
}, 10000)

setInterval(() => console.log('ping'), 1000)