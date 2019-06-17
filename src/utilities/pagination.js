const { compose, curry, assoc } = require('ramda')

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