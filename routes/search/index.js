// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const getJobs = require(process.cwd() + '/controllers/search/getJobs/index');

router.get('/jobs', handler(getJobs, status.OK,
    (req, res, next) => [
        req.query.sort,
        req.query.id,
        req.query.offset,
        req.query.size])
);

module.exports = router;
