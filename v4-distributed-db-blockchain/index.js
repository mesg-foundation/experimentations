const Web3 = require('web3')

const client = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'))

const start = async () => {
  const addresses = await client.eth.getAccounts()
  console.log(addresses)
  const subscription = await client.eth.subscribe('newBlockHeaders', (err, result) => {
    if (err) { Logger.error('Error on subscribe', { blockchain, err }) }
  })
  subscription
    .on('changed', () => console.error(`Websocket changed`))
    .on('error', error => { throw error })
    .on('data', block => console.log(block.number))
}

start()