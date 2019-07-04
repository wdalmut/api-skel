const get = (req, res) => {
  res.json('OK')
}

let ping = require('express').Router()

ping.get('/', get)

module.exports = ping
