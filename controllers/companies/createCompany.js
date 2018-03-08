// libraries
const { buildQuery } = require(process.cwd() + '/utils/query');
const {
    findConflicts,
    findEmptyFields,
    findEmptyArguments,
    field }= require(process.cwd() + '/utils/validations/controller-validations');
const log = require(process.cwd() + '/utils/debug');

// services
const {createCompany, getCompany} = require(process.cwd() + '/services/company');

/**
 * Controller definition to create a "company" user
 * @function createCompany
 * @param {Object} data - an object containing the user information to be created with
 * @param {Object} file - a file, which in turn is the logo
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data, file) => {

    validate(data, file);

    let name = data.name,
        username = data.username,
        email = data.email,
        nit = data.nit,
        filename = file.filename;

    log.common('file name: ', filename);
    log.common('file saved on path: ', file.path);

    let fields = {name: name, username: username, email: email, nit: nit};
    let query = buildQuery(fields);
    let company = await getCompany(query);

    if (company) findConflicts(company, fields);

    data.logo = filename;
    let user = await createCompany(data);
    return {Location: 'companies/' + user._id}
};

/**
 * run semantic validations to start the execution logic
 * @private
 */
function validate(data, file) {
    findEmptyArguments([field(data, 'data'), field(file,'file')]);
    findEmptyFields(data, ['name','username', 'email', 'nit']);
}
