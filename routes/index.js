// libraries
const express = require('express');
const router = express.Router();
const log = require('../utils/debug');

// routes
const search = require('./search');
const session = require('./session');
const candidates = require('./candidates');
const candidate = require('./candidate');
const company = require('./company');
const companies = require('./companies');
const jobs = require('./jobs');
const signUp = require('./sign-up-check');

// todo(1): unexpected error handling
// todo(2): handle a non json request

// endpoints

// authentication
router.use('/session', session);

// candidates
router.use('/candidate', candidate);
router.use('/candidates', candidates);

// companies
router.use('/company', company);
router.use('/companies', companies);

// jobs
router.use('/jobs', jobs);

// search
router.use('/search', search);

// sign up check
router.use('/sign-up-check', signUp);

// error handling
router.use((err, req, res, next) => {
   if (err.stack) log.error(err.stack);
   res.status(err.status || 400).json({ error: err.message || err.toString()});
});

module.exports = router;
