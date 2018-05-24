const {
    getSizePipe,
    mostRecentPagingPipe,
    projectionPipe } = require('../../../utils/pagination/pipes');
const { match } = require(process.cwd() + '/utils/pagination/stages');
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
 * @param {String} [type] - the job modality that is either: ---
 * @param {String} [audience] - the type of user that a job offer requests: ---
 * @param {Number} [offset] - a positive or negative value representing the next page to jump to. A negative value
 * will jump "offset" times to the left in the current page (or id, to say so). A positive value will jump "offset"
 * times to the right in the current page
 * @param {Number} [pageSize] - the number of items on each page. If no page size is provided, the default size is of
 * 10 jobs
 * @return {Promise}
 */
module.exports = async (sort, currentId, offset, type, audience, pageSize) => {

    if (!pageSize) pageSize = 10;
    if (!sort) sort = 'created';

    let pipe,
        filteringPipe,
        pagingPipe,
        documentCount;

    filteringPipe = buildFilteringPipe(type, audience);
    documentCount = await getQuerySize(filteringPipe);

    pagingPipe = buildPagingPipe(sort, currentId, offset, pageSize);
    pipe = filteringPipe.concat(pagingPipe);

    log.common('pipe :', JSON.stringify(pipe, null, 2));
    let items = await jobModel.aggregate(pipe).exec();
    return {'total_count': documentCount, items: items}
};


function buildFilteringPipe(type, audience) {

    let pipe = [];
    if (type) pipe.push(matchByFieldPipe('type', type));
    if (audience) pipe.push(matchByFieldPipe('to', audience));
    return pipe
}

function buildPagingPipe(sort, currentId, offset, pageSize) {

    let pipe = [];
    switch (sort) {
        case 'created':
            pipe = mostRecentPagingPipe(currentId, offset, pageSize);
            break;
        case 'popularity':
            break;
        case 'salary':
            break;
    }

    return pipe.concat(projectionPipe());
}

async function getQuerySize(pipe) {

    let sizePipe = getSizePipe();
    pipe = pipe.concat(sizePipe);

    let querySize = await jobModel.aggregate(pipe).exec();
    return querySize[0] ? querySize[0].total_count: 0;
}

function matchByFieldPipe(field, values) {

    let valuesArray = values.split(',');
    let matchObject = {};
    matchObject[field] = { $in: valuesArray};
    return match(matchObject);
}
