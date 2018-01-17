let mongoose = require('mongoose');
let config = require('../config/environment');

module.exports = async () => {

    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected',  () => {
        console.log('mongoose connection done successfully');
    });

    mongoose.connection.on('error',  (err) => {
        console.log('mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected',  () => {
        console.log('mongoose connection has been lost');
    });

    try {
        await mongoose.connect(config.database, {useMongoClient: true});
    } catch (e) {}
};