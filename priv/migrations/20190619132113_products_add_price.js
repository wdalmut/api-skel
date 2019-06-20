
exports.up = (knex, Promise) =>
  knex.schema.alterTable('products', (t) => {
    t.integer('price').notNull()
  })

exports.down = (knex, Promise) => {

}
