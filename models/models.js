let mongoose = require('mongoose');
let _ = require('underscore');
let config = require('../config/index');

module.exports = function(wagner) {

    mongoose.Promise = global.Promise;
    mongoose.connect(config.database, {useMongoClient: true});

    // todo: change "User" to "CompanyUser"
    let User = mongoose.model('User', require('./organizacion/user'), 'users');
    let Job = mongoose.model('Job', require('./organizacion/job'), 'jobs');

    let models = {
        User: User,
        Job: Job
    };

    _.each(models, function (value, key) {
        wagner.factory(key, function() {
            return value
        })
    });

    return models;
};