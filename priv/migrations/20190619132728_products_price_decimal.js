
exports.up = (knex, Promise) =>
  knex.schema.alterTable('products', (t) => {
    t.decimal('price').alter() // PRECISION=8 SCALE=2
  })

exports.down = (knex, Promise) => {

}
