const config = require('config')
const knex = require('knex')(config.db)

const user = {
  id: 1,
  username: 'test-user@gmail.com',
}
const mock = require('mock-require')
mock('../../src/auth', {
  from_basic: (username, password) => Promise.resolve(user),
  from_token: (token) => Promise.resolve(user),
})

global.db_init = (done) => {
  return knex.seed
    .run().then(() => {
      return done()
    }).catch((err) => {
      if (err) {
        throw err
      }

      done()
    })
}
