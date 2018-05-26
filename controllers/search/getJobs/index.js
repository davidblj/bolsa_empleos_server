const {
    getSizePipe,
    mostRecentPagingPipe,
    projectionPipe } = require('../../../utils/pagination/pipes');
const {
    match,
    text,
    _in,
    _and } = require(process.cwd() + '/utils/pagination/stages');
const error = require(process.cwd() + '/utils/error');
const status = require('http-status');
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
 * @param {String} [query] - a filter that may contain a search, a type, an audience or a salary criteria
 * @param {Number} [offset] - a positive or negative value representing the next page to jump to. A negative value
 * will jump "offset" times to the left in the current page (or id, to say so). A positive value will jump "offset"
 * times to the right in the current page
 * @param {Number} [pageSize] - the number of items on each page. If no page size is provided, the default size is of
 * 10 jobs
 * @return {Promise}
 */
module.exports = async (sort, currentId, offset, query, pageSize) => {

    if (!pageSize) pageSize = 10;
    if (!sort) sort = 'created';

    let pipe,
        filteringPipe,
        pagingPipe,
        documentCount;

    filteringPipe = buildFilteringPipe(query);
    documentCount = await getQuerySize(filteringPipe);

    pagingPipe = buildPagingPipe(sort, currentId, offset, pageSize);
    pipe = filteringPipe.concat(pagingPipe);

    log.common('pipe :', JSON.stringify(pipe, null, 2));
    let items = await jobModel.aggregate(pipe).exec();
    return {'total_count': documentCount, items: items}
};


function buildFilteringPipe(query) {

    let pipe = [];

    if (query) {
        if (query.search) pipe.push(matchByTextStage(query.search));
        if (query.type) pipe.push(matchByFieldStage('type', query.type));
        if (query.audience) pipe.push(matchByFieldStage('to', query.audience));
        if (query.salary) pipe.push(matchBySalaryRangeStage(query.salary));
    }

    return pipe;
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

function matchByTextStage(value) {
    return match(text(value));
}

function matchByFieldStage(field, values) {

    let arrayOfValues = values.split(',');
    let matchObject = {};
    matchObject[field] = _in(arrayOfValues);

    return match(matchObject);
}

function matchBySalaryRangeStage(salary)  {

    let range = salary.split('..');
    if (range.length === 1)
        throw error(status.BAD_REQUEST, "The salary is not in the correct format: min..max");

    let min = parseInt(range[0]) * (Math.pow(10, 6));
    let max = parseInt(range[1]) * (Math.pow(10, 6));
    let arrayOfValues = [{salary: {$gte: min}}, {salary: {$lte: max}}];

    return match(_and(arrayOfValues))
}
