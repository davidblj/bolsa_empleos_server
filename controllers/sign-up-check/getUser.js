const {
    buildQuery,
    fieldSanitation } = require(process.cwd() + '/utils/query');

// services
const { getCompany } = require(process.cwd() + '/services/company');
const { getCandidate } = require(process.cwd() + '/services/candidate');

/**
 * Controller definition to find users through a set of criteria. A user
 * may be a company or a candidate. The sole purpose of this controller
 * is to verify the uniqueness of these fields.
 * @param {String} [username] - the username of a company or a candidate user
 * @param {String} [email] - the email of a company or a candidate user
 * @param {number} [pid] - the pid of a candidate
 * @param {String} [name] - the NIT of a company
 * @return {Promise<Object>} - a promise that resolves to the user found, or "null" if no user
 * was found with the specified search criteria
 */
module.exports = async (username, email, pid, name) => {

    let fields = {username, email, pid};
    fields = fieldSanitation(fields);

    let query = buildQuery(fields);
    let candidate = await getCandidate(query);

    if (candidate) return candidate;

    fields = {username, email, name};
    fields = fieldSanitation(fields);

    query = buildQuery(fields);
    let company = await getCompany(query);

    if (company) return company;

    return null
};
