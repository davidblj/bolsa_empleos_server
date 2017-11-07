let mongoose = require('mongoose');
let _ = require('underscore');
let config = require('../config/index');

module.exports = function(wagner) {

    mongoose.Promise = global.Promise;
    mongoose.connect(config.database, {useMongoClient: true});

    let CompanyUser = mongoose.model('User', require('./company/user'), 'companyUsers');
    let Job = mongoose.model('Job', require('./company/job'), 'jobs');

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