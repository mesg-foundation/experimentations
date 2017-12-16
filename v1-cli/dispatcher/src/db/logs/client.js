const Influx = require('influx')

const client = new Influx.InfluxDB({
 host: 'localhost',
 database: 'logs',
 schema: [{
    measurement: 'serviceExecution',
    fields: {
      duration: Influx.FieldType.INTEGER,
      error: Influx.FieldType.BOOLEAN
    },
    tags: [
      'address',
      'port',
      'type',
      'trigger'
    ]
  }]
})

module.exports = client