// libraries
const {buildQuery}= require(process.cwd() + '/utils/query');
const {findConflicts, findEmptyFields}= require(process.cwd() + '/utils/validations');

// services
const {createCompany, getCompany} = require(process.cwd() + '/services/company');

/**
 * Controller definition to create a "company" user
 * @function createCompany
 * @param {Object} data - an object containing the user information to be created with
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data) => {

    let username = data.username,
        email = data.email,
        nit = data.nit;

    runValidations(data);

    let fields = {username: username, email: email, nit: nit};
    let query = buildQuery(fields);
    let company = await getCompany(query);

    if (company) findConflicts(company, fields);

    let user = await createCompany(data);
    return {Location: 'companies/' + user._id}
};

/**
 * run semantic validations to start the execution logic
 * @private
 */
function runValidations(data) {
    findEmptyFields(data, ['username', 'email', 'nit']);
}
