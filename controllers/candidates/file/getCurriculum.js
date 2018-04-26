// libraries
const mongoose = require('mongoose');
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const log = require(process.cwd() + '/utils/debug');

// controllers

// services

module.exports = (req, res, next) => {

    let id = req.userId;
    let rootPath = process.cwd() + `/resumes/${id}`;
    log.common('Looking for a folder with id: ', rootPath);

    let options = {
        root: rootPath
    };

    let filename = 'cv.pdf';
    res.sendFile(filename, options, (error) => {

        if (error) {
            next(error);
        } else {
            log.common('file sent on path:', rootPath + filename);
        }
    });
};
