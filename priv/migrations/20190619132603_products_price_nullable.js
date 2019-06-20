
exports.up = (knex, Promise) =>
  knex.schema.alterTable('products', (t) => {
    t.integer('price').alter()
  })

exports.down = (knex, Promise) => {

}
