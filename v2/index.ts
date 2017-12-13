import * as express  from "express";
import * as bodyParser  from "body-parser";
import Runner from "./runner";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const toArray = val => Array.isArray(val) 
  ? val
  : val.split(',')

;['start', 'build']
  .map(action => app.post(`/${action}`, async (req, res) => {
    try {
      const result = await Runner[action](toArray(req.body.service))
      res.json(result)
    } catch (e) {
      res.json(e).status(500)
    }
  }))

app.listen(process.env.PORT || 60001)
