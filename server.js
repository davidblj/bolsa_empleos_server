let app = require('./app/app');

app.listen(app.get('port'), () => {
    console.log(`Servidor express escuchando en el puerto ${app.get('port')}`);
});