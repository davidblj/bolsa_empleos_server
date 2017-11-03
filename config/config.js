'use strict';

const compression           = require('compression');
const bodyParser            = require('body-parser');
const logger                = require('morgan');
const errorHandler          = require('errorhandler');
let   expressValidator      = require('express-validator');

module.exports = function (app) {

    // todo: use the built in body-parser module in express

    app.set('port', process.env.PORT || 3000);

    app.use(compression());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(expressValidator());
    app.use(bodyParser.urlencoded({extended : false}));
    app.use(errorHandler());
};