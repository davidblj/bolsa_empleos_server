let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// todo: create a quantity variable on the number of candidates
// todo: set the expiryDate to a date type
// todo: set a virtual (or a default function) on time posted to add the user local time zone
let jobSchema = {

    jobName: {
        type: String,
        required: true,
    },
    ownerCompany: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    candidateType: {
        type: String,
        required: true
    },
    languages: {
        type: String,
         required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    technicalRole: {
        type: String,
        required: true
    },
    urgent: {
        type: Boolean,
        required: true
    },
    timePosted: {
        type: Date,
        default: new Date()
    },
    candidates: [{
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    }]
};

let schema = new mongoose.Schema(jobSchema);

module.exports = schema;
module.exports.jobSchema = jobSchema;