'use strict';

let supertest = require('supertest'),
    app = require('../../app/app'),
    wagner = require('wagner-core'),
    chai = require('chai');

let request = supertest(app);
let expect = chai.expect;

let Company;
let company = require('../mocks/company');

exports.beforeAllTests = function () {
    let models = require('../../models/models')(wagner);
    Company = models.CompanyUser;
};

exports.status200 = function(done) {

    request
        .get(company.listCompanies)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            done();
        })
};

exports.jsonResponse = function (done) {

    request
        .get(company.listCompanies)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(res).to.be.json;
            done();
        })
};

exports.emptyArray = function (done) {

    request
        .get(company.listCompanies)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('Array');
            expect(res.body).to.be.an('Array').that.is.empty;
            done();
        })
};

exports.companyDetails = function (done) {

    let companyUser = company.companyUser;

    Company(companyUser).save(function (err) {
        expect(err).to.be.null;

        request
            .get(company.listCompanies)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('Array');
                expect(res.body.length).to.be.equal(1);
                expect(res.body[0].companyName).to.be.equal(companyUser.companyName);
                done();
            });
    });
};

exports.afterEachTest = function (done) {
    Company.remove({}, function (err) {
        expect(err).to.be.null;
        done()
    })
};