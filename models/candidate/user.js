const {
    setPassword,
    savePassword,
    validPassword,
    generateJwt} = require('../../utils/encryption');
const {
    stringValidator,
    lengthValidator,
    isAlphanumeric,
    isEmail,
    isNumeric,
    match} = require('../../utils/validations');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// todo(1): id length validation
// todo(2): skills and jobTitle must be matched against an array stored (presumably) in the database
// todo(3): cellphone validation

let schema = {

    name: {
        type: String,
        required: true,
        validate: [stringValidator(), lengthValidator(3, 15)]
    },
    username: {
        type: String,
        unique: true,
        required: true,
        validate: [isAlphanumeric(), lengthValidator(3, 15)]
    },
    id: {
        type: String,
        required: true,
        validate: isNumeric()
    },
    age: {
        type: String,
        required: true,
        validate: [isNumeric(), lengthValidator(1, 2)]
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: isEmail()
    },
    cellphone: {
        type: String,
        validate: [isNumeric(), lengthValidator(10,10)]
    },
    jobTitle: {
        type: String,
        required: true,
        validate: stringValidator()
    },
    location: {
        type: String,
        required: true,
        validate: stringValidator()
    },
    skills: {
        type: [{type: String, validate: stringValidator()}]
    },
    role: {
        type: String,
        default: 'student',
        required: true,
        validate: [stringValidator(), match(['student', 'graduate'])]
    },
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
    hash: String,
    salt: String
};

let candidateSchema = new mongoose.Schema(schema);

candidateSchema.virtual('password').set(savePassword);
candidateSchema.methods.setPassword = setPassword;
candidateSchema.methods.validPassword = validPassword;
candidateSchema.methods.generateJwt = generateJwt;

let userModel = mongoose.model('Candidate', candidateSchema);
module.exports = userModel;
