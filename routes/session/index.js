// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const login = require(process.cwd() + '/controllers/session/login');

router.post('/', handler(login, status.OK,
    (req, res, next) => [req.body])
);

module.exports = router;
