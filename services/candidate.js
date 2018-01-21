let userModel = require(process.cwd() + '/models/candidate/user');

let createCandidate = (data) => {
    return userModel.create(data);
};

let getCandidate = (query, projection) => {
    let modelMethod = userModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

module.exports = {
    createCandidate: createCandidate,
    getCandidate: getCandidate
};