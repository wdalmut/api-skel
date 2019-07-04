const Joi = require('@hapi/joi')
const validator = require('express-joi-validation').createValidator({
  passError: true,
})
const disable_convert = { joi: { convert: false, abortEarly: false } }
exports.validate_products_input = validator.query({
  limit: Joi.number().integer().min(1).max(1000),
  page: Joi.number().integer().min(0).max(25),
  order: Joi.string().valid('ASC', 'DESC'),
  orderBy: Joi.string(),
  name: Joi.string().min(1),
  code: Joi.string().min(1),
  exit_date: Joi.date(),
  status: Joi.string().valid(['ACTIVE', 'PENDING']),
  available: Joi.boolean(),
}, disable_convert)

exports.validate_create_product_input = validator.body({
  name: Joi.string().min(1).required(),
  code: Joi.string().min(1).required(),
  exit_date: Joi.date().options({ convert: true }).allow(null),
  available: Joi.boolean().allow(null),
  price: Joi.number().precision(8).allow(null),
}, disable_convert)

exports.validate_patch_product_role_admin_input = validator.body({
  name: Joi.string().min(1),
  code: Joi.string().min(1),
  exit_date: Joi.date().allow(null),
  status: Joi.string().valid(['ACTIVE', 'PENDING']),
  available: Joi.boolean().allow(null),
  price: Joi.number().precision(8).allow(null),
}, disable_convert)

exports.validate_patch_product_role_user_input = validator.body({
  name: Joi.string().min(1),
  code: Joi.string().min(1),
  exit_date: Joi.date().allow(null),
  available: Joi.boolean().allow(null),
  price: Joi.number().precision(8).allow(null),
}, disable_convert)
