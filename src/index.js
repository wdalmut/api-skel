const cors = require('cors')
const express = require('express')
const pino = require('express-pino-logger')({
  name: process.env.APP_NAME,
  base: {
    region: process.env.AWS_REGION,
    env: process.env.NODE_ENV,
  },
  enabled: !(process.env.NODE_ENV === 'test'),
})
const bodyParser = require('body-parser')
const actions = require('./controllers')

const app = express()
app.use(pino)

app.use(cors({
  exposedHeaders: ['x-page', 'x-count', 'x-total', 'x-limit', 'x-to', 'x-from'],
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text({ type: 'text/plain' }))
app.use(bodyParser.json({ type: 'application/json' }))

actions.map((paths) => app.use.apply(app, paths))

app.listen(process.env.NODE_PORT || 3000)

module.exports = app // for testing
