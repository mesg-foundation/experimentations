const { safeLoad } = require('js-yaml')
const { readdirSync, readFileSync } = require('fs')

const PATH = '../triggers'

module.exports = async () => readdirSync(PATH)
  .filter(x => x.endsWith('.yml'))
  .map(x => safeLoad(readFileSync(`${PATH}/${x}`, 'utf-8')))
