// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const createJob = require(process.cwd() + '/controllers/company/jobs/createJob');

router.post('/', handler(createJob, status.CREATED,
    (req, res, next) => [req.body, req.token.username])
);

module.exports = router;
