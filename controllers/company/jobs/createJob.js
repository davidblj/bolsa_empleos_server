// libraries
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const {findEmptyFields, findEmptyArguments, field}= require(process.cwd() + '/utils/validations/controller-validations');

// services
const {createJob, getJob} = require(process.cwd() + '/services/job');

/**
 * Controller definition to create a new job
 * @function createJob
 * @param {Object} data - an object containing the job information to be created with
 * @param {String} company - the company issuing the new job. This field must be provided by a token and not the client
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data, company) => {

    validate(data, company);
    let name = data.name;

    let query = {name: name, owner: company};
    let job = await getJob(query);

    if (job) {
        throw error(status.CONFLICT, 'A job with that name has already been created');
    }

    data.owner = company;

    job = await createJob(data);
    return {Location: 'company/jobs/' + job._id}
};

/**
 * run semantic validations to start the execution logic
 * @private
 */
function validate(data, company) {
    findEmptyArguments([field(company, 'company')]);
    findEmptyFields(data, ['name']);
}
