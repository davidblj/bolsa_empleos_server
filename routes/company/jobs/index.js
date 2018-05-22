// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// middleware
const idParsing = require(process.cwd() + '/middleware/id-parsing');

// controllers
const createJob = require(process.cwd() + '/controllers/company/jobs/createJob');
const getJobs = require(process.cwd() + '/controllers/company/jobs/getJobs');
const getJob = require(process.cwd() + '/controllers/company/jobs/getJob');

router.get('/', handler(getJobs, status.OK,
    (req, res, next) => [
        req.query.id,
        req.query.offset,
        req.query.size,
        req.query.state,
        req.token.name
    ])
);

router.use('/:jobId', idParsing('jobId',
    (req, res, next) => req.params.jobId)
);

router.get('/:jobId', handler(getJob, status.OK,
    (req, res, next) => [req.jobId])
);

router.post('/', handler(createJob, status.CREATED,
    (req, res, next) => [req.body, req.token.name])
);

module.exports = router;
