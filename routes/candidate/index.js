// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');
const multer = require(process.cwd() + '/config/multer-config');
const upload = multer('./resumes/staging');

// routing
const router = express.Router();
const jobs = require('./jobs');

// middleware
const authentication = require(process.cwd() + '/middleware/authentication');

// controllers
const updateProfile = require(process.cwd() + '/controllers/candidate/updateProfile');

router.use('/', authentication(['student', 'graduate']));

router.put('/', upload.single('resumee'), handler(updateProfile, status.NO_CONTENT,
    (req, res, next) => [req.body, req.token._id, req.file])
);

router.use('/jobs',jobs);

module.exports = router;
