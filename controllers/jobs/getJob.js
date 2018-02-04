// retrieve a job's information
const error = require(process.cwd() + '/utils/error');
const {buildQuery} = require(process.cwd() + '/utils/query');

// services
const {getJob} = require(process.cwd() + '/services/job');

module.exports = (fields, projection) => {

    if(!fields) {
        throw error(status.BAD_REQUEST, 'at least one field from the \"job\" schema is missing');
    }

    const query = buildQuery(fields);
    return getJob(query, projection);
};
