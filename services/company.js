const userModel = require('../models/company/user');

const createCompany = (data) => {
    return userModel.create(data);
};

const getCompany = (query, projection, lean) => {
    let modelMethod = userModel.findOne(query);
    if (projection) modelMethod.select(projection);
    return lean ? modelMethod.lean(true).exec() : modelMethod.exec()
};

module.exports = {
    createCompany: createCompany,
    getCompany: getCompany
};
