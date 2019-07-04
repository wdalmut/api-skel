const { map, pick, compose, evolve, flip, __ } = require('ramda')
const { format } = require('date-fns')
const { itLocale } = require('date-fns/locale/it')
const { if_not_null_convert } = require('../utilities')

const fields = ['id', 'name', 'code', 'exit_date', 'status', 'available', 'price', 'picture', 'created_at', 'edited_at']

const cast_date_format = flip(format)('YYYY-MM-DD', __, { locale: itLocale })
const cast_date_time_format = flip(format)('YYYY-MM-DD HH:mm:ss', __, { locale: itLocale })

const trasformation = {
  // attachments: stringify,
  price: if_not_null_convert(parseFloat),
  available: if_not_null_convert(Boolean),
  exit_date: if_not_null_convert(cast_date_format),
  created_at: if_not_null_convert(cast_date_time_format),
  edited_at: if_not_null_convert(cast_date_time_format),
}
module.exports = {
  one: compose(evolve(trasformation), pick(fields)),
  many: map(compose(evolve(trasformation), pick(fields))),
}
