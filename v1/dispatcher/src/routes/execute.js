const axios = require('axios')
const fetchAll = require('../db/triggers/fetchAll')
const nodeSelection = require('../processing/nodeSelection')
const filterMatching = require('../processing/filterMatching')
const writeLogs = require('../db/logs/write')

const filterParams = (config, params) => Object.keys(config.inputs)
  .reduce((acc, res) => ({
    ...acc,
    [res]: params[res]
  }), {})

const execute = (store, params) => async trigger => {
  const service = nodeSelection(store.services
    .filter(x => x.type === trigger.service.type))
  if (!service) { return Promise.resolve() }
  
  const start = new Date()
  const { data } = await axios.default({
    url: `http://${service.address}:${service.port}/${service.type}`,
    method: 'POST',
    data: filterParams(service.config, {
      ...params,
      ...trigger.service.data
    })
  })
  const duration = +new Date() - start
  console.log(`[${service.type}] >> ${JSON.stringify(data)}`)
  return writeLogs({
    address: service.address,
    port: service.port,
    type: service.type,
    trigger: trigger.name
  }, {
    duration: duration,
    error: data.hasOwnProperty('error')
  }, start)
}

module.exports = store => async (req, res) => {
  const triggers = (await fetchAll())
    .filter(trigger => filterMatching(trigger.filters, req.body))
  
  const executionStack = triggers.map(execute(store, req.body))
  try {
    await Promise.all(executionStack)
    res.json({ ok: true })
  } catch (e) {
    res.json({ error: e.message })
  }
}