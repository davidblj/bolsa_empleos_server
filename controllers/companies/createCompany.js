// libraries
const sharp = require('sharp');
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');
const mkdirp = require('mkdirp');
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
 * @param {File} file - a file, which in turn is the logo
 * @return {Object} - the object containing a "message" field with the location of the newly created resource
 */
module.exports = async (data, file) => {

    validate(data, file);

    let name = data.name,
        username = data.username,
        email = data.email,
        nit = data.nit,
        filename = file.filename;

    log.common(
        `file: ${file.filename} \n` +
        `saved on path: ${file.path} \n` +
        `of size in bytes: ${file.size}`);

    let fields = {name: name, username: username, email: email, nit: nit};
    let query = buildQuery(fields);
    let company = await getCompany(query);

    if (company) findConflicts(company, fields);

    data.logo = filename;
    let user = await createCompany(data);
    let userId = user.id;

    await imageProcessing(file, userId);

    return {Location: 'companies/' + user._id}
};

/**
 * Run semantic validations to start the execution logic
 * @private
 */
function validate(data, file) {
    findEmptyArguments([field(data, 'data'), field(file,'file')]);
    findEmptyFields(data, ['name','username', 'email', 'nit']);
}

/**
 * Image storage entry point. This processing will create and store two new images with
 * different sizes on a fixed file path: 'gallery/companies/:id'
 * @private
 * @param {File} file - the original file to resize
 * @param {String} id - the proprietary user id
 */
async function imageProcessing(file, id) {

    // use directories
    let filename = file.filename;
    let extension  = file.mimetype.split('/')[1];
    let rootPath = process.cwd();

    let basePath = `${rootPath}/gallery/staging/${filename}`;
    let destination = `${rootPath}/gallery/companies/${id}`;

    mkdirp(destination, sharpProcessing(destination, extension, basePath));
}

/**
 * Callback utility (through "Javascript currying"). This is where the "sharp" library is leverage to
 * start the execution logic of the image processing
 * @param {String} destination - the folder path to store the "thumbnail" and "icon" images
 * @param {String} extension - the file type of the image
 * @param {String} basePath - the file path of the image to process
 * @return {function(error, created)} - a callback function to be executed by "mkdirp"
 */
function sharpProcessing(destination, extension, basePath) {

    return async (error, created) => {

        let thumbnailProperties = {
            width: 270,
            height: 270,
            destination: `${destination}/thumbnail.${extension}`
        };

        let iconProperties = {
            width: 100,
            height: 100,
            destination: `${destination}/icon.${extension}`
        };

        try {
            let basePipeLine = sharp(basePath);
            await buildPipe(basePipeLine, thumbnailProperties, extension);
            await buildPipe(basePipeLine, iconProperties, extension);
        } catch (e) {
            throw error(status.INTERNAL_SERVER_ERROR, 'Image processing failed', e.stack);
        }
    }
}


/**
 * Pipe construction from the sharp library to crop, resize and store an image
 * @private
 * @param {Sharp} basePipeLine - the base pipeline that contains the path of the original file
 * @param {Object} properties - the properties which will be applied to the new image
 * @param {String} extension - the file extension of the original image
 */
async function buildPipe(basePipeLine, properties, extension) {

    let currentPipe = basePipeLine
        .clone()
        .resize(properties.width, properties.height);

    currentPipe = toFileExtension(currentPipe, extension);
    let info = await currentPipe.toFile(properties.destination);
    print(info);
}

/**
 * Append a new pipe step on to the current pipeline. This step assigns the proper file type to the new image file
 * @private
 * @param {sharp} pipe - the current pipeline to append a new step.
 * @param {string} extension - the file type extension. It must be either a jpg, jpeg, or png.
 * @return {sharp} - a sharp instance.
 */
function toFileExtension(pipe, extension) {

    if (extension === 'png'){
        return pipe.png();
    } else {
        return pipe.jpeg({quality: 80})
    }
}

/**
 * A printing utility of file information
 * @private
 * @param info - an object from the sharp library containing the information of the newly created file
 */
function print(info) {
    log.common(
        `file saved with a new size of: ${info.size} \n` +
        `and with a width and height of: ${info.width} x ${info.height}`);
}
