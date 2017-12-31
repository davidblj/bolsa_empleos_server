let supertest = require('supertest'),
    app = require('../../app/app'),
    wagner = require('wagner-core'),
    chai = require('chai');

let request = supertest(app);
let expect = chai.expect;

let Job;
let job = require('../mocks/job');

exports.beforeAllTests = function () {

    let models = require('../../models/models')(wagner);
    Job = models.Job;
};

exports.insertJobsToFilter = function (done) {

    Job.insertMany(job.jobs_filter, function (err) {
        expect(err).to.be.null;
        done();
    });
};

exports.status200 = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByUnknownValue)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            done()
        });
};

exports.jsonResponse = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByUnknownValue)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            done()
        });
};

exports.noQuery = function (done) {

    request
        .get(job.fetchJobsURL)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(3);
            // console.log(res.body);
            done()
        });
};

exports.noResults = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByUnknownValue)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').that.is.empty;
            done();
        });
};

exports.searchByText = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByText)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(1);

            expect(res.body[0].jobName).to.be.equal('Web UI Developer');
            done()
        });
};

exports.searchByMultipleValues = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByMultipleValues)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(2);
            expect(res.body[0].jobName).to.be.equal('Web UI Developer');
            expect(res.body[1].jobName).to.be.equal('Software Engineer');
            done()
        });
};

exports.searchBySalary = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryBySalary)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(2);

            expect(res.body[0].jobName).to.be.equal('Web UI Developer');
            expect(res.body[1].jobName).to.be.equal('Software Engineer');
            done()
        });
};

exports.twoSets = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByJobAndRole)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(2);

            expect(res.body[0].jobName).to.be.equal('Software Developer');
            expect(res.body[1].jobName).to.be.equal('Web UI Developer');
            done()
        });
};

exports.threeSets = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByLanguageJobAndRole)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(1);

            expect(res.body[0].jobName).to.be.equal('Software Developer');
            done()
        });
};

exports.searchByAllOptions = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByAllOptions)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(1);

            expect(res.body[0].jobName).to.be.equal('Web UI Developer');
            done()
        });
};

exports.insertJobsToPaginate = function (done) {

    Job.insertMany(job.jobs_pagination, function (err) {
        expect(err).to.be.null;
        done();
    });
};

exports.forwardPagination = function (done) {

    request
        .get(job.fetchJobsURL)
        .end(function (err, res) {
            expect(err).to.be.null;

            let currentId = res.body[0]._id;
            let query = { currentId: currentId, pageJump: 1};
            request
                .get(job.fetchJobsURL)
                .query(query)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.be.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.be.an('Array').to.have.lengthOf(3);

                    expect(res.body[0].jobName).to.be.equal('Marketing analyst');
                    done();
                });
        });
};

exports.backwardPagination = function (done) {

    request
        .get(job.fetchJobsURL)
        .end(function (err, res) {
            expect(err).to.be.null;

            let currentId = res.body[0]._id;
            let query = { currentId: currentId, pageJump: 2};
            request
                .get(job.fetchJobsURL)
                .query(query)
                .end(function (err, res) {
                    expect(err).to.be.null;

                    let currentId = res.body[0]._id;
                    query = { currentId: currentId, pageJump: -1};
                    request
                        .get(job.fetchJobsURL)
                        .query(query)
                        .end(function (err, res) {
                            expect(err).to.be.null;
                            expect(res.statusCode).to.be.equal(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.an('Array');
                            expect(res.body).to.be.an('Array').to.have.lengthOf(3);

                            expect(res.body[0].jobName).to.be.equal('Marketing analyst');
                            done();
                        });
                });
        });
};

exports.forwardPaginationByTime = function () {

    request
        .get(job.fetchJobsURL)
        .query(job.paginateByDate)
        .end(function (err, res) {
            expect(err).to.be.null;

            console.log(res.body)
            // todo: paginate
        })
};

exports.afterAllTest = function (done) {

    Job.remove({}, function (err) {
        expect(err).to.be.null;
        done();
    });
};