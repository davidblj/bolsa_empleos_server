'use strict';

let wagner = require('wagner-core');
require('../models/models')(wagner);

module.exports = function (app) {

    app.use('/organizacion', require('../routes/organizacion')(wagner));
    
};