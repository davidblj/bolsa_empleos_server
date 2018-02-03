/** Common logging to debug a function or module logic
 * @memberof debug
 * @function
 * @param {String} message - the message to log
 * */
const common = require('debug')('app:logging');

/** App configuration logging to debug the app startup process
 * @memberof debug
 * @function
 * @param {String} message - the config message to log
 * */
const config = require('debug')('app:configuration');

/** Error logging to highlight thrown errors at
 * @memberof debug
 * @function
 * @param {String} message - the error message to log
 * */
const error = require('debug')('app:error');

/**
 * debug exposes logging utilities that should be exclusive to the dev environment. That is, when the app is run
 * with the config variable "NODE_ENV=development", one must define "DEBUG=app:*" which will enable a logging that
 * is printed by modules (common, config , error). Checkout the debug library and its module management at:
 * {@link https://github.com/visionmedia/debug#wildcards}
 *
 * @module debug
 * */
module.exports = {
    common: common,
    config: config,
    error: error
};