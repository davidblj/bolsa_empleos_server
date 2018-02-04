let express = require('express');

let app = express();

// load configurations
require('../config/config')(app);

// Mongoose client connection
require('../config/mongoose-config')();

// load routes
const routes = require('../routes');
app.use('/', routes);

module.exports = app;
