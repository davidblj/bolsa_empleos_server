let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let config = require('../../config/environment');
let Schema = mongoose.Schema;

let userSchema = {

    applicantName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    cellphone: {
      type: Number,
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    skills: {
        type: [{type: String}]
    },
    role: {
        type: String,
        default: 'student'
    },
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
    hash: String,
    salt: String
};

let schema = new mongoose.Schema(userSchema);

// todo: remove duplicate code
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
        name: this.username,
        role: this.role,
        exp: parseInt(expiry.getTime()/1000)
    }, config.secret);
};

module.exports = schema;
module.exports.userSchema =  userSchema;