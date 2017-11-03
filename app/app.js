let express = require('express');

let app = express();
require('../config/config')(app);
require('../endpoints/routes')(app);

module.exports = app;