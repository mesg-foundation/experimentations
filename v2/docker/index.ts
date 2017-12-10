import * as childProcess from 'child_process'
import * as YAML from "js-yaml";
import { writeFileSync } from "fs";

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
  child.on('close', code => code === 0
    ? resolve({ cmd, logs, errors })
    : reject({ cmd, logs, errors }))
})

const deploy = async config => {
  const file = writeFile(config)
  return run('docker', 'stack', 'deploy', '--compose-file', `${process.cwd()}/${file}`, '--prune', 'MESG')
  // return run('docker-compose', '--project-name', 'MESG', '--file', process.cwd() + '/' + file, 'up', '-d')
}

export {
  deploy
}