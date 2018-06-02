const {
    isAlphabetic,
    lengthValidator,
    match} = require('../../utils/validations/model-validations');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// todo(1): applicants quantity variable
// todo(2): set a virtual (or a default function) on time posted to add the user local time zone
// todo(3): expiry sanitation, owner with a custom schema validation

let schema = {

    name: {
        type: String,
        required: true,
        validate: [lengthValidator(3,40)]
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
        validator: [isAlphabetic(), match(['Egresado', 'Practicante', 'Ambos'])]
    },
    expiry: {
        type: Date,
        required: true,
    },
    salary: {
        type: Number,
    },
    type: {
        type: String,
        required: true,
        validator: [isAlphabetic(), match(['Tiempo Completo', 'Tiempo Medio', 'Contrato', 'Temporal'])]
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
            ref: 'Candidate'
        }]
    }
};

let jobSchema = new mongoose.Schema(schema);
let jobModel = mongoose.model('Job', jobSchema);

module.exports = jobModel;
