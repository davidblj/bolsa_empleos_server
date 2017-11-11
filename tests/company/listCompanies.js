'use strict';

let supertest = require('supertest'),
    app = require('../../app/app'),
    wagner = require('wagner-core'),
    chai = require('chai');

let request = supertest(app);
let expect = chai.expect;

// URL

let rootURL = '/organizacion/';
let url = rootURL + 'listarEmpresas';

// Local variables

let Company;
let companyUser = {
    companyName: 'pragma',
    companyDetails: 'We focus our efforts in developing cutting edge software solutions',
    website: 'www.pragma.com',
    name: 'David',
    lastName: 'Jaramillo',
    contact: '3003102703',
    workingRole: 'Manager',
    nit: 'N2405',
    city: 'Medellin, Antioquia, Colombia',
    employmentSector: 'Software development',
    password: 'pragmaPassword',
};

exports.beforeAllTests = function () {
    console.log('i exist !');
    let models = require('../../models/models')(wagner);
    Company = models.CompanyUser;
};

exports.status200 = function(done) {
    request
        .get(url)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            done();
        })
};

exports.jsonResponse = function (done) {
    request
        .get(url)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(res).to.be.json;
            done();
        })
};

exports.emptyArray = function (done) {
    request
        .get(url)
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
    Company(companyUser).save(function (err) {
        expect(err).to.be.null;

        request
            .get(url)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('Array');
                expect(res.body.length).to.be.equal(1);
                expect(res.body[0].companyName).to.be.equal('pragma');
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