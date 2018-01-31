const {
    setPassword,
    savePassword,
    validPassword,
    generateJwt} = require('../../utils/encryption');
let mongoose = require('mongoose');

// todo(1): field validation

let schema = {

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    profile: {
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
    sector: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'company'
    },
    hash: String,
    salt: String
};

let companySchema = new mongoose.Schema(schema);

companySchema.virtual('password').set(savePassword);
companySchema.methods.setPassword = setPassword;
companySchema.methods.validPassword = validPassword;
companySchema.methods.generateJwt = generateJwt;

let companyModel = mongoose.model('Company', companySchema);
module.exports = companyModel;
