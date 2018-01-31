// services
const {getCandidate} = require(process.cwd() + '/services/candidate');

module.exports = async (id) => {

    // the id is already verified on the "idParsing" middleware
    let query = {_id: id};
    let candidate = await getCandidate(query);
    return candidate ? candidate.jobs: {};
};
