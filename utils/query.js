const log = require(process.cwd() + '/utils/debug');

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

module.exports = {
    buildQuery: buildQuery
};