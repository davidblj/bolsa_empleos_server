const logger = require('morgan');

const config = (app) => {
    app.use(logger('dev'));
};

const variables = {
    'secret':  'dev-key',
    'port': process.env.PORT || 3000,
    'database': 'mongodb://localhost:27017/bolsa-de-empleos',
    'origin': 'http://localhost:4200'
};

module.exports = {
    config: config,
    variables: variables
};
