exports.up = (knex, Promise) =>
  knex.schema.alterTable('products', (t) => {
    t.decimal('price', 10, 8).alter()
  })

exports.down = (knex, Promise) => {

}
