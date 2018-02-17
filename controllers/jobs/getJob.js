// services
const {getJob} = require(process.cwd() + '/services/job');

/**
 * Controller definition to get a job description
 * @function getJob
 * @param {String} id - the unique id that identifies a job
 * @return {Promise<Object>} - a promise that resolves to an object. This object contains the specified job information
 */
module.exports = (id) => {

    // the id is already verified on the "idParsing" middleware
    let query = {_id: id};
    let projection = '-_id -applicants';
    return getJob(query, projection);
};
