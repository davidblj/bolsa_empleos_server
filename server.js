const app = require('./app/app');
const log = require('./utils/debug');

app.listen(app.get('port'), () => {
    log.config(`express server listening on port: ${app.get('port')}`);
});