const serviceFactory = require('lib')
const express = require('express')
const bodyParser = require('body-parser')
const nodeFetch = require('node-fetch')

const webhook = async ({ url, headers, data }, { webhookSent, request }) => {
  console.log('passe', url, headers, data)
  const response = await nodeFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  })
  const result = await response.text()
  webhookSent({
    body: result,
    code: response.status
  })
}

serviceFactory({
  webhook
}, ({ request }) => express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .post('/', (req, res) => res.json(request({
    ip: req.ip,
    body: req.body
  })))
  .listen(8080, '0.0.0.0'))