const mongoose = require('mongoose');
const {variables} = require('../config/environment');
const log = require('../utils/debug');

module.exports = async () => {

    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected',  () => {
        log.config('mongoose connection done successfully');
    });

    mongoose.connection.on('error',  (err) => {
        log.config('mongoose connection error: ' + err.stack);
    });

    mongoose.connection.on('disconnected', () => {
        log.config('mongoose connection has been lost');
    });

    try {
        await mongoose.connect(variables.database, {useMongoClient: true});
    } catch (e) {}
};