// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');
const multer = require(process.cwd() + '/config/multer-config');
const upload = multer('./resumes/staging');

// routing
const router = express.Router();

// middleware
const idParsing = require(process.cwd() + '/middleware/id-parsing');

// controllers
const createCandidate = require(process.cwd() + '/controllers/candidates/createCandidate');
const getCandidate = require(process.cwd() + '/controllers/candidates/getCandidate');

router.post('/', upload.single('resumee'), handler(createCandidate, status.CREATED,
    (req, res, next) => [req.body, req.file])
);

router.use('/:userId', idParsing('userId',
    (req, res, next) => req.params.userId)
);

router.get('/:userId', handler(getCandidate, status.OK,
    (req, res, next) => [req.userId])
);

module.exports = router;
