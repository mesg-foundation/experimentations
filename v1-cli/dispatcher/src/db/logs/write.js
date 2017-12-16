const client = require('./client')

module.exports = (tags, fields, timestamp) => client
  .writeMeasurement('serviceExecution', [{
    fields,
    tags,
    timestamp
  }])