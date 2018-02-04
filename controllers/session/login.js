// libraries
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const log = require(process.cwd() + '/utils/debug');
const {check}= require(process.cwd() + '/utils/validations');

// services
const {getCompany} = require(process.cwd() + '/services/company');
const {getCandidate} = require(process.cwd() + '/services/candidate');

module.exports = async (data) => {

    let username = data.username,
        password = data.password;

    runValidations(username, password);

    let query = {username: username};
    let companyUser = await getCompany(query);

    if (companyUser) {
        let token = signJwt(companyUser, password);
        return buildResponse(companyUser, token);
    }

    let candidateUser = await getCandidate(query);

    if (candidateUser) {
        let token = signJwt(candidateUser, password);
        return buildResponse(candidateUser, token);
    }

    log.common('the username has not been found');
    throw error(status.UNAUTHORIZED, 'Incorrect username or password');
};

function signJwt(user, password) {

    let validPassword = user.validPassword(password);
    if (validPassword) {
        return user.generateJwt()
    } else {
        log.common('password validation failed');
        throw error(status.UNAUTHORIZED, 'Incorrect username or password');
    }
}

function buildResponse(user, token) {
    return { user: user.username, role: user.role, token: token};
}

function runValidations(username, password) {
    check(!username, 'missing field: username');
    check(!password, 'missing field: password');
}

