import { deploy, build } from "../docker";
import * as YAML from "js-yaml";
import { readFileSync } from "fs";

const readYAML = file => YAML.safeLoad(readFileSync(file, 'utf8'))

const servicesFor = serviceName => {
  const config = readYAML(`./services/${serviceName}/config.yml`)
  return Object.keys(config.services)
    .reduce((acc, service) => {
      const containerConf = config.services[service]
      return {
        ...acc,
        [`${config.name}_${service}`]: {
          ...containerConf,
          ...containerConf.volumes
            ? { volumes: (containerConf.volumes || []).map(x => `~/.mesg/${config.name}/${service}:${x.split(':').reverse()[0]}`) }
            : null
        }
      }
    }, {})
}

const start = async services => {
  return deploy(services
    .reduce((acc, serviceName) => ({
      ...acc,
      ...servicesFor(serviceName)
    }), {})
  )
}

export default {
  start,
  build: async services => Promise.all(services
    .map(service => build(`./services/${service}`, service)))
}