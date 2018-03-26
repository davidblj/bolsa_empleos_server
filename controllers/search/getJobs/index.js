const {
    mostRecentPagingPipe,
    projectionPipe } = require('./pipes');
const log = require(process.cwd() + '/utils/debug');
const jobModel = require(process.cwd() + '/models/company/job');

/**
 * Controller definition to paginate through jobs
 * @function search/getJobs
 * @param {String} [sort] - an string that is either 'created', 'salary', or 'popularity'. The pagination will be ordered
 * by theses constraints. 'created': from the newest posted job, to the oldest, ...
 * @param {String} [currentId] - the current id where you are standing, or the first "id" of the element in the list
 * returned by the last request. If this parameter is not provided, the first page will be returned instead
 * @param {Number} [offset] - a positive or negative value representing the next page to jump to. A negative value
 * will jump "offset" times to the left in the current page (or id, to say so). A positive value will jump "offset"
 * times to the right in the current page
 * @param {Number} [pageSize] - the number of items on each page
 * @return {Promise}
 */
module.exports = (sort, currentId, offset, pageSize) => {

    if (!pageSize) pageSize = 10;
    if (!sort) sort = 'created';

    let pipe;

    switch (sort) {
        case 'created':
            pipe = mostRecentPagingPipe(currentId, offset, pageSize);
            break;
        case 'salary':
            break;
        case 'popularity':
            break;
    }

    log.common('pipe :', pipe);
    let aggregate = jobModel.aggregate(pipe);

    pipe = projectionPipe();
    return aggregate.append(pipe).exec();
};
