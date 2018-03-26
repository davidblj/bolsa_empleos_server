// libraries
const {buildQuery}= require(process.cwd() + '/utils/query');
const mkdirp = require('mkdirp');
const {
    findConflicts,
    findEmptyFields,
    findEmptyArguments,
    field } = require(process.cwd() + '/utils/validations/controller-validations');
const log = require(process.cwd() + '/utils/debug');
const fileSystem = require('fs');

// services
const {createCandidate, getCandidate} = require(process.cwd() + '/services/candidate');

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
        email = data.email;

    log.common(
        `file: ${file.filename} \n` +
        `saved on path: ${file.path} \n` +
        `of size in bytes: ${file.size}`);

    let fields = {username: username, email: email};
    let query = buildQuery(fields);
    let candidate = await getCandidate(query);

    if (candidate) findConflicts(candidate, fields);

    let user = await createCandidate(data);
    let userId = user._id;

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

/**
 * Resumee file processing. This processing just moves the resumee from the staging folder
 * area to a fixed file path: 'resumes/:id/resume'
 * @private
 * @param {File} file - the resumee file to move
 * @param {String} id - the proprietary user id
 */
function resumeeProcessing(file, id) {

    let filename = file.filename;

    let rootPath = process.cwd();
    let oldPath = `${rootPath}/resumes/staging/${filename}`;
    let destination = `${rootPath}/resumes/${id}`;
    let newPath = `${destination}/${file.filename}`;

    mkdirp(destination, moveFile(oldPath, newPath));
}

/**
 * Callback utility (through "Javascript currying"). This callback contains
 * the actual logic to move files from an old path, to a new path.
 * @private
 * @param {String} oldPath - the original path where the current file is standing
 * @param {String} newPath - the new path where the current file will be moved to
 * @return {function(error, created)} - a callback function to be executed by "mkdirp"
 */
function moveFile(oldPath, newPath) {

    return (error, created) => {

        if (error) {
            throw error;
        }

        fileSystem.rename(oldPath, newPath, (error) => {
            if (error) throw error;
            log.common(
                `file moved from: ${oldPath} \n` +
                `to: ${newPath}`)
        });
    }
}
