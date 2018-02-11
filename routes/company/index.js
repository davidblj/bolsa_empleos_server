// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();
const jobs = require('./jobs');

// middleware
const authentication = require(process.cwd() + '/middleware/authentication');

router.use('/', authentication(['company']));

router.use('/jobs', jobs);

module.exports = router;
