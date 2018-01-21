const validate = require('validator');

// todo(1): password validation: it must contain at least 1 number
// todo(2): define a cellphone Regex for colombia (do a contribution to validator.js)

const isMongoId = () => ({
    validator: (value) => validate.isMongoId(value),
    message: '{VALUE} is not valid MongoDB id'
});

const stringValidator = () => ({
    validator: (value) => validate.isAlpha(value, 'es-ES'),
    message: '{VALUE} must only contain letters'
});

const lengthValidator = (min, max) => ({
    validator: (value) => validate.isLength(value, {min: min, max: max}),
    message: '{VALUE} must have a minimum length of ' + min + " and a maximum length of " + max
});

const isAlphanumeric = () => ({
    validator: (value) => validate.isAlphanumeric(value, 'es-ES'),
    message: '{PATH} must contain letters or numbers'
});

const isEmail = () => ({
    validator: (value) => validate.isEmail(value),
    message: '{VALUE} must be a valid email'
});

const isNumeric = () => ({
    validator: (value) => validate.isNumeric(value),
    message: '{VALUE} is not of type {TYPE}'
});

const isURL = () => ({
    validator: (value) => validate.isURL(value),
    message: '{VALUE} is not a valid URL'
});

const match = (comparators) => ({
   validator: (value) => comparators.some((element) => {
       return element === value;
   }),
    message: '{VALUE} is not a valid {PATH}'
});

/*const isMobilePhone = () => ({
    validator: (value) => validate.isMobilePhone(value, 'any'),
    message: '{VALUE} is not a valid mobile phone number'
});*/

module.exports = {
    isMongoId: isMongoId,
    stringValidator: stringValidator,
    lengthValidator: lengthValidator,
    isAlphanumeric: isAlphanumeric,
    isEmail: isEmail,
    isNumeric: isNumeric,
    isURL: isURL,
    match: match
};

