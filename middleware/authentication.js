const {variables} = require('../config/environment');
const error = require(process.cwd() + '/utils/error');
const jwt = require('jsonwebtoken');
const status = require('http-status');
const mongoose = require('mongoose');
const log = require(process.cwd() + '/utils/debug');

module.exports = (roles) => (req, res, next) => {

    try {
        let token = getToken(req);
        let decodedToken = parseJwt(token);
        verifyRole(decodedToken, roles);

        // id parsing to ObjectId
        decodedToken.userId = new mongoose.Types.ObjectId(decodedToken._id);
        req.token = decodedToken;
        next();
    } catch (e) {
        next(e);
    }
};

function getToken(req) {

    let header = req.get('Authentication');

    if (header) {
        let stringArray = header.split(' '),
            isValid = (stringArray.length === 2) && (stringArray[0] === 'Bearer');

        if (isValid) {
            return stringArray[1];
        } else {
            throw error(status.BAD_REQUEST, 'The Authentication header must follow the RFC 6750 syntax: \'Authentication: Bearer value\'')
        }

    } else {
        throw error(status.BAD_REQUEST, 'Requires authentication');
    }
}

function parseJwt(token) {

    try {
        let decodedToken = jwt.verify(token, variables.secret);
        log.common(`token detected and decoded to: ${JSON.stringify(decodedToken)}`);
        return decodedToken;
    } catch (e){
        throw error(status.UNAUTHORIZED, 'Authentication failed', e.stack);
    }
}

function verifyRole(decodedToken, roles) {

    let authorized = roles.some((role) => role === decodedToken.role) ;
    if (!authorized) {
        log.common(`sent token must have one of the following access rights: ${roles}, but found: ${decodedToken.role}`);
        throw error(status.FORBIDDEN, 'Authorization failed');
    }
}
