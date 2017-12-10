import * as express  from "express";
import * as bodyParser  from "body-parser";
import Runner  from "./runner";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const toArray = val => Array.isArray(val) 
  ? val
  : val.split(',')

app.post('/start', async (req, res) => {
  const result = await Runner.start(toArray(req.body.service))
  res.json(result)
})

app.post('/stop', async (req, res) => {
  const result = await Runner.stop(toArray(req.body.service))
  res.json(result)
})

app.listen(process.env.PORT || 60001)
