// libraries
const error = require(process.cwd() + '/utils/error');
const log = require(process.cwd() + '/utils/debug');

// services
const {getCandidate} = require(process.cwd() + '/services/candidate');

// projection is optional
module.exports = async (data, projection) => {

    if(!data) {
         throw error(status.BAD_REQUEST, 'at least one field of candidate schema is missing')
    }

    const query = buildQuery(data);
    return getCandidate(query, projection);
};

const buildQuery = (data) => {

    let options = [];
    let keys = Object.keys(data);

    for(let i = 0; i < keys.length; i++) {
        if (data.hasOwnProperty(keys[i])) {

            let field = {};
            field[keys[i]] = data[keys[i]];
            options.push(field);
        }
    }

    let query = {$or: options};
    log.common('query build: ', query);

    return query;
};