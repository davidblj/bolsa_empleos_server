// let express = require('express');

// let app = express();
// require('./config/config')(app);
// require('./endpoints/routes')(app);
let app = require('./app/app');

app.listen(app.get('port'), () => {
    console.log(`Servidor express escuchado en el puerto ${app.get('port')}`);
});