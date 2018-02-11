// services
const {getCandidate} = require(process.cwd() + '/services/candidate');

/**
 * Controller definition to get a candidate account's information
 * @function getCandidate
 * @param {String} userId - the unique id that identifies a candidate
 * @return {Promise<Object>} - a promise that resolves to an object. This object contains the specified candidate
 * information
 */
module.exports = async (userId) => {

    // the id is already verified on the "idParsing" middleware
    let query = {_id: userId};
    let projection = '-jobs -hash -salt -__v';
    return getCandidate(query, projection);
};
