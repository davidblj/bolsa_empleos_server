'use strict';

let env = process.env.NODE_ENV;
let environment = require(`./environments/${env}`);

module.exports = environment;

