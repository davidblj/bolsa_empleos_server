let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let config = require('../../config/index');

// todo: remove the "role" field
let userSchema = {

    companyName: {
        type: String,
        unique: true,
        required: true
    },
    companyDetails: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    workingRole: {
        type: String,
        required: false
    },
    nit: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    employmentSector: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    hash: String,
    salt: String       // o contraseña
};

let schema = new mongoose.Schema(userSchema);

schema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

schema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

schema.virtual('password').set(function (password) {
    this.setPassword(password);
});

schema.methods.generateJwt = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        name: this.companyName,
        role: this.role,
        exp: parseInt(expiry.getTime()/1000)
    }, config.secret);
};

module.exports = schema;
module.exports.userSchema =  userSchema;
