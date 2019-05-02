const { assoc, ifElse, isNil, bind } = require('ramda')

const resolve = bind(Promise.resolve, Promise)
const reject = bind(Promise.reject, Promise)
const reject_because_already_exists = (user) => reject({ status: 409, message: 'Already exists' })

const User = require('../user')

module.exports = {
  list: (params) => {
    return User.query()
  },
  get: (id) => {
    return User.query().where({ id }).first()
  },
  create: (body) => {
    return User.query().where({ username: body.username }).first()
      .then(ifElse(isNil, resolve, reject_because_already_exists))
      .then(() => User.query().insert(assoc('created_at', new Date(), body)))
      .then((user) => User.query().where({ id: user.id }).first())
  },
  update: (id, content) => {
    content = assoc('updated_at', new Date(), content)

    return User.query().where({ username: content.username }).whereNot({ id }).first()
      .then(ifElse(isNil, resolve, reject_because_already_exists))
      .then(() => User.query().where({ id: id }).patch(content))
      .then(() => User.query().where({ id }).first())
  },
}
