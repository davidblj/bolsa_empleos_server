// libraries
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const {findEmptyFields}= require(process.cwd() + '/utils/validations');

// services
const {createJob, getJob} = require(process.cwd() + '/services/job');

/**
 * @function createJob
 * @param {Object} data - an object containing the job information to be created with
 * @param {String} company - the company issuing the new job. This field must be provided by a token and not the client
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data, company) => {

    let name = data.name;
    runValidations(data, company);

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
 * run all types of validations required to start the execution logic
 * @private
 */
function runValidations(data, company) {

    findEmptyFields(data, ['name']);
    if (!company) {
        throw  error(status.INTERNAL_SERVER_ERROR, 'missing argument: company');
    }
}
