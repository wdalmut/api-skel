const fs     = require('fs'),
      path   = require('path'),
      config = require('config');

module.exports = {
  development: config.db,
  test: config.db,
  production: config.db,
};
