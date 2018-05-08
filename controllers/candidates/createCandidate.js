// libraries
const mkdirp = require('mkdirp');
const {
    findConflicts,
    findEmptyFields,
    findEmptyArguments,
    field } = require(process.cwd() + '/utils/validations/controller-validations');
const log = require(process.cwd() + '/utils/debug');
const fileSystem = require('fs');

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

/**
 * Resumee file processing. This processing just moves the resumee from the staging folder
 * area to a fixed file path: 'resumes/:id/resume'
 * @private
 * @param {File} file - the resumee file to move
 * @param {string} id - the proprietary user id
 */
function resumeeProcessing(file, id) {

    let filename = file.filename;
    let extension  = file.mimetype.split('/')[1];

    let rootPath = process.cwd();
    let oldPath = `${rootPath}/resumes/staging/${filename}`;
    let destination = `${rootPath}/resumes/${id}`;
    let newPath = `${destination}/cv.${extension}`;

    mkdirp(destination, moveFile(oldPath, newPath));
}

/**
 * Callback utility (through "Javascript currying"). This callback contains
 * the actual logic to move files from an old path, to a new path.
 * @private
 * @param {string} oldPath - the original path where the current file is standing
 * @param {string} newPath - the new path where the current file will be moved to
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
