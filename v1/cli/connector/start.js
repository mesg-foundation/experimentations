const { readFileSync, writeFileSync, existsSync, mkdirSync, exists } = require('fs')
const { safeLoad, safeDump } = require('js-yaml')
const { spawn } = require('child_process')
const register = require('../register')

const TMP_FOLDER = './.connectors'

const ensureFolder = path => path.split('/').reduce((prev, current) => {
  const folder = [prev, current].filter(x => x).join('/')
  if (!existsSync(folder)) { mkdirSync(folder) }
  return folder
}, '')

const run = async connector => {

  register('connectors', {
    type: connector
  })

  const executionFolder = `${TMP_FOLDER}/${connector}`
  if (!existsSync(`../connectors/${connector}/config.yml`)) {
    throw new Error(`Connector '${connector}' invalid`)
  }
  const { run } = safeLoad(readFileSync(`../connectors/${connector}/config.yml`, 'utf8'))

  ensureFolder(executionFolder)
  writeFileSync(`${executionFolder}/docker-compose.yml`, safeDump(run), 'utf8')  

  const exec = spawn(`docker-compose`, [
    '--project-name', connector,
    'up', '-d'
  ], {
    cwd: executionFolder
  })
  
  exec.on('close', (code) => {
    console.log(`== Connector "${connector}" started`)
  })
}

run(process.argv[2])
  .catch(console.error)