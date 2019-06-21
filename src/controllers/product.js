const { compose, bind, tap, prop, assoc, mergeDeepLeft, ifElse } = require('ramda')

const repo = require('../models/repo/products')
const input = require('../input-filters/product')
const error = require('../views/error')
const view = require('../views/product')

// AUTH
const auth = require('@wdalmut/mini-auth')
const token = require('@wdalmut/token-auth')
const me = require('../microservices/auth')

// UTILITIES
const { create_filters, append_headers } = require('../utilities/pagination')
const { is_role_admin, if_user_set_status_query_params, if_user_set_status_body } = require('../auth')

const list = (req, res) => {
  let params = compose(
    mergeDeepLeft(req.query),
    assoc('page', 1),
    assoc('limit', 25),
    assoc('orderBy', 'id'),
    assoc('order', 'ASC'),
  )({})

  repo
    .list(params)
    .then(create_filters(params))// ASSOC OFFSET E LIMIT AL RISULTATO DA PASSARE AD APPEND HEADERS(PER SETTARE I VARI CUSTOM HEADERS)
    .then(tap(append_headers(res)))
    .then(prop('results'))
    .then(compose(bind(res.json, res), view.many))
    .catch(error.generic(res))
}

const get = (req, res) => {
  let params = req.query
  repo
    .get(req.params.id, params)
    .then(compose(bind(res.json, res), view.one))
    .catch(error.generic(res))
}

const create = (req, res) => {
  repo
    .create(req.body)
    .then(compose(bind(res.status(201).json, res), view.one))
    .catch(error.generic(res))
}

const patch = (req, res) => {
  repo
    .update(req.params.id, req.body)
    .then(compose(bind(res.json, res), view.one))
    .catch(error.generic(res))
}

let products = require('express').Router()

products.get('/',
  auth(token(me)),
  input.validate_products_input,
  if_user_set_status_query_params,
  list
)

products.get('/:id',
  auth(token(me)),
  if_user_set_status_query_params,
  get
)

products.post('/',
  auth(token(me)),
  input.validate_create_product_input,
  if_user_set_status_body,
  create
)

products.patch('/:id',
  auth(token(me)),
  ifElse(is_role_admin, input.validate_patch_product_role_admin_input, input.validate_patch_product_role_user_input),
  patch
)

module.exports = products
