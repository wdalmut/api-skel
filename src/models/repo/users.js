const { assoc, ifElse, isNil } = require('ramda')

const { if_exists, if_already_exists } = require('../../utilities')
const User = require('../user')

module.exports = {
  list: (params) => {
    let query = Request.query()

    return query
      .page(params.page - 1, params.limit)
      .orderBy(params.orderBy, params.order)
      .where(omit(['limit', 'offset', 'orderBy', 'page', 'order'], params))
  },
  get: (id) => {
    const query = User.query()

    query()
      .where({ id })
      .first()

    return query.then(if_exists)
  },
  create: (body) => {
    return User.query().where({ username: body.username }).first()
      .then(if_already_exists)
      .then(() => User.query().insert(assoc('created_at', new Date(), body)))
      .then((user) => User.query().where({ id: user.id }).first())
  },
  update: (id, content) => {
    content = assoc('edited_at', new Date(), content)

    return User.query().where({ username: content.username }).whereNot({ id }).first()
      .then(if_already_exists)
      .then(() => User.query().where({ id }).patch(content))
      .then(() => User.query().where({ id }).first())
  },
}
