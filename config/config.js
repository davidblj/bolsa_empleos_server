'use strict';

const express               = require('express');
const compression           = require('compression');
const bodyParser            = require('body-parser');
const logger                = require('morgan');
const errorHandler          = require('errorhandler');
const environment           = require('./environment');
const expressValidator      = require('express-validator');

module.exports = function (app) {

    // todo: use the built in body-parser module in express

    app.set('port', environment.port);
    app.use(logger('dev'));
    app.use(express.static('views'));
    app.use(compression());
    app.use(bodyParser.json());
    app.use(expressValidator());
    app.use(bodyParser.urlencoded({extended : false}));
    app.use(errorHandler());
};