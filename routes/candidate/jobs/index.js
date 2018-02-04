// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router({mergeParams: true});

// middleware
const idParsing = require(process.cwd() + '/middleware/id-parsing');

// controllers
const getJobs = require(process.cwd() + '/controllers/candidate/jobs/getJobs');
const addJob = require(process.cwd() + '/controllers/candidate/jobs/addJob');

router.get('/', handler(getJobs, status.OK,
    (req, res, next) => [req.token.userId])
);

router.use('/:jobId', idParsing('jobId',
    (req, res, next) => req.params.jobId)
);

router.post('/:jobId', handler(addJob, status.NO_CONTENT,
    (req, res, next) => [req.token.userId, req.jobId])
);

module.exports = router;
