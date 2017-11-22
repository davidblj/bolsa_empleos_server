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

exports.status400 = function (done) {

    request.post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send({})
        .end(function (err, res) {
            expect(res.statusCode).to.equal(400);
            done();
        })
};

exports.status409 = function (done) {

    Company(company.companyUser).save(function (err) {
        expect(err).to.be.null;

        request
            .post(company.registrationURL)
            .set('Content-Type', 'application/json')
            .send(company.companyUser)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(409);
                done();
            });
    });
};

exports.status201 = function (done) {

    request
        .post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send(company.companyUser)
        .end(function (err, res) {
            expect(res.statusCode).to.equal(201);
            done();
        });
};

exports.jsonResponse = function (done) {

    request
        .post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send(company.companyUser)
        .end(function (err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res).to.be.json;
            done();
        });
};

exports.stringResponse = function (done) {

    request
        .post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send(company.companyUser)
        .end(function (err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res).to.be.json;
            expect(res.body.message).to.be.a('string');
            done();
        });
};

exports.successfulRegistration = function (done) {

    request
        .post(company.registrationURL)
        .set('Content-Type', 'application/json')
        .send(company.companyUser)
        .end(function (err, res) {
            expect(res.statusCode).to.equal(201);
            expect(res).to.be.json;
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Successful registration');
            done();
        });
};

exports.afterEachTest = function (done) {
    Company.remove({}, function (err) {
        expect(err).to.be.null;
        done()
    })
};