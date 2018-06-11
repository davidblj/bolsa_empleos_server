const express               = require('express');
const cors                  = require('cors');
const {config, variables}   = require('./environment');
const {bootSetUp}            = require('../utils/directory');

module.exports = function (app) {

    // specific environment app configuration
    config(app);
    app.set('port', variables.port);

    // common middleware
    app.use(cors(variables.origin));
    app.use(express.static('views'));
    app.use(express.static('gallery', {extensions: ['png', 'jpeg']}));
    app.use(express.json());

    // post config
    bootSetUp();
};
