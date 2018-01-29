let userModel = require('../models/candidate/user');

let createCandidate = (data) => {
    return userModel.create(data);
};

let getCandidate = (query, projection) => {
    let modelMethod = userModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

let updateCandidate = (query, update, options) => {
    let modelMethod = userModel.findOneAndUpdate(query,update);
    return options ? modelMethod.setOptions(options).exec() : modelMethod.exec()
};

module.exports = {
    createCandidate: createCandidate,
    getCandidate: getCandidate,
    updateCandidate: updateCandidate
};