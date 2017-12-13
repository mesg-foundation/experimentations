import * as childProcess from 'child_process'
import * as YAML from "js-yaml";
import { writeFileSync } from "fs";
import dockerCli from "./api";

const stack = 'MESG'

const run = (command, ...args) => new Promise((resolve, reject) => {
  const cmd = `${command} ${args.join(' ')}`
  const logs = []
  const errors = []
  const child = childProcess.spawn(command, args)
  child.stdout.on('data', x => logs.push(x.toString()))
  child.stderr.on('data', x => logs.push(x.toString()))
  child.on('error', x => errors.push(x.toString()))
  child.on('close', code => {
    return code === 0
      ? resolve({ cmd, logs, errors })
      : reject({ cmd, logs, errors })
  })
})

const build = async (path, name) => {
  return run('docker', 'build', '-t', `mesg/${name}`, path)
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
    .filter(x => !services[x.Spec.Name.replace(`${stack}_`, '')] && x.Spec.Labels['com.docker.stack.image'] !== 'mesg/runner')
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