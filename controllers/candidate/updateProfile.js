// libraries
const {findEmptyFields, findEmptyArguments, field}= require(process.cwd() + '/utils/validations/controller-validations');
const { resumeeProcessing } = require(process.cwd() + '/utils/file');

// services
const {updateCandidate} = require(process.cwd() + '/services/candidate');

module.exports = async (data, userId, file) => {

    validate(data, userId);

    let query = {_id: userId};
    let update = {
        $set: {
            name: data.name,
            email: data.email,
            contact: data.contact,
            role: data.role
        }
    };

    await updateCandidate(query, update);

    // if the user sent a new file, the NodeJS
    // file system will replace that old cv
    if (file) resumeeProcessing(file, userId);
};

function validate(data, userId) {
    findEmptyArguments([field(data, 'data'), field(userId, '_id')]);
    findEmptyFields(data, ['name', 'email', 'contact', 'role']);
}
