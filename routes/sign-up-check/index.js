
// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const signUpCheck = require(process.cwd() + '/controllers/sign-up-check/getUser');

// routes
router.get('/', handler(signUpCheck, status.OK,
    (req, res, next) => [
        req.query.username,
        req.query.email,
        req.query.pid,
        req.query.name
    ])
);

module.exports = router;
