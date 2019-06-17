const { compose, bind, tap}
const repo = require('../models/repo/users')
const input = require('../input-filters/users')
const error = require('../views/error')
const view = require('../views/user')

const auth = require('@wdalmut/mini-auth')
const token = require('@wdalmut/token-auth')
const basic = require('@wdalmut/basic-auth')
const one_of = require('@wdalmut/one-of')

// const { from_basic, from_token } = require('../auth')
const { create_filters, append_headers } = require('../utilities/pagination')
const { if_exists } = require('../utilities')

const list = (req, res) => {
  let params = Object.assign({}, {
    page: 1,
    limit: 25,
    orderBy: 'id',
    order: 'ASC',
  }, req.query)
  repo
    .list(params)
    .then(create_filters(params))// ASSOC OFFSET E LIMIT AL RISULTATO DA PASSARE AD APPEND HEADERS(PER SETTARE I VARI CUSTOM HEADERS)
    .then(tap(append_headers(res)))
    .then(compose(bind(res.json, res), view.many))
    .catch(error.generic(res))
}

const get = (req, res) => {
  repo
    .get(req.params.id)
    .then(if_exists)
    .then(compose(bind(res.json, res), view.one))
    .catch(error.generic(res))
}

const create = (req, res) => {
  repo
    .create(req.body)
    .then(compose(bind(res.json, res), view.one))
    .catch(error.generic(res))
}

const patch = (req, res) => {
  repo
    .update(req.params.id, req.body)
    .then(compose(bind(res.json, res), view.one))
    .catch(error.generic(res))
}

let users = require('express').Router()

users.get('/',
  auth(token(me)),
  input.validate_users_input,
  list
)

users.get('/:id',
  auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_user_input,
  get
)

users.post('/',
  auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_create_user_input,
  create
)

users.patch('/:id',
  auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_patch_user_input,
  patch
)

module.exports = users
