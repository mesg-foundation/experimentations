const express = require('express')
const bodyParser = require('body-parser')
const register = require('./routes/register')
const execute = require('./routes/execute')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const store = {
  services: [],
  connectors: []
}

app.post('/', execute(store))

app.post('/:runnerType/register', register(store))

app.listen(8888, '0.0.0.0')
