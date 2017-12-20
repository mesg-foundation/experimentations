import * as YAML from "js-yaml";
import { writeFileSync } from "fs";
import dockerCli from "./api";

const stack = 'MESG'

const build = async (path, name) => {
  return dockerCli.images.build(path, `mesg/${name}`)
}

const startService = networks =>  async (name, config) => {
  return dockerCli.services.create(stack, name, {
    ...config,
    networkId: networks.map(x => x.Id)[0]
  })
}

const deploy = async services => {
  const networks = await dockerCli.networks.all(stack)
  const startServiceWithNetwork = startService(networks)
  const existingServices = await dockerCli.services.all(stack)
  const servicesToStart = Object.keys(services)
    .filter(x => !existingServices.find(y => y.Spec.Name === [stack, x].join('_')))
  const servicesToStop = existingServices
    .filter(x => !services[x.Spec.Name.replace(`${stack}_`, '')])
    .filter(x => x.Spec.Labels['com.docker.stack.image'] !== 'mesg/runner')
    .filter(x => x.Spec.Labels['com.docker.stack.image'] !== 'rabbitmq')
  return {
    stoppedServices: await Promise.all(servicesToStop
      .map(x => dockerCli.services.stop(x.ID))),
    startedServices: await Promise.all(servicesToStart
      .map(x => startServiceWithNetwork(x, services[x])))
  }
}

export {
  deploy,
  build
}