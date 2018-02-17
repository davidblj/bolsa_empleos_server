// services
const {getJobs} = require(process.cwd() + '/services/job');

/**
 * Controller definition to get all jobs created by an specified company
 * @function getJobs
 * @param {String} company - the company to search for its jobs. This field must be provided by a token and not the client
 * @return {promise<Object>} - a promise that resolves to an object. This object contains a list of jobs
 */
module.exports = async (company) => {

    let query = {owner: company};
    let projection = '_id name expiry applicants.amount';
    return getJobs(query, projection);
};
