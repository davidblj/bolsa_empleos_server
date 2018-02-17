const {
    isAlphabetic,
    lengthValidator,
    isAlphanumeric,
    match} = require('../../utils/validations');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// todo(1): applicants quantity variable
// todo(2): set a virtual (or a default function) on time posted to add the user local time zone
// todo(3): expiry sanitation, owner with a custom schema validation

let schema = {

    name: {
        type: String,
        required: true,
        validate: [isAlphabetic(), lengthValidator(3,15)]
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        validate: isAlphanumeric()
    },
    to: {
        type: String,
        required: true,
        validator: [isAlphabetic(), match(['student', 'graduate', 'both'])]
    },
    languages: {
        type: String,
        validate: isAlphabetic()
    },
    expiry: {
        type: Date,
        required: true,
    },
    salary: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        validate: isAlphabetic()
    },
    role: {
        type: String,
        required: true,
        validate: isAlphabetic()
    },
    urgent: {
        type: Boolean,
        required: true
    },
    posted: {
        type: Date,
        default: new Date()
    },
    applicants: {
        amount: {
          type: Number,
          default: 0
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'Candidates'
        }]
    }
};

let jobSchema = new mongoose.Schema(schema);
let jobModel = mongoose.model('Job', jobSchema);

module.exports = jobModel;
