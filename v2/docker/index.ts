import * as childProcess from 'child_process'
import * as YAML from "js-yaml";
import { writeFileSync } from "fs";
import dockerCli from "./api";

const writeFile = config => {
  const path = ".docker-compose.tmp.yml"
  writeFileSync(path, YAML.safeDump(config))
  return path
}

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

const sdeploy = async services => {
  console.log(services)
  const file = writeFile({ version: '3', services })
  return run('docker', 'stack', 'deploy', '--compose-file', `${process.cwd()}/${file}`, '--prune', 'MESG')
  // return run('docker-compose', '--project-name', 'MESG', '--file', process.cwd() + '/' + file, 'up', '-d', '--remove-orphans')
}

const deploy = async services => {
  const stack = 'MESG'
  const networks = await dockerCli.networks.all(stack)
  const existingServices = await dockerCli.services.all(stack)
  
  const startedServices = await Promise.all(Object.keys(services)
    .map(async serviceName => dockerCli.services.create(stack, serviceName, {
      ...services[serviceName],
      networkId: networks.map(x => x.Id)[0]
    })))
  return {
    networks,
    services: await dockerCli.services.all(stack),
  }
  
  
  
  // if (!dockerCli.client.info().Swarm.ControlAvailable  ) { RUN(docker swarm init) }

  // // remove all stopped services
  // dockerCli.services.all('MESG')
  //   .filter(x => services.indexOf(x.name) < 0)
  //   .each(x => dockerCli.services.stop(x))

  
  // dockerCli.networks.find('MESG') || dockerCli.networks.create('MESG')

}

export {
  deploy,
  build
}