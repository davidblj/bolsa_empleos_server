let supertest = require('supertest'),
    app = require('../../app/app'),
    wagner = require('wagner-core'),
    chai = require('chai');

let request = supertest(app);
let expect = chai.expect;

let Company;
let Applicant;
let company = require('../mocks/company');
let applicant = require('../mocks/applicant');

exports.beforeAllTests = function () {

    let models = require('../../models/models')(wagner);
    Company = models.CompanyUser;
    Applicant = models.Applicant;
};

exports.insertACompanyUser = function (done) {

    request
        .post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send(company.companyUser)
        .end(function (err) {
            expect(err).to.be.null;
            done();
        })
};

exports.insertAnApplicantUser = function (done) {

    request
        .post(applicant.registrationURL)
        .set('Content-Type', 'application/json')
        .send(applicant.applicantUser)
        .end(function (err) {
            expect(err).to.be.null;
            done();
        })
};

exports.status403 = function (done) {

    request
        .post(applicant.loginURL)
        .set('Content-Type', 'application/json')
        .send(applicant.loginCredentials)
        .end(function (err, res) {

            expect(err).to.be.null;
            let jwt = res.body.token;
            request
                .get(company.getProfile)
                .set('x-access-token', jwt)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(403);
                    done();
                })
        })
};

exports.status200 = function (done) {

    request
        .post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(company.loginCredentials)
        .end(function (err, res) {

            expect(err).to.be.null;
            let jwt = res.body.token;
            request
                .get(company.getProfile)
                .set('x-access-token', jwt)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(200);
                    done();
                })
        });
};

exports.jsonResponse = function (done) {

    request
        .post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(company.loginCredentials)
        .end(function (err, res) {

            expect(err).to.be.null;
            let jwt = res.body.token;
            request
                .get(company.getProfile)
                .set('x-access-token', jwt)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(200);
                    expect(res).to.be.json;
                    done();
                })
        });
};

exports.details = function (done) {

    let companyUser = company.companyUser;
    request
        .post(company.loginURL)
        .set('Content-Type', 'application/json')
        .send(company.loginCredentials)
        .end(function (err, res) {

            expect(err).to.be.null;
            let jwt = res.body.token;
            request
                .get(company.getProfile)
                .set('x-access-token', jwt)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(200);
                    expect(res).to.be.json;
                    expect(res.body.companyName).to.be.equal(companyUser.companyName);
                    expect(res.body.companyDetails).to.be.equal(companyUser.companyDetails);
                    expect(res.body.website).to.be.equal(companyUser.website);
                    expect(res.body.name).to.be.equal(companyUser.name);
                    expect(res.body.lastName).to.be.equal(companyUser.lastName);
                    expect(res.body.contact).to.be.equal(companyUser.contact);
                    expect(res.body.workingRole).to.be.equal(companyUser.workingRole);
                    expect(res.body.nit).to.be.equal(companyUser.nit);
                    expect(res.body.city).to.be.equal(companyUser.city);
                    expect(res.body.employmentSector).to.be.equal(companyUser.employmentSector);
                    done();
                })
        });
};

exports.afterAllTest = function (done) {

    Company.remove({}, function (err) {
        expect(err).to.be.null;

        Applicant.remove({}, function (err) {
            expect(err).to.be.null;
            done()
        });
    });
};