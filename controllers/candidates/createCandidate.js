// libraries
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');
const log = require(process.cwd() + '/utils/debug');
const {buildQuery}= require(process.cwd() + '/utils/query');

// services
const {createCandidate} = require(process.cwd() + '/services/candidate');
const {getCandidate} = require(process.cwd() + '/services/candidate');

// todo(1): unique indexing

module.exports = async (data) => {

    let username = data.username,
        email = data.email,
        skills = data.skills;

    if(!username || !email || !skills) {
        throw error(status.BAD_REQUEST, 'one or more of the following fields are missing: username, email, skills');
    }

    let fields = {username: username, email: email};
    let query = buildQuery(fields);
    let candidate = await getCandidate(query);

    if(candidate) {
        throw error(status.CONFLICT, 'the username or email already exists');
    }

    // json string parsing to an array of strings
    data.skills = JSON.parse(skills);
    log.common('skill array parsing :', data.skills);

    let user = await createCandidate(data);
    return {Location: 'candidates/' + user._id};
};