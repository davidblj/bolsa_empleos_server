// libraries
const mongoose = require('mongoose');
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');

// controllers
const getCandidate = require('../getCandidate');

module.exports = async (id) => {

    try {
        id = new mongoose.Types.ObjectId(id);
    } catch(e) {
        throw error(status.BAD_REQUEST, 'user id must be a valid MongoDB id');
    }

    let query = {_id: id};
    let candidate = await getCandidate(query);
    return candidate ? candidate.jobs: {};
};


