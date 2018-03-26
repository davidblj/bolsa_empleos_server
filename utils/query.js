const log = require(process.cwd() + '/utils/debug');

/**
 * Utility to build a mongoDB query. This query will attach
 * every field in "fields" to an "or" array. Take a look at:
 * https://docs.mongodb.com/manual/reference/operator/query/or/index.html
 * @param {Object} fields - an object whose keys will be processed to a search query
 * @return {{$or: Array}} - a mongoDB "or" array.
 */
const buildQuery = (fields) => {

    let options = [];
    let keys = Object.keys(fields);

    for(let i = 0; i < keys.length; i++) {
        if (fields.hasOwnProperty(keys[i])) {

            let field = {};
            field[keys[i]] = fields[keys[i]];
            options.push(field);
        }
    }

    let query = {$or: options};
    log.common('query build: ', query);

    return query;
};

/**
 * Some fields might not exist when a query is issued. This function set those fields from "undefined" to empty ''.
 * @private
 * @param fields - json object to sanitise
 * @return {string} - the sanitised "fields" object
 */
function fieldSanitation(fields) {

    let keys = Object.keys(fields);

    for(let i = 0; i < keys.length; i++) {
        if (fields.hasOwnProperty(keys[i])) {

            if (!fields[keys[i]]) fields[keys[i]] = '';
        }
    }

    return fields;
}

module.exports = {
    buildQuery: buildQuery,
    fieldSanitation: fieldSanitation
};
