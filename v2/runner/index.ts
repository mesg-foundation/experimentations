import { deploy } from "../docker";
import * as YAML from "js-yaml";
import { readFileSync } from "fs";

const readYAML = file => YAML.safeLoad(readFileSync(file, 'utf8'))

const start = async services => {
  const globalDockerCompose = readYAML('./docker-compose.yml')
  const config = { ...globalDockerCompose }
  services.map(serviceName => {
    const serviceConfig = readYAML(`./services/${serviceName}/config.yml`)
    Object.keys(serviceConfig.services)
      .forEach(service => {
        config.services[[serviceConfig.name, service].join('_')] = {
          ...serviceConfig.services[service],
          depends_on: [
            ...(serviceConfig.services[service].depends_on || [])
              .map(x => [serviceConfig.name, x].join('_')),
            'app',
          ]
        }
      })
  })
  return deploy(config)
}

const stop = async serviceName => {
  const currentDockerCompose = readYAML('./.docker-compose.tmp.yml')
  const config = readYAML(`./services/${serviceName}/config.yml`)

  const newConfig = Object.keys(config.services)
    .forEach(service => {
      delete currentDockerCompose.services[[config.name, service].join('_')]
    })
  return deploy(currentDockerCompose)
}

export default {
  start,
  stop
}