const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://ethereum_node:8546'))

const subscription = web3.eth.subscribe('newBlockHeaders', (err, result) => {
  if (err) { console.error('Error on subscribe', err) }
})
subscription
  .on('changed', () => console.log(`Websocket changed`))
  .on('error', error => console.error('error on ethereum subscription', error))
  .on('data', block => console.log(block.number))