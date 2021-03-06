// libraries
const {findEmptyFields, findEmptyArguments, field}= require(process.cwd() + '/utils/validations/controller-validations');
const log = require(process.cwd() + '/utils/debug');

// services
const {updateJob} = require(process.cwd() + '/services/job');

module.exports = async (data, jobId) => {

    log.common(data);
    log.common(typeof data.urgent);

    validate(data, jobId);

    let query = {_id: jobId};
    let update = {
        $set: {
            name: data.name,
            description: data.description,
            expiry: data.expiry,
            salary: data.salary,
            urgent: data.urgent,
        }
    };
    let options = {runValidators: true};

    await updateJob(query, update, options);
};

function validate(data, jobId) {
    findEmptyArguments([field(data, 'data'), field(jobId, '_id')]);
    findEmptyFields(data, ['name', 'description', 'expiry', 'urgent']);
}
