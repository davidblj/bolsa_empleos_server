const {setPassword,savePassword,validPassword,generateJwt} = require('../../utils/password-encription');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

let candidateSchema = new mongoose.Schema(schema);

candidateSchema.virtual('password').set(savePassword);
candidateSchema.methods.setPassword = setPassword;
candidateSchema.methods.validPassword = validPassword;
candidateSchema.methods.generateJwt = generateJwt;

let userModel = mongoose.model('Candidate', candidateSchema);
module.exports = userModel;
