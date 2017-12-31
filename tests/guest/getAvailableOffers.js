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

exports.searchJobs = function (done) {

    request
        .get(job.getJobsURL)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.be.equal(200);
            done()
        });
};

exports.afterAllTest = function (done) {

    Job.remove({}, function (err) {
        expect(err).to.be.null;
        done();
    });
};