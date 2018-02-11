const jobModel = require('../models/company/job');

const createJob = (data) => {
    return jobModel.create(data);
};

const getJob = (query, projection) => {
    let modelMethod = jobModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

const updateJob = (query, update, options) => {
    let modelMethod = jobModel.findOneAndUpdate(query,update);
    return options ? modelMethod.setOptions(options).exec() : modelMethod.exec()
};

module.exports = {
    createJob: createJob,
    getJob: getJob,
    updateJob: updateJob
};
