import * as express  from "express";
import * as bodyParser  from "body-parser";
import * as amqp from "amqplib/callback_api";
import Runner from "./runner";
import { promisify } from "util";

const toArray = val => Array.isArray(val) ? val : val.split(',')

const start = async () => {
  const app = express()
  const connection = await promisify(amqp.connect)('amqp:rabbitmq')
  const channel = await connection.createChannel()
  const services = {}

  const registerService = ({ config, publicKey }) => {
    console.log('register service', config.name)
    services[config.name] = {
      config,
      publicKey
    }
    Object.keys(config.events || [])
      .map(event => {
        const queue = [publicKey, event].join(':')
        channel.assertQueue(queue, { durable: false })
        channel.consume(queue, ({ content }) => {
          console.log(`receive event ${event} from ${publicKey}: ${JSON.stringify(content.toString())}`)
        })
      })
    Object.keys(config.commands || [])
      .map(command => {
        const queue = [publicKey, command].join(':')
        channel.assertQueue(queue, { durable: false })
      })
  }

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.post('/start', (req, res) => Runner
    .start(toArray(req.body.service))
    .then(res.json))
    
  app.post('/build', (req, res) => Runner
    .build(toArray(req.body.service))
    .then(res.json))

  app.post('/exec', (req, res) => {
    const { config, publicKey } = services[req.body.service]
    res.json(channel.sendToQueue([publicKey, req.body.command].join(':'), new Buffer(req.body.arguments)))
  })

  channel.assertQueue('registration', { durable: false })
  channel.consume(
    'registration', 
    ({ content }) => registerService(JSON.parse(content.toString())),
    { noAck: true }
  )

  app.listen(process.env.PORT || 60001)
  console.log('MESG server ready')  
}

start()