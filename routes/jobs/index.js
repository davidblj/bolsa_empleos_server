// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// middleware
const idParsing = require(process.cwd() + '/middleware/id-parsing');

// controllers
const getJob = require(process.cwd() + '/controllers/jobs/getJob');

router.use('/:jobId', idParsing('jobId',
    (req, res, next) => req.params.jobId)
);

router.get('/:jobId', handler(getJob, status.OK,
    (req, res, next) => [req.jobId])
);

module.exports = router;
