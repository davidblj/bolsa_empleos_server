const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const log = require(process.cwd() + '/utils/debug');

/**
 * Find repeated values in a given object
 * @memberof controller-validations
 * @function
 * @param {Object} data - the object to be validated against
 * @param {Object} fields - an object that contains the fields to check for repeated values in the "data" input
 */
const findConflicts = (data, fields) => {

    let errors = [];
    let keys = Object.keys(fields);

    keys.forEach((key) => {
        if (fields.hasOwnProperty(key)) {

            let conflict = data[key] === fields[key];
            if (conflict) errors.push(key);
        }
    });

    let errorFound = errors.length > 0;

    if (errorFound) {
        throw error(status.CONFLICT, `The following fields were already found in a document: ${errors.join(',')}`)
    }
};

/**
 * Find a set of fields that are missing in a given object
 * @memberof controller-validations
 * @function
 * @param {Object} data - the object to be validated against
 * @param {Array<String>} fields - an array of names (the keys) to be check in the "data" input
 */
const findEmptyFields = (data, fields) => {
    let errors = [];

    fields.forEach((field) => {
        let value = data[field];
        if (!value) errors.push(field)
    });

    let errorFound = errors.length > 0;

    if (errorFound) {
        throw error(status.BAD_REQUEST, `Some field or fields are missing: ${errors.join(',')}`)
    }
};

/**
 * Find if a set of given "fields" are empty.
 * @memberof controller-validations
 * @function findEmptyArguments
 * @param {Array<field>} fields - an array of field objects. Each field is supposed to be a function argument
 */
const findEmptyArguments = (fields) => {

    let errors = [];
    fields.forEach(field => {
        if (!field.fieldValue) {
            errors.push(field.fieldName);
        }
    });

    if (errors.length > 0) {
        throw  error(status.INTERNAL_SERVER_ERROR, `Missing one or several arguments: ${errors.join(',')}`);
    }
};

/**
 * An object generator that represents a field. A field is function argument
 * @memberof controller-validations
 * @param {*} fieldValue - field value
 * @param {String} fieldName - field name
 * @return {{fieldValue: *, fieldName: String}} - An object representation of a field
 */
const field = (fieldValue, fieldName) => ({
    fieldValue,
    fieldName
});

/**
 * Set of functions to do short and yet recurrent validations across controller definitions
 * @module controller-validations
 */
module.exports = {
    findConflicts: findConflicts,
    findEmptyFields: findEmptyFields,
    findEmptyArguments: findEmptyArguments,
    field: field
};
