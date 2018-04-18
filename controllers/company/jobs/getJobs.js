const { mostRecentPagingPipe } = require(process.cwd() + '/utils/pagination/pipes');
const { match } = require(process.cwd() + '/utils/pagination/stages');
const log = require(process.cwd() + '/utils/debug');
const jobModel = require(process.cwd() + '/models/company/job');

module.exports = (currentId, offset, pageSize, company) => {

    if (!pageSize) pageSize = 10;

    let pipe = [];

    let matchStage = match({owner: company});
    pipe.push(matchStage);

    let paginationPipe = mostRecentPagingPipe(currentId, offset, pageSize);
    pipe = pipe.concat(paginationPipe);

    log.common(pipe);
    return jobModel.aggregate(pipe).exec();
};
