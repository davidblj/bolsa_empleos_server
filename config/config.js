'use strict';

const express               = require('express');
const bodyParser            = require('body-parser');
const logger                = require('morgan');
const environment           = require('./environment');

module.exports = function (app) {

    // todo: use the built in body-parser module in express

    app.set('port', environment.port);
    app.use(logger('dev'));
    app.use(express.static('views'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : false}));
};