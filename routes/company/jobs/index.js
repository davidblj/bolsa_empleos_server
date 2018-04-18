// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const createJob = require(process.cwd() + '/controllers/company/jobs/createJob');
const getJobs = require(process.cwd() + '/controllers/company/jobs/getJobs');

router.get('/', handler(getJobs, status.OK,
    (req, res, next) => [
        req.query.id,
        req.query.offset,
        req.query.size,
        req.token.name
    ])
);

router.post('/', handler(createJob, status.CREATED,
    (req, res, next) => [req.body, req.token.username])
);

module.exports = router;
