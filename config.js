/**
 *  @fileOverview Contains the environment variables used by the app and the schema to
 *  validate agaist the input.
 *
 *  @author       Billy Marin
 *
 *  @requires     NPM:@hapi/Joi
 *
 */

const env = require('dotenv').config();
if (env.error) {
  throw env.error;
}
const pkg = require('./package');
const Joi = require('@hapi/joi');

exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.APPNAME = pkg.name;
exports.VERSION = pkg.version;

// debug is only active if DEBUG=appname is passed in
exports.debug = require('debug')(exports.APPNAME);

// define the schema of the environment variables
const schema = Joi.object().keys({
  PORT: Joi.number().integer().min(80).max(65535).default(80),
  HOST: Joi.string().hostname().default('0.0.0.0'),
});

// if there is a validation error set _error, else assign env vars. usually we should exit on error.
const result = schema.validate(process.env, {stripUnknown: true});
if (result.error) {
  exports._error = 'Invalid configuration:\n' + result.error.details
      .map((error) => error.message)
      .join('.\n');
} else {
  // do any other processing here on the variables before they are assigned to the exports

  Object.assign(exports, result.value);
}
