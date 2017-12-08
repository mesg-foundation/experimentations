const vm = require('vm')

module.exports = data => vm
  .runInContext(data.code, vm.createContext({
    module,
    console,
    require
  }))(data.payload)
