const {
    getSizePipe,
    mostRecentPagingPipe,
    projectionPipe } = require('../../../utils/pagination/pipes');
const log = require(process.cwd() + '/utils/debug');
const jobModel = require(process.cwd() + '/models/company/job');

/**
 * Controller definition to paginate through jobs
 * @function search/getJobs
 * @param {String} [sort] - an string that is either 'created' (default), 'salary', or 'popularity'. The pagination
 * will be ordered by theses constraints. 'created': from the newest posted job, to the oldest, 'salary': from the
 * highest salary to the lowest, and 'popularity': from the most popular, to the least popular.
 * @param {String} [currentId] - the current id where you are standing, or the first "id" of the element in the list
 * returned by the last request. If this parameter is not provided, the first page will be returned instead
 * @param {Number} [offset] - a positive or negative value representing the next page to jump to. A negative value
 * will jump "offset" times to the left in the current page (or id, to say so). A positive value will jump "offset"
 * times to the right in the current page
 * @param {Number} [pageSize] - the number of items on each page. If no page size is provided, the default size is of
 * 10 jobs
 * @return {Promise}
 */
module.exports = async (sort, currentId, offset, pageSize) => {

    if (!pageSize) pageSize = 10;
    if (!sort) sort = 'created';

    let pipe,
        sizeDocument;

    pipe = getSizePipe();
    sizeDocument = await jobModel.aggregate(pipe).exec();

    log.common('size :', sizeDocument);

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
    let items = await aggregate.append(pipe).exec();

    return {'total_count': sizeDocument[0].total_count, items: items}
};
