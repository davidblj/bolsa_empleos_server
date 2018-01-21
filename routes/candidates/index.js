// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();
const jobs = require('./jobs');

// controllers
const createCandidate = require(process.cwd() + '/controllers/candidates/createCandidate');

router.post('/', handler(createCandidate, status.CREATED,
    (req, res, next) => [req.body]
));

router.use('/:userId/jobs',jobs);

module.exports = router;
