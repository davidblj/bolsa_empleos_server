// libraries
const express = require('express');
const router = express.Router();
const log = require('../utils/debug');

// routes
const candidates = require('./candidates');
const jobs = require('./jobs');

// todo(1): handle errors that are not an instance of Error (500)

router.use('/candidates', candidates);

router.use((err, req, res, next) => {
   if (err.stack) log.error(err.stack);
   res.status(err.status || 400).json({ error: err.message || err.toString()});
});

module.exports = router;