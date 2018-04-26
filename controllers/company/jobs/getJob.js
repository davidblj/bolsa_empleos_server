// libraries
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');

// controllers

// services
const { getCandidates } = require(process.cwd() + '/services/job');

module.exports = async (id) => {

    // id validations by the id-parsing middleware
    let query = {_id: id};
    let projection = '_id name email contact';

    try {
        return await getCandidates(query, projection);
    } catch (e) {
        throw error(status.BAD_REQUEST, 'job id not found');
    }
};
