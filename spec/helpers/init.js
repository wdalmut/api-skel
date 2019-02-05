const config = require('config');
const knex = require('knex')(config.db);

global.db_init = (done) => {
    return knex.seed
      .run().then(() => {
        return done();
      }).catch((err) => {
        fail(err)
        done();
      });
}
