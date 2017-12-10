const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'))

web3.eth.subscribe('newBlockHeaders', (err, result) => {
  if (err) { console.error(err) }
  console.log(result.number)
})
