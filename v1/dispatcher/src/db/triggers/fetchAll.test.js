const assert = require('assert')
const fetchAllTriggers = require('./fetchAll')

describe('Triggers', () => {
  it ('should fetch all triggers', async () => {
    const triggers = await fetchAllTriggers()
    assert.equal(true, Array.isArray(triggers))
  })

  it ('should fetch valid triggers', async () => {
    const triggers = await fetchAllTriggers()
    assert.equal(true, triggers.every(trigger => {
      return trigger.hasOwnProperty('filters')
          && typeof trigger.filters === 'object'
          && trigger.hasOwnProperty('service')
          && trigger.service.hasOwnProperty('type')
          && trigger.service.hasOwnProperty('data')
          && typeof trigger.service.data === 'object'
          && trigger.hasOwnProperty('connector')
          && trigger.connector.hasOwnProperty('type')
    }))
  })
})
