// libraries
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');
const log = require(process.cwd() + '/utils/debug');

// controllers
const getCandidate = require('./getCandidate');

// services
const {createCandidate} = require(process.cwd() + '/services/candidate');

// todo(1): unique indexing

module.exports = async (data) => {

    let username = data.username,
        email = data.email,
        skills = data.skills;

    if(!username || !email || !skills) {
        throw error(status.BAD_REQUEST, 'one or more of the following fields are missing: username, email, skills');
    }

    let query = {username: username, email: email};
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