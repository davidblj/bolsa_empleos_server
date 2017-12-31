let chai = require('chai'),
    fetchJobsTests = require('./guest/fetch-jobs'),
    getAvailableOffersTests = require('./guest/getAvailableOffers');

chai.use(require('chai-http'));
chai.use(require('chai-jwt'));

describe('Guest API', function () {

    // todo: finish this test suite
    describe('#GET /getAvailableOffers', function () {

        before('initialize models', fetchJobsTests.beforeAllTests);
        before('insert a list of jobs into the database', fetchJobsTests.insertJobsToFilter);

        it('should return all available jobs', getAvailableOffersTests.searchJobs);

        after('delete all jobs in the database', fetchJobsTests.afterAllTest);
    });

    describe('#GET /fetchJobs', function () {

        before('initialize models', fetchJobsTests.beforeAllTests);

        describe('with filters', function () {

            before('insert a list of jobs into the database to filter', fetchJobsTests.insertJobsToFilter);

            it('should return status 200', fetchJobsTests.status200);
            it('should return Content-Type application/json response', fetchJobsTests.jsonResponse);
            it('should return all jobs when no query is provided', fetchJobsTests.noQuery);
            it('should return an empty response when a query result is empty', fetchJobsTests.noResults);

            it('should return all jobs from a search by text', fetchJobsTests.searchByText);
            it('should return all jobs from a search by salary', fetchJobsTests.searchBySalary);
            it('should return all jobs from a search on one field with multiple values', fetchJobsTests.searchByMultipleValues);
            it('should return all jobs from an intersection of two sets', fetchJobsTests.twoSets);
            it('should return all jobs from an intersection of three sets', fetchJobsTests.threeSets);
            it('should return all jobs from a search by text, salary and an intersection of two sets', fetchJobsTests.searchByAllOptions);

            after('delete all jobs in the database', fetchJobsTests.afterAllTest);
        });

        describe('with pagination', function () {

            before('insert a list of jobs into the database to paginate', fetchJobsTests.insertJobsToPaginate);

            it('should return all jobs of page 2', fetchJobsTests.forwardPagination);
            it('should return all jobs of page 2, by jumping from page to 3 to page 2', fetchJobsTests.backwardPagination);
            it('should return ...', fetchJobsTests.forwardPaginationByTime);

            after('delete all jobs in the database', fetchJobsTests.afterAllTest);
        });
    });
});