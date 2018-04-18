// services
const {getJobs} = require(process.cwd() + '/services/candidate');

module.exports = async (id) => {

    // id validations by the id-parsing middleware
    let query = {_id: id};
    let projection = '_id name owner';
    return getJobs(query, projection);
};
