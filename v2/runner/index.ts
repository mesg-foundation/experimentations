import { deploy } from "../docker";
import * as YAML from "js-yaml";
import { readFileSync } from "fs";

const readYAML = file => YAML.safeLoad(readFileSync(file, 'utf8'))

const servicesFor = serviceName => {
  const config = readYAML(`./services/${serviceName}/config.yml`)
  return Object.keys(config.services)
    .reduce((acc, service) => ({
      ...acc,
      [`${config.name}_${service}`]: {
        ...config.services[service],
        ...config.services[service].depends_on
          ? { depends_on: (config.services[service].depends_on || []).map(x => `${config.name}_${x}`) }
          : null
      }
    }), {})
}

const start = async services => {
  return deploy({
    version: "3",
    services: services.reduce((acc, serviceName) => ({
      ...acc,
      ...servicesFor(serviceName)
    }), {})
  })
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