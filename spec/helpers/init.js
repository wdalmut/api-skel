const config = require('config')
const knex = require('knex')(config.db)

const user_role_admin = {
  id: 1,
  username: 'admin@gmail.com',
  role: 'ROLE_ADMIN',
}
const user_role_user = {
  id: 2,
  username: 'user@gmail.com',
  role: 'ROLE_USER',
}
const mock = require('mock-require')

mock('../../src/microservices/auth', (token) => {
  if (token === 'admin') {
    return Promise.resolve(user_role_admin)
  }
  if (token === 'user') {
    return Promise.resolve(user_role_user)
  }
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
