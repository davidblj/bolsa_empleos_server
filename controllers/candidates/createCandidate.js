// libraries
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');
const log = require(process.cwd() + '/utils/debug');
const {buildQuery}= require(process.cwd() + '/utils/query');
const {check}= require(process.cwd() + '/utils/validations');

// services
const {createCandidate} = require(process.cwd() + '/services/candidate');
const {getCandidate} = require(process.cwd() + '/services/candidate');

// todo(1): unique indexing

module.exports = async (data) => {

    let username = data.username,
        email = data.email,
        skills = data.skills;

    runValidations(username, email, skills);

    let fields = {username: username, email: email};
    let query = buildQuery(fields);
    let candidate = await getCandidate(query);

    if(candidate) {
        throw error(status.CONFLICT, 'The username or email already exists');
    }

    // json string parsing to an array of strings
    data.skills = JSON.parse(skills);
    log.common('skill array parsing :', data.skills);

    let user = await createCandidate(data);
    return {Location: 'candidates/' + user._id};
};

const runValidations = (username, email, skills) => {
    check(!username, 'missing field: username');
    check(!email, 'missing field: password');
    check(!skills, 'missing field: skills');
};
