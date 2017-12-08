const express = require('express')
const bodyParser = require('body-parser')
const register = require('../register')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const services = {}

const serviceFile = service => `../../services/${service}/index.js`

const loadService = async service => {
  if (!services[service]) {
    services[service] = require(serviceFile(service))
  }
  return services[service]
}

register('services', {
  port: 60000,
  type: process.argv[2].split(',')
})

app.post('/:service', async (req, res) => {
  try {
    console.log(`[CLI] Executing service ${req.params.service}`)
    const service = await loadService(req.params.service)
    const result = await service(req.body)
    return res.json(result)
  } catch (e) {
    return res.json({ error: e.message })
  }
})

app.listen(60000, '0.0.0.0')
