// libraries
const mongoose = require('mongoose');
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const {findEmptyFields, findEmptyArguments, field}= require(process.cwd() + '/utils/validations/controller-validations');
const log = require(process.cwd() + '/utils/debug');

// controllers

// services
const {updateCandidate} = require(process.cwd() + '/services/candidate');

module.exports = async (data, userId) => {

    log.common(data);
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
};

function validate(data, userId) {
    findEmptyArguments([field(data, 'data'), field(userId, '_id')]);
    findEmptyFields(data, ['name', 'email', 'contact', 'role']);
}
