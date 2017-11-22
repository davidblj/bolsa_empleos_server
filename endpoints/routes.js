'use strict';

let wagner = require('wagner-core');
require('../models/models')(wagner);

module.exports = function (app) {

    app.use('/company', require('../routes/company')(wagner));
    app.use('/applicant', require('../routes/applicant')(wagner));
    app.use('/guest', require('../routes/guest')(wagner));
};