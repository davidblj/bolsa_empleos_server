// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router({mergeParams: true});

// controllers
const getJobs = require(process.cwd() + '/controllers/candidates/jobs/getJobs');

router.get('/', handler(getJobs, status.OK,
    (req, res, next) => [req.params.userId])
);

module.exports = router;