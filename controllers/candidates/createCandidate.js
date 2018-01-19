const {createCandidate} = require('../../services/candidate');
const getCandidate = require('./getCandidate');
const error = require('../../utils/error');
const status = require('http-status');

module.exports = async (data) => {

    let username = data.username,
        email = data.email,
        skills = data.skills;

    if(!username || !email || !skills) {
        throw error(status.BAD_REQUEST, 'one or more of the following fields are missing: username, email, skills');
    }

    // todo: unique indexing
    let query = { username: username, email: email};
    let candidate = await getCandidate(query);

    if(candidate) {
        throw error(status.CONFLICT, 'the username or email already exists');
    }

    // json string parsing to an array of strings
    data.skills = JSON.parse(skills);
    return createCandidate(data);
};