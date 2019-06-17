const { bind, identity, ifElse, isNil, not, compose, always, curry, assoc, reduce, keys } = require('ramda')

const reject = bind(Promise.reject, Promise)
const exists = compose(not, isNil)

// 409
const reject_with_406 = compose(reject, always({ status: 406, message: 'Not acceptable' }))

const reject_because_already_exists = compose(reject, always({ status: 409, message: 'Already exist' }))
// 404
const reject_because_not_exists = compose(reject, always({ status: 404, message: 'Not found' }))

const reject_because_forbidden = compose(reject, always({ status: 403, message: 'Forbidden' }))

const reject_because_server_unavaible = compose(reject, always({ status: 503, message: 'Server unavaible' }))

const if_exists = ifElse(exists, identity, reject_because_not_exists)

const if_already_exists = ifElse(exists, reject_because_already_exists, identity)

const if_authorized = ifElse(exists, identity, reject_because_forbidden)

const append_headers = curry((res, params) => {
  let page = parseInt(params.offset) / parseInt(params.limit) + 1
  return res
    .set('x-total', params.total)
    .set('x-page', page)
    .set('x-count', params.results.length)
    .set('x-limit', params.limit)
    .set('x-from', (page - 1) * parseInt(params.limit))
    .set('x-to', ((page - 1) * parseInt(params.limit)) + params.results.length)
})

const create_filters = curry((params, results) => {
  return compose(
    assoc('offset', parseInt(params.page) * parseInt(params.limit)),
    assoc('limit', parseInt(params.limit))
  )(results)
})

const is_not_admin = req => {
  if (req.user.role !== 'ROLE_ADMIN') {
    return true
  }

  return false
}

const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

module.exports = {
  reject_with_406,
  reject_because_already_exists,
  reject_because_forbidden,
  reject_because_not_exists,
  if_exists,
  if_authorized,
  if_already_exists,
  reject_because_server_unavaible,
  exists,
  is_not_admin,
  append_headers,
  create_filters,
  renameKeys,
}
