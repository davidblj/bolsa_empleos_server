     // libraries
const status = require('http-status');
const error = require(process.cwd() + '/utils/error');

// services
const {updateJob} = require(process.cwd() + '/services/job');
const {getJob} = require(process.cwd() + '/services/job');
const {updateCandidate} = require(process.cwd() + '/services/candidate');

// controllers


module.exports = async (userId, jobId) => {

    // todo: the job id query can be moved up in to a middleware
    // the ids are already verified on the "idParsing" middleware
    let query = {_id: jobId};
    let job = await getJob(query);

    if (!job) {
        throw error(status.NOT_FOUND, 'Job id not found');
    }

    let applies = job.applicants.users.some((id) => id.equals(userId));

    if (!applies) {
        throw error(status.CONFLICT, 'The specified user is not applying in to this job');
    }

    let update = {
        $pull: {'applicants.users': userId},
        $inc: {'applicants.amount': -1}
    };
    query = {_id: jobId};

    // model validations are skipped
    await updateJob(query, update);

    update = { $pull: { jobs: jobId }};
    query = {_id: userId};

    await updateCandidate(query, update);
};
