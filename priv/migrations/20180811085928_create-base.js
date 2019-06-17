
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.charset('utf8')
    t.collate('utf8_general_ci')
    t.increments('id').unsigned().primary()
    t.string('firstname').notNull()
    t.string('lastname')
    t.string('username').notNull()
    t.date('birthday')
    t.string('role').notNull()
    t.boolean('married')
    t.dateTime('created_at').notNull()
    t.dateTime('edited_at').nullable()
  })
}

exports.down = function (knex, Promise) {
}
