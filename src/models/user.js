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

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['username', 'created_at'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        created_at: { type: 'datetime' },
        updated_at: { type: 'datetime' },
      },
    }
  }
}

module.exports = User
