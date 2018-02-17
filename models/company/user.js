const {
    setPassword,
    savePassword,
    validPassword,
    generateJwt} = require('../../utils/encryption');
const {
    isAlphabetic,
    lengthValidator,
    isAlphanumeric,
    isEmail,
    isURL} = require('../../utils/validations/model-validations');
let mongoose = require('mongoose');

let schema = {

    name: {
        type: String,
        required: true,
        validate: [isAlphabetic(), lengthValidator(3,30)]
    },
    username: {
        type: String,
        unique: true,
        required: true,
        validate: [isAlphabetic(), lengthValidator(3,15)]
    },
    details: {
        type: String,
        required: true,
        validate: isAlphanumeric()
    },
    website: {
        type: String,
        required: true,
        validate: isURL()
    },
    contact: {
        type: String,
        required: true,
        validate: isAlphanumeric()
    },
    email: {
        type: String,
        required: false,
        validate: isEmail()
    },
    nit: {
        type: String,
        required: true,
        validate: isAlphanumeric()
    },
    city: {
        type: String,
        required: true,
        validate: isAlphabetic()
    },
    sector: {
        type: String,
        required: true,
        validate: isAlphabetic()
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
