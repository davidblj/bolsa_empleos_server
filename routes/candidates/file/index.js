// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');

// routing
const router = express.Router();

// controllers
const getCurriculum = require(process.cwd() + '/controllers/candidates/file/getCurriculum');

// routes
router.get('/', getCurriculum);

module.exports = router;
