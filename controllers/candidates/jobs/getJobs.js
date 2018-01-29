// libraries
const mongoose = require('mongoose');
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');

// controllers
const getCandidate = require('../getCandidate');

// todo(1): this route must use its own service

module.exports = async (id) => {

    // the id is already verified on the "idParsing" middleware
    let query = {_id: id};
    let candidate = await getCandidate(query);
    return candidate ? candidate.jobs: {};
};
