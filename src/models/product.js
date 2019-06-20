const { Model } = require('objection')

const config = require('config')
const knex = require('knex')(config.db)

Model.knex(knex)

class Product extends Model {
  static get tableName () {
    return 'products'
  }

  static get idColumn () {
    return 'id'
  }
}

module.exports = Product
