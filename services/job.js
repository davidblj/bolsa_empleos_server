const jobModel = require('../models/company/job');

let getJob = (query, projection) => {
    let modelMethod = jobModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

let updateJob = (query, update, options) => {
    let modelMethod = jobModel.findOneAndUpdate(query,update);
    return options ? modelMethod.setOptions(options).exec() : modelMethod.exec()
};

module.exports = {
    getJob: getJob,
    updateJob: updateJob
};
