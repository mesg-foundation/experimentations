const express = require('express')
const bodyParser = require('body-parser')
const requestId = require('express-request-id')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(requestId())

app.post('/', (req, res) => {
  console.log('passe')
  axios.default({
    method: 'POST',
    url: 'http://eth-dispatcher.ngrok.io',
    data: {
      id: req.id,
      from: [req.ip, req.headers['user-agent']].join(' - '),
      executedAt: Date.now(),
      payload: req.body
    }
  })
    .then(({ data }) => res.json(data))
})

app.listen(8080, '0.0.0.0')
