const Web3 = require('web3')

const client = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const authority = '0x1ea3b231019f14ba0c24b428dbb42d12f97cac8d'
const user = '0xf4cd771183e292506288dcc7a18aae9f56ea847c'

const start = async () => {
  const addresses = await client.eth.getAccounts()
  // client.eth.personal.
  console.log(addresses)
  console.log(await client.eth.getBalance(authority))
  console.log(await client.eth.getBalance(user))
  // debugger
  // const res = await client.eth.sendTransaction({
  //   from: authority,
  //   to: user,
  //   value: client.utils.toWei('1', 'ether')
  // })
  // const res = await client.eth.sendSignedTransaction(signedTransaction)
  // const subscription = await client.eth.subscribe('newBlockHeaders', (err, result) => {
  //   if (err) { Logger.error('Error on subscribe', { blockchain, err }) }
  // })
  // subscription
  //   .on('changed', () => console.error(`Websocket changed`))
  //   .on('error', error => { throw error })
  //   .on('data', block => console.log(block.number))
}

start()