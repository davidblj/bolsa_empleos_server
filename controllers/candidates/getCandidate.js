// services
const {getCandidate} = require(process.cwd() + '/services/candidate');

module.exports = async (userId) => {

    // the ids are already verified on the "idParsing" middleware
    let query = {_id: userId};
    let projection = '-jobs -hash -salt -__v';
    return getCandidate(query, projection);
};
