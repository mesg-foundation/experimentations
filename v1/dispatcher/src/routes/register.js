const { safeLoad } = require('js-yaml')
const { readFileSync } = require('fs')

module.exports = async () => readdirSync(PATH)
  .filter(x => x.endsWith('.yml'))
  .map(x => safeLoad(readFileSync(`${PATH}/${x}`, 'utf-8')))

const config = (type, service) => safeLoad(readFileSync(`../${type}/${service}/config.yml`, 'utf-8'))

module.exports = store => (req, res) => {
  const services = req.body.type
  const runnerType = req.params.runnerType
  services.forEach(service => {
    store[runnerType].push({
      address: req.ip,
      port: req.body.port || 80,
      type: service,
      config: config(runnerType, service)
    })
  })
  return res.json({
    ok: true
  })
}