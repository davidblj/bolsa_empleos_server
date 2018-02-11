// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const createCompany = require(process.cwd() + '/controllers/companies/createCompany');

router.post('/', handler(createCompany, status.CREATED,
    (req, res, next) => [req.body])
);

module.exports = router;
