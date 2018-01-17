let app = require('./app/app');

app.listen(app.get('port'), () => {
    console.log(`express server listening on port: ${app.get('port')}`);
});