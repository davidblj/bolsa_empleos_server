let supertest = require('supertest'),
    app = require('../../app/app'),
    wagner = require('wagner-core'),
    config = require('../../config/index'),
    chai = require('chai');

let request = supertest(app);
let expect = chai.expect;

let Company;
let company = require('../mocks/company');

exports.beforeAllTests = function (done) {

    let models = require('../../models/models')(wagner);
    Company = models.CompanyUser;

    request
        .post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send(company.companyUser)
        .end(function (err) {
            expect(err).to.be.null;
            done();
        });
};

exports.status400 = function (done) {

    request.post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send({})
        .end(function (err, res) {
            expect(res.statusCode).to.equal(400);
            done();
        });
};

exports.status401 = function (done) {

    let unknownLoginCredentials = {
        username: 'psl',
        password: 'pslPassword'
    };

    request
        .post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(unknownLoginCredentials)
        .end(function (err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
};

exports.status401Mismatch = function (done) {

    let incorrectCredentials = {
        username: 'pragma',
        password: 'wrongPassword'
    };

    request.post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(incorrectCredentials)
        .end(function (err, res) {
            expect(res.statusCode).to.equal(401);
            done();
        });
};

exports.jsonResponse = function (done) {

    request.post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(company.loginCredentials)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(res).to.be.json;
            done();
        });
};

exports.responseDetails = function (done) {

    request.post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(company.loginCredentials)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(res).to.be.json;
            expect(res.body.user).to.equal('pragma');
            expect(res.body.role).to.equal('company');
            expect(res.body.token).to.not.be.empty;
            done();
        });
};

exports.tokenDetails = function (done) {

    request.post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(company.loginCredentials)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(res).to.be.json;
            expect(res.body.user).to.equal('pragma');
            expect(res.body.role).to.equal('company');
            expect(res.body.token).to.not.be.empty;
            expect(res.body.token).to.be.a.jwt;
            expect(res.body.token).to.be.signedWith(config.secret);
            expect(res.body.token).to.be.a.jwt.and.have.claim('_id');
            expect(res.body.token).to.be.a.jwt.and.have.claim('name');
            expect(res.body.token).to.be.a.jwt.and.have.claim('role');
            expect(res.body.token).to.be.a.jwt.and.have.claim('exp');
            done();
        });
};

exports.afterAllTests = function () {

    after('delete all the company users in the database', function (done) {
        Company.remove({}, function (err) {
            expect(err).to.be.null;
            done()
        });
    });
};