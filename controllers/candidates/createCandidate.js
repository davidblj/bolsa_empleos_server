// libraries
const {buildQuery}= require(process.cwd() + '/utils/query');
const {
    findConflicts,
    findEmptyFields,
    findEmptyArguments,
    field } = require(process.cwd() + '/utils/validations/controller-validations');

// services
const {createCandidate, getCandidate} = require(process.cwd() + '/services/candidate');

/**
 * Controller definition to create a "candidate" user
 * @function createCandidate
 * @param {Object} data - an object containing the user information to be created with
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data) => {

    let username = data.username,
        email = data.email;

    runValidations(data);

    let fields = {username: username, email: email};
    let query = buildQuery(fields);
    let candidate = await getCandidate(query);

    if (candidate) findConflicts(candidate, fields);

    let user = await createCandidate(data);
    return {Location: 'candidates/' + user._id};
};

/**
 * run semantic of validations to start the execution logic
 * @private
 */
function runValidations(data) {
    findEmptyArguments([field(data, 'data')]);
    findEmptyFields(data, ['username', 'email']);
}


