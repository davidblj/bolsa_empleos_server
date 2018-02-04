let userModel = require('../models/company/user');

const getCompany = (query, projection) => {
    let modelMethod = userModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

module.exports = {
    getCompany: getCompany
};
