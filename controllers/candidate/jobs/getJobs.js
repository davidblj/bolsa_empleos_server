// services
const {getCandidate} = require(process.cwd() + '/services/candidate');

// todo(1): mongoose population in the jobs field

module.exports = async (id) => {

    // id validations by the id-parsing middleware
    let query = {_id: id};
    let candidate = await getCandidate(query);
    return candidate ? candidate.jobs: {};
};
