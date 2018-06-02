const mkdirp = require('mkdirp');
const fileSystem = require('fs');
const log = require(process.cwd() + '/utils/debug');

/**
 * Resumee file processing. This processing just moves the resumee from the staging folder
 * area to a fixed file path: 'resumes/:id/resume'
 * @memberOf file
 * @function
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

/**
 * set of functions to process a file (specifically, a curriculum vitae)
 * @module file
 */
module.exports = {
    resumeeProcessing
};
