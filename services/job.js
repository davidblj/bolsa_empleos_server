const jobModel = require('../models/company/job');

const createJob = (data) => {
    return jobModel.create(data);
};

const getJob = (query, projection) => {
    let modelMethod = jobModel.findOne(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

const getJobs = (query, projection) => {
    let modelMethod = jobModel.find(query);
    return projection ? modelMethod.select(projection).exec() : modelMethod.exec()
};

const updateJob = (query, update, options) => {
    let modelMethod = jobModel.findOneAndUpdate(query,update);
    return options ? modelMethod.setOptions(options).exec() : modelMethod.exec()
};

const getCandidates = async (query, projection) => {
    let modelMethod = jobModel.findOne(query);

    let options = {path: 'applicants.users'};
    if (projection) options.select = projection;

    let job = await modelMethod.populate(options).exec();
    return job.applicants;
};

module.exports = {
    createJob: createJob,
    getJob: getJob,
    getJobs: getJobs,
    updateJob: updateJob,
    getCandidates: getCandidates
};
