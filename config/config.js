'use strict';

const express               = require('express');
const {config, variables}   = require('./environment');

module.exports = function (app) {

    // specific environment app configuration
    config(app);
    app.set('port', variables.port);

    // common middleware
    app.use(express.static('views'));
    app.use(express.json());
};