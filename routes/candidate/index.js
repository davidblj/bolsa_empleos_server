// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();
const jobs = require('./jobs');

// middleware
const authentication = require(process.cwd() + '/middleware/authentication');

// controllers
const updateProfile = require(process.cwd() + '/controllers/candidate/updateProfile');

router.use('/', authentication(['student', 'graduate']));

router.put('/', handler(updateProfile, status.NO_CONTENT,
    (req, res, next) => [req.body, req.token._id])
);

router.use('/jobs',jobs);

module.exports = router;
