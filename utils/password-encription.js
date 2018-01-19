let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let config = require('../config/environment');

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

    return jwt.sign({
        _id: this._id,
        name: this.username,
        role: this.role,
        exp: parseInt(expiry.getTime()/1000)
    }, config.secret);
}

module.exports = {
    setPassword: setPassword,
    savePassword: savePassword,
    validPassword: validPassword,
    generateJwt: generateJwt
};