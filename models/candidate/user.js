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
    match} = require('../../utils/validations');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// todo(1): skills and jobTitle with a custom schema validation (against the db itself)

let schema = {

    name: {
        type: String,
        required: true,
        validate: [isAlphabetic(), lengthValidator(3, 30)]
    },
    username: {
        type: String,
        unique: true,
        required: true,
        validate: [isAlphanumeric(), lengthValidator(3, 15)]
    },
    pid: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        validate: lengthValidator(1, 2)
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: isEmail()
    },
    contact: {
        type: String,
        validate: isAlphanumeric()
    },
    jobTitle: {
        type: String,
        required: true,
        validate: isAlphabetic()
    },
    location: {
        type: String,
        required: true,
        validate: isAlphabetic()
    },
    skills: {
        type: [{type: String, validate: isAlphabetic()}]
    },
    role: {
        type: String,
        default: 'student',
        required: true,
        validate: [isAlphabetic(), match(['student', 'graduate'])]
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
