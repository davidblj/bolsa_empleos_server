const validate = require('validator');

//
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
 * @memberof model-validations
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
 * @memberof model-validations
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
 * @memberof model-validations
 * @function
 * @param {Number} min - lowest bound
 * @param {Number} max - highest bound
 * @return {{validator: function( (String|Number) ): boolean, message: string}}
 */
const lengthValidator = (min, max) => ({
    validator: (value) => validate.isLength(value.toString(), {min: min, max: max}),
    message: `{VALUE} must be within a range of ${min}-${max} characters`
});

const expiryValidator = () => ({
    validator: (value) => (new Date(value).getTime() >= (new Date()).getTime()),
    message: `{VALUE} must be a date that must have a higher value than today's date`
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
 * Set of functions to do short and yet recurrent validations across mongoose models
 * @module model-validations
 */
module.exports = {
    isMongoId: isMongoId,
    isAlphabetic: isAlphabetic,
    lengthValidator: lengthValidator,
    expiryValidator: expiryValidator,
    isAlphanumeric: isAlphanumeric,
    isEmail: isEmail,
    isURL: isURL,
    match: match,
};

