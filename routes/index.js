// libraries
const express = require('express');
const router = express.Router();
const log = require('../utils/debug');

// routes
const session = require('./session');
const candidates = require('./candidates');
const candidate = require('./candidate');
const jobs = require('./jobs');

// todo(1): handle errors that are not an instance of Error (500)

router.use('/session', session);
router.use('/candidates', candidates);
router.use('/candidate', candidate);

router.use((err, req, res, next) => {
   if (err.stack) log.error(err.stack);
   res.status(err.status || 400).json({ error: err.message || err.toString()});
});

module.exports = router;