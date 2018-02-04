const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const log = require(process.cwd() + '/utils/debug');
const {variables} = require('../config/environment');

function setPassword(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

function savePassword(password) {
    this.setPassword(password);
}

function validPassword(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

function generateJwt() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    let content = {
        _id: this._id,
        name: this.username,
        role: this.role,
        exp: parseInt(expiry.getTime()/1000)
    };
    let token = jwt.sign(content, variables.secret);

    log.common(`generating a json web token with: ${JSON.stringify(content)}`);
    log.common(`generated token: ${token}`);
    return token;
}

module.exports = {
    setPassword: setPassword,
    savePassword: savePassword,
    validPassword: validPassword,
    generateJwt: generateJwt
};
