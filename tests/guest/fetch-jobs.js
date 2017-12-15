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

exports.insertJobs = function (done) {

    Job.insertMany(job.jobs, function (err) {
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

            expect(res.body[1].jobName).to.be.equal('Software developer 2');
            expect(res.body[1].languages).to.be.equal('Portuguese');
            done()
        });
};

exports.treeSets = function (done) {

    request
        .get(job.fetchJobsURL)
        .query(job.queryByLanguageJobAndRole)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').to.have.lengthOf(1);

            expect(res.body[0].jobName).to.be.equal('Software developer 1');
            expect(res.body[0].languages).to.be.equal('English');
            done()
        });
};

exports.afterAllTest = function (done) {

    Job.remove({}, function (err) {
        expect(err).to.be.null;
        done();
    });
};