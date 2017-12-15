let chai = require('chai'),
    fetchJobsTests = require('./guest/fetch-jobs');

chai.use(require('chai-http'));
chai.use(require('chai-jwt'));

describe('Guest API', function () {

    describe('#GET /fetchJobs', function () {

        before('initialize models', fetchJobsTests.beforeAllTests);
        before('insert a list of jobs into the database', fetchJobsTests.insertJobs);

        it('should return status 200', fetchJobsTests.status200);
        it('should return Content-Type application/json response', fetchJobsTests.jsonResponse);
        it('should return all jobs when no query is provided', fetchJobsTests.noQuery);
        it('should return an empty response when a query result is empty', fetchJobsTests.noResults);
        it('should return all jobs from an intersection of two sets', fetchJobsTests.twoSets);
        it('should return all jobs from an intersection of tree sets', fetchJobsTests.treeSets);

        after('delete all jobs in the database', fetchJobsTests.afterAllTest);
    });
});