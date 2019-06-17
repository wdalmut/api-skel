const {map, compose, pick} = require('ramda')

const fields = ['id', 'username', 'created_at', 'edited_at']

module.exports = {
  one: pick(fields),
  many: map(pick(fields)),
}
