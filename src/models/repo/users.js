const { assoc, ifElse, isNil, bind } = require('ramda');

const config = require('config');
const knex = require('knex')(config.db);

const resolve = bind(Promise.resolve, Promise)
const reject = bind(Promise.reject, Promise)
const reject_because_already_exists = (user) => reject({status: 409, message: 'Already exists'})

module.exports = {
  list: (params) => {
    return knex('users');
  },
  get: (id) => {
    return knex('users').where({id}).first();
  },
  create: (body) => {
    return knex('users').where({username: body.username}).first()
      .then(ifElse(isNil, resolve, reject_because_already_exists))
      .then(() => knex('users').insert(assoc('created_at', new Date(), body)))
      .then((data) => knex('users').where({id: data.pop()}).first())
    ;
  },
  update: (id, content) => {
    content = assoc('updated_at', new Date(), content);

    return knex('users').where({ username: content.username }).whereNot({ id }).first()
      .then(ifElse(isNil, resolve, reject_because_already_exists))
      .then(() => knex('users').where({ id: id }).update(content))
      .then(() => knex('users').where({id}).first())
    ;
  },
};
