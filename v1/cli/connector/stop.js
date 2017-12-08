const { spawn } = require('child_process')

const TMP_FOLDER = './.connectors'

const run = async connector => spawn(`docker-compose`, ['stop'], {
  cwd: `${TMP_FOLDER}/${connector}`
})
  .on('close', (code) => {
    console.log(`== Connector "${connector}" stoped`)
  })

run(process.argv[2])