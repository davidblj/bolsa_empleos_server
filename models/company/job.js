let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// todo(1): create a quantity variable on the number of candidates
// todo(2): set the expiryDate to a date type
// todo(3): set a virtual (or a default function) on time posted to add the user local time zone
// todo(4): add update validators

let schema = {

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
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    }]
};

let jobSchema = new mongoose.Schema(schema);
let jobModel = mongoose.model('Job', jobSchema);

module.exports = jobModel;
