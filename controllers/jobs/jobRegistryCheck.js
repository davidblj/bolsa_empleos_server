const {
    buildQuery,
    fieldSanitation } = require(process.cwd() + '/utils/query');

// services
const { getJob } = require(process.cwd() + '/services/job');

/**
 * Controller definition to find a job by its name. The purpose of this
 * controller is to verify the uniqueness of these fields.
 * @param {String} name - the job name
 * @return {Promise<Object>} - a promise that resolves to the job found, or "null" if no job
 * was found with the specified search criteria
 */
module.exports = (name) => {

    let fields = {name};
    fields = fieldSanitation(fields);

    let query = buildQuery(fields);
    return getJob(query);
};
