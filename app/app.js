let express = require('express');

let app = express();
require('../config/config')(app);
require('../endpoints/routes')(app);

app.get('/', (req, res) => {
	return res.status(200).json({'hola': 'heroku'});
})

module.exports = app;