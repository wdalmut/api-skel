
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { "id": 1, "username": "wdalmut", "created_at": "2018-01-01T00:00:00.000Z", "updated_at": null },
        { "id": 2, "username": "gmittica", "created_at": "2018-01-01T00:00:00.000Z", "updated_at": null },
      ]);
    });
};

