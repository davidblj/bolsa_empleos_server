'use strict';

// todo: add a production configuration
let env = process.env.NODE_ENV;
let environment = require(`./environments/${env}`);

module.exports = environment;

