const MesgStorage = artifacts.require('MesgStorage')

const PENDING = 1
const CONFIRMED = 1
const FINISHED = 1
const runner = 'TEST'
const good = JSON.stringify('good')
const bad = JSON.stringify('bad')

const promisifyAll = async (values, callback) => await Promise.all(values.map(async (val, i) => await callback(val, i)))

contract('MesgStorage', async accounts => {
  it ('should have the owner that create the contract', async () => {
    const contract = await MesgStorage.deployed()
    const owner = await contract.owner.call()
    assert.equal(owner, accounts[0])
  })
  it ('should add a new MESG', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'NEW MESG'
    const { receipt } = await contract.add(runner, id, good)
    assert.equal(receipt.status, 1)
  })
  it ('should trigger the created event', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'CREATED EVENT'
    const { logs } = await contract.add(runner, id, good)
    assert(logs.some(x => x.event === 'Created'))
  })
  it ('should not trigger the created event', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'NOT CREATED EVENT'
    await contract.add(runner, id, good, { from: accounts[0] })
    const { logs } = await contract.add(runner, id, good, { from: accounts[1] })
    assert(!logs.some(x => x.event === 'Created'))
  })
  it ('should trigger the voted event', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'VOTED EVENT'
    const { logs } = await contract.add(runner, id, good)
    assert(logs.some(x => x.event === 'Voted'))
  })
  it ('should contains the best value', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'BEST VALUE'
    const votes = [good, good, bad, good]
    await promisifyAll(votes, (vote, i) => contract
      .add(runner, id, vote, { from: accounts[i] })
    )
    assert.equal(await contract.mesgBestValue.call(runner, id), good)
  })
  it ('should contains right number of best vote', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'NUMBER BEST VOTE'
    const votes = [good, good, bad, good]
    await promisifyAll(votes, (vote, i) => contract
      .add(runner, id, vote, { from: accounts[i] })
    )
    assert.equal(await contract.mesgBestValueCount.call(runner, id), votes.filter(x => x === good).length)
  })
  it ('should not trigger the confirmed event', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'NOT CONFIRMED EVENT'
    const votes = [good, good, bad, good]
    const res = await promisifyAll(votes, (vote, i) => contract
      .add(runner, id, vote, { from: accounts[i] })
    )
    assert(res.every(({ logs }) => !logs.some(y => y.event === 'Confirmed')))
  })
  it('should trigger the confirmed event', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'CONFIRMED EVENT'
    const votes = [good, good, bad, good, bad, bad, good, bad, good]
    const res = (await promisifyAll(votes, (vote, i) => contract
      .add(runner, id, vote, { from: accounts[i] })
    ))
    assert(res.some(({ logs }) => logs.some(y => y.event === 'Confirmed')))
  })
  it('should have the valid status after confirmation', async () => {
    const contract = await MesgStorage.deployed()
    const id = 'VALID FINAL STATUS'
    const votes = [good, good, bad, good, bad, bad, good, bad, good]
    await promisifyAll(votes, (vote, i) => contract
      .add(runner, id, vote, { from: accounts[i] })
    )
    assert.equal((await contract.mesgStatus(runner, id)).toNumber(), CONFIRMED)
  })
})