// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router({mergeParams: true});

// middleware
const idParsing = require(process.cwd() + '/middleware/idParsing');

// controllers
const getJobs = require(process.cwd() + '/controllers/candidates/jobs/getJobs');
const addJob = require(process.cwd() + '/controllers/candidates/jobs/addJob');

// todo(1): authentication

router.get('/', handler(getJobs, status.OK,
    (req, res, next) => [req.userId])
);

router.use('/:jobId', idParsing('jobId',
    (req, res, next) => req.params.jobId)
);

router.post('/:jobId', handler(addJob, status.NO_CONTENT,
    (req, res, next) => [req.userId, req.jobId])
);

module.exports = router;