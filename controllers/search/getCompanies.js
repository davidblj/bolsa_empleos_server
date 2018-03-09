// libraries
const { buildQuery } = require(process.cwd() + '/utils/query');

// services
const { getCompanies } = require(process.cwd() + '/services/company');

/**
 * Controller definition to find companies via various criteria
 * @function getCompanies
 * @param {string} [username] - the company username
 * @param {string} [name] - the company name
 * @param {string} [email] - the company email
 * @return {Promise<void>} - a promise that resolves to an object. This object contains the companies with the specified
 * inputs
 */
module.exports = async (username, name, email) => {

    let fields = {username, name, email};
    fields = fieldSanitation(fields);

    let query = buildQuery(fields);
    return getCompanies(query);
};

/**
 * Some fields might not exist. This function set those fields from "undefined" to empty ''
 * @private
 * @param fields - json object to sanitise
 * @return {string} - the sanitised "fields" object
 */
function fieldSanitation(fields) {

    let keys = Object.keys(fields);

    for(let i = 0; i < keys.length; i++) {
        if (fields.hasOwnProperty(keys[i])) {

            if (!fields[keys[i]]) fields[keys[i]] = '';
        }
    }

    return fields;
}
