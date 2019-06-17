const { Model } = require('objection')

const config = require('config')
const knex = require('knex')(config.db)

Model.knex(knex)

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get idColumn () {
    return 'id'
  }
}

module.exports = User
