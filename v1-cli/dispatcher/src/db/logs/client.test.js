const assert = require('assert')
const client = require('./client')

describe('Logs database', () => {
  
  it ('should have a valid connection', async () => {
    const hosts = await client.ping(5000)
    assert.equal(true, hosts.some(({ online }) => online))
  })

  it ('should have the right database', async () => {
    const databases = await client.getDatabaseNames()
    assert.equal(true, databases.indexOf('logs'))
  })
})