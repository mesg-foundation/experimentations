const mesg = require('experimentation-mesg-js')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://128.199.114.190:8546'))

const transfert = (args, events) => {
  console.log('passe')
}

mesg({ transfert }, ({ onTransaction }) => {
  console.log('Start listening Ethereum blocks')
  
  const subscription = web3.eth.subscribe('newBlockHeaders', (err, result) => {
    if (err) { console.error('Error on subscribe', err) }
  })
  subscription
    .on('changed', () => console.log(`Websocket changed`))
    .on('error', error => console.error('error on ethereum subscription', error))
    .on('data', async block => {
      const blockWithTx = await web3.eth.getBlock(block.number, true)
      blockWithTx.transactions.forEach(transaction => {
        onTransaction({
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          value: parseFloat(transaction.value)
        })
      })
    })
})
