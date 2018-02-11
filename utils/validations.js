const status = require('http-status');
const error = require(process.cwd() + '/utils/error');
const validate = require('validator');
const log = require(process.cwd() + '/utils/debug');

// todo(1): password validator: it must contain at least 1 number
// todo(2): NIT or RUES validator
// todo(3): define a cellphone or a Regex validator (and a contribution to "validator.js")

const isMongoId = () => ({
    validator: (value) => validate.isMongoId(value),
    message: '{VALUE} is not valid MongoDB id'
});

/**
 * Model validation executed in a mongoose field (of type string) that checks for an string composed exclusively by
 * alphabetic values
 * @memberof validations
 * @return {{validator: function(String): boolean, message: string}}
 */
const isAlphabetic = () => ({
    validator: (value) => {
        let sanitisedValue = trim(value);
        return validate.isAlpha(sanitisedValue, 'es-ES')
    },
    message: '{VALUE} must contain letters from a-z or A-Z, whitespaces and some special characters: .,-'
});

/**
 * Model validation executed in a mongoose field (of type string) that checks for an string composed exclusively by
 * alphabetic values and numeric values
 * @memberof validations
 * @return {{validator: function(String): boolean, message: string}}
 */
const isAlphanumeric = () => ({
    validator: (value) => {
        let sanitisedValue = trim(value);
        return validate.isAlphanumeric(sanitisedValue, 'es-ES')
    },
    message: '{VALUE} must contain letters from a-z or A-Z, whitespaces and some special characters: .,-'
});

/**
 * Model validation executed in a mongoose field (of type string or number) that checks a value to have an specific
 * length
 * @memberof validations
 * @function
 * @param {Number} min - lowest bound
 * @param {Number} max - highest bound
 * @return {{validator: function( (String|Number) ): boolean, message: string}}
 */
const lengthValidator = (min, max) => ({
    validator: (value) => validate.isLength(value.toString(), {min: min, max: max}),
    message: `{VALUE} must be within a range of ${min}-${max} characters`
});

const isEmail = () => ({
    validator: (value) => validate.isEmail(value),
    message: '{VALUE} must be a valid email'
});

const isURL = () => ({
    validator: (value) => validate.isURL(value),
    message: '{VALUE} must be a valid URL'
});

const match = (comparators) => ({
   validator: (value) => comparators.some((element) => {
       return element === value;
   }),
    message: '{VALUE} is not a valid {PATH}'
});

/**
 * Find repeated values in a given object
 * @memberof validations
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
        throw error(status.CONFLICT, `The following fields must be unique to be stored in the db: ${errors.join(',')}`)
    }
};

/**
 * Find a set of fields that are missing in a given object
 * @memberof validations
 * @function
 * @param {Object} data - the object to be validated against
 * @param {Array<String>} fields - an array of names (the keys) to be check in the "data" input
 */
const findEmptyFields = (data, fields) => {
    let errors = [];

    fields.forEach((field) => {
        let value = data[field];
        if (!value) errors.push()
    });

    let errorFound = errors.length > 0;

    if (errorFound) {
        throw error(status.BAD_REQUEST, `Some field or fields are missing: ${errors.join(',')}`)
    }
};

/**
 * Remove special characters that might be contained inside an string
 * @private
 * @param {String} string - string to sanitise
 * @return {string} - sanitised string
 */
function trim(string) {
    let blacklist = ' -\.\,\*';
    return validate.blacklist(string, blacklist);
}

/**
 * Set of functions to do short and yet recurrent validations across controllers and models
 * @module validations
 */
module.exports = {
    isMongoId: isMongoId,
    isAlphabetic: isAlphabetic,
    lengthValidator: lengthValidator,
    isAlphanumeric: isAlphanumeric,
    isEmail: isEmail,
    isURL: isURL,
    match: match,
    findConflicts: findConflicts,
    findEmptyFields: findEmptyFields
};

