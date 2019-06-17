
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { 'id': 1, 'firstname': 'Walter', 'username': 'wdalmut', 'role': 'ROLE_ADMIN', 'created_at': '2018-01-01T00:00:00.000Z', 'edited_at': null },
        { 'id': 2, 'firstname': 'Walter', 'username': 'gmittica',  'role': 'ROLE_ADMIN', 'created_at': '2018-01-01T00:00:00.000Z', 'edited_at': null },
        { 'id': 3, 'firstname': 'Stefano', 'username': 'sadamo', 'role': 'ROLE_USER', 'created_at': '2018-01-01T00:00:00.000Z', 'edited_at': null },
        { 'id': 4, 'firstname': 'Andrea', 'username': 'adiblasi',  'role': 'ROLE_USER', 'created_at': '2018-01-01T00:00:00.000Z', 'edited_at': null },
      ])
    })
}
