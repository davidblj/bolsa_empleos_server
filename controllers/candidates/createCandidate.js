// libraries
const {
    findConflicts,
    findEmptyFields,
    findEmptyArguments,
    field } = require(process.cwd() + '/utils/validations/controller-validations');
const log = require(process.cwd() + '/utils/debug');
const { resumeeProcessing } = require(process.cwd() + '/utils/file');

// services
const {createCandidate} = require(process.cwd() + '/services/candidate');

// controllers
const signUpCheck = require(process.cwd() + '/controllers/sign-up-check/signUpCheck');

/**
 * Controller definition to create a "candidate" user
 * @function createCandidate
 * @param {Object} data - an object containing the user information to be created with
 * @param {File} file - a file, which in turn is the resumee
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data, file) => {

    validate(data,file);

    let username = data.username,
        email = data.email,
        pid = data.pid;

    log.common(
        `file: ${file.filename} \n` +
        `saved on path: ${file.path} \n` +
        `of size in bytes: ${file.size}`);

    pid = parseInt(pid);
    let fields = {username, email, pid};
    let user = await signUpCheck(username, email, pid, null);

    if (user) findConflicts(user, fields);

    let newUser = await createCandidate(data);
    let userId = newUser._id;

    resumeeProcessing(file, userId);

    return {Location: 'candidates/' + userId};
};

/**
 * Run semantic validations to start the execution logic
 * @private
 */
function validate(data, file) {
    findEmptyArguments([field(data, 'data'), field(file, 'file')]);
    findEmptyFields(data, ['username', 'email']);
}
