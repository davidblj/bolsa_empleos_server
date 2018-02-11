const userModel = require('../models/company/user');

const createCompany = (data) => {
    return userModel.create(data);
};

const getCompany = (query, projection) => {
    let modelMethod = userModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

module.exports = {
    createCompany: createCompany,
    getCompany: getCompany
};
