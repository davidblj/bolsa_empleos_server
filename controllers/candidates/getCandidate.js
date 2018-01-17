const {getCandidate} = require('../../services/candidate');

module.exports = async (data) => {

    const query = buildQuery(data);
    return getCandidate(query);
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
    return { $or: options};
};