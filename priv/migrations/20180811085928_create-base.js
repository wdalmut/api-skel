
exports.up = function (knex, Promise) {
  return knex.schema.createTable('products', function (t) {
    t.charset('utf8')
    t.collate('utf8_general_ci')
    t.increments('id').unsigned().primary()
    t.string('name').notNull()
    t.string('code').notNull()
    t.date('exit_date')
    t.string('status').notNull()
    t.bool('available')
    t.dateTime('created_at').notNull()
    t.dateTime('edited_at').nullable()
  })
}

exports.down = function (knex, Promise) {
}
