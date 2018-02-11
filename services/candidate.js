const userModel = require('../models/candidate/user');

const createCandidate = (data) => {
    return userModel.create(data);
};

const getCandidate = (query, projection) => {
    let modelMethod = userModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

const updateCandidate = (query, update, options) => {
    let modelMethod = userModel.findOneAndUpdate(query,update);
    return options ? modelMethod.setOptions(options).exec() : modelMethod.exec()
};

module.exports = {
    createCandidate: createCandidate,
    getCandidate: getCandidate,
    updateCandidate: updateCandidate
};
