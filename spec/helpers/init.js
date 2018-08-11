const config = require('config');
const knex = require('knex')(config.db);
const fixtures = require("simple-knex-fixtures");

global.db_init = (done) => {
    return knex('users').delete()
      .then(() => {
        return fixtures.loadFile('spec/fixtures/test_data.json', knex)
      })
      .then(() => {
        return done();
      }).catch((err) => {
        fail(err)
        done();
      });
}
