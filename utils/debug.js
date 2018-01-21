const common = require('debug')('app:logging');
const config = require('debug')('app:configuration');
const error = require('debug')('app:error');

module.exports = {
    common: common,
    config: config,
    error: error
};