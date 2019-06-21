const { compose, equals, path, assoc, prop } = require('ramda')

const is_role_user = compose(equals('ROLE_USER'), path(['user', 'role']))
const is_role_admin = compose(equals('ROLE_ADMIN'), path(['user', 'role']))

const assoc_query_params_status_active = compose(assoc('status', 'ACTIVE'), prop('query'))
const assoc_body_status_pending = compose(assoc('status', 'PENDING'), prop('body'))
const assoc_body_status_active = compose(assoc('status', 'ACTIVE'), prop('body'))

const if_user_set_status_query_params = (req, res, next) => {
  // SE IL ROLE È ROLE_USER
  if (is_role_user(req)) {
    // ASSOCIA A STATUS ACTIVE
    req.query = assoc_query_params_status_active(req)
  }

  next()
}

const if_user_set_status_body = (req, res, next) => {
  // SE IL ROLE È ROLE_USER
  if (is_role_user(req)) {
    // ASSOCIA A STATUS PENDING
    req.body = assoc_body_status_pending(req)
  }
  if (is_role_admin(req)) {
    // ASSOCIA A STATUS PENDING
    req.body = assoc_body_status_active(req)
  }

  next()
}

module.exports = {
  is_role_user,
  is_role_admin,
  if_user_set_status_query_params,
  if_user_set_status_body,
}
