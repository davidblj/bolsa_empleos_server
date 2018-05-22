const { mostRecentPagingPipe } = require(process.cwd() + '/utils/pagination/pipes');
const { match } = require(process.cwd() + '/utils/pagination/stages');
const log = require(process.cwd() + '/utils/debug');
const jobModel = require(process.cwd() + '/models/company/job');

module.exports = (currentId, offset, pageSize, state, company) => {

    if (!pageSize) pageSize = 10;

    let pipe = [];

    let matchStage = getStatePipe(state, company);
    pipe.push(matchStage);

    let paginationPipe = mostRecentPagingPipe(currentId, offset, pageSize);
    pipe = pipe.concat(paginationPipe);

    log.common(pipe);
    return jobModel.aggregate(pipe).exec();
};

function getStatePipe(state, company) {

    let pipe;
    let currentDay = getLocalTime();
    log.common(`local time is currently at: ${currentDay.toISOString()}`);

    if (state === 'active') {
        pipe = match({ $and: [
                {owner: company},
                {expiry: { $gte: currentDay}} ]
        });
    }

    if (state === 'disabled') {
        pipe = match({ $and: [
                {owner: company},
                {expiry: { $lt: currentDay}} ]
        });
    }

    return pipe;
}

function getLocalTime() {

    let date = new Date();
    let offsetInMillis = date.getTimezoneOffset() * 60 * 1000;
    let localTimeInMillis = date.getTime() - offsetInMillis;
    return new Date(localTimeInMillis);
}
