const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  console.log('new request')
  console.log(JSON.stringify(req.body, null, 2))
  res.json({})
})

app.listen(8080, '0.0.0.0')
console.log('server started on port 8080 :)')