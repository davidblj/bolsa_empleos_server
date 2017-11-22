let mongoose = require('mongoose');
let _ = require('underscore');
let config = require('../config/index');

module.exports = function(wagner) {

    mongoose.Promise = global.Promise;
    mongoose.connect(config.database, {useMongoClient: true});

    let CompanyUser = mongoose.model('User', require('./company/user'), 'companyUsers');
    let Applicant = mongoose.model('Applicant', require('./applicant/user'), 'applicants');
    let Job = mongoose.model('Job', require('./company/job'), 'jobs');

    let models = {
        CompanyUser: CompanyUser,
        Applicant: Applicant,
        Job: Job
    };

    _.each(models, function (value, key) {
        wagner.factory(key, function() {
            return value
        })
    });

    return models;
};