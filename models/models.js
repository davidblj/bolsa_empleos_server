let mongoose = require('mongoose');
let _ = require('underscore');
let config = require('../config/index');

module.exports = function(wagner) {

    mongoose.Promise = global.Promise;
    mongoose.connect(config.database, {useMongoClient: true});

    // todo: change "User" to "CompanyUser"
     let CompanyUser = mongoose.model('User', require('./organizacion/user'), 'companyUsers');
    let Job = mongoose.model('Job', require('./organizacion/job'), 'jobs');

    let models = {
        CompanyUser: CompanyUser,
        Job: Job
    };

    _.each(models, function (value, key) {
        wagner.factory(key, function() {
            return value
        })
    });

    return models;
};