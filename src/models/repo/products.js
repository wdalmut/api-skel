const { assoc, omit } = require('ramda')

const { if_exists, if_already_exists } = require('../../utilities/errors_code')
const Product = require('../product')

module.exports = {
  list: (params) => {
    let query = Product.query()

    return query
      .page(params.page - 1, params.limit)
      .orderBy(params.orderBy, params.order)
      .where(omit(['limit', 'offset', 'orderBy', 'page', 'order'], params))
  },
  get: (id) => {
    const query = Product.query()

    query
      .where({ id })
      .first()

    return query.then(if_exists)
  },
  create: (body) => {
    return Product.query().where({ code: body.code }).first()
      .then(if_already_exists)
      .then(() => Product.query().insert(assoc('created_at', new Date(), body)))
      .then((product) => Product.query().where({ id: product.id }).first())
  },
  update: (id, body) => {
    return Product.query().where({ code: body.code }).whereNot({ id }).first()
      .then(if_already_exists)
      .then(() => Product.query().where({ id }).patch(assoc('edited_at', new Date(), body)))
      .then(() => Product.query().where({ id }).first())
  },
}
