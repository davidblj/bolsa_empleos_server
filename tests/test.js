let supertest = require('supertest'),
    wagner = require('wagner-core'),
    chai = require('chai'),
    app = require('../app/app'),
    config = require('../config/index'),
    listCompaniesTests = require('./company/listCompanies');

let request = supertest(app);
let expect = chai.expect;

chai.use(require('chai-http'));
chai.use(require('chai-jwt'));

describe('Organization API', function() {

    let rootURL = '/organizacion/';

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

    before(listCompaniesTests.beforeAllTests);

    describe('#GET /listarEmpresas', function () {

        it('should return status 200', listCompaniesTests.status200);
        it('should return a Content-Type application/json response', listCompaniesTests.jsonResponse);
        it('should return a response message as an empty Array', listCompaniesTests.emptyArray);
        it('should return the correct company details', listCompaniesTests.companyDetails);

        afterEach('delete company users in the database', listCompaniesTests.afterEachTest);
    });

    // todo: add tests for a minimun length in the user credentials and for fields with non alphanumeric characters
    describe('#POST /registrar', function () {

        let url = rootURL + 'registrar';

        beforeEach('delete all company users in the database', function (done) {
            Company.remove({}, function (err) {
                expect(err).to.be.null;
                done()
            })
        });

        it('it should return status 400 when no data is provided', function(done) {

            request.post(url)
                .set('Content-Type', 'application/json')
                .send({})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                })
        });

        it('it should return status 409 when a user already exist', function (done) {

            Company(companyUser).save(function (err) {
                expect(err).to.be.null;

                request
                    .post(url)
                    .set('Content-Type', 'application/json')
                    .send(companyUser)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(409);
                        done();
                    });
            });
        });

        it('it should return status 201', function (done) {
            request
                .post(url)
                .set('Content-Type', 'application/json')
                .send(companyUser)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(201);
                    done();
                });
        });

        it('should return a Content-Type application/json response', function (done) {
            request
                .post(url)
                .set('Content-Type', 'application/json')
                .send(companyUser)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(201);
                    expect(res).to.be.json;
                    console.log(res.body);
                    done();
                });
        });

        it('should return a string response', function (done) {
            request
                .post(url)
                .set('Content-Type', 'application/json')
                .send(companyUser)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(201);
                    expect(res).to.be.json;
                    expect(res.body.message).to.be.a('string');
                    done();
                });
        });

        it('should return a successful registration response ', function (done) {
            request
                .post(url)
                .set('Content-Type', 'application/json')
                .send(companyUser)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(201);
                    expect(res).to.be.json;
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.be.equal('Successful registration');
                    done();
                });
        });
    });


    // todo: add test for a minimun length in the login credentials
    describe('#POST /login', function () {

        let loginURL = rootURL + 'login';
        let registrationURL = rootURL + 'registrar';
        let loginCredentials = {
            companyName: 'pragma',
            password: 'pragmaPassword'
        };

        before('insert a new company in to the db', function (done) {

            request
                .post(registrationURL)
                .set('Content-Type', 'application/json')
                .send(companyUser)
                .end(function (err) {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('it should return status 400 when no data is provided', function(done) {

            request.post(loginURL)
                .set('Content-Type', 'application/json')
                .send({})
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                });
        });

        it('it should return status 401 when the username don\'t exist', function(done) {
            let unknownLoginCredentials = {
              companyName: 'psl',
              password: 'pslPassword'
            };

            request.post(loginURL)
                .set('Content-Type', 'application/json')
                .send(unknownLoginCredentials)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    done();
                });
        });

        it('it should return status 401 when the user\'s password don\'t match', function(done) {
            let incorrectCredentials = {
                companyName: 'pragma',
                password: 'wrongPassword'
            };

            request.post(loginURL)
                .set('Content-Type', 'application/json')
                .send(incorrectCredentials)
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(401);
                    done();
                });
        });

        it('should return a Content-Type application/json response', function (done) {

            request.post(loginURL)
                .set('Content-Type', 'application/json')
                .send(loginCredentials)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.be.json;
                    done();
                });
        });

        it('should return a json with the corresponding username, role and token', function (done) {

            request.post(loginURL)
                .set('Content-Type', 'application/json')
                .send(loginCredentials)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body.user).to.equal('pragma');
                    expect(res.body.role).to.equal('company');
                    expect(res.body.token).to.not.be.empty;
                    done();
                });
        });

        it('should return a json with a valid token signature', function (done) {

            request.post(loginURL)
                .set('Content-Type', 'application/json')
                .send(loginCredentials)
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
        });

        after('delete all the company users in the database', function (done) {
            Company.remove({}, function (err) {
                expect(err).to.be.null;
                done()
            });
        });
    });

    /*describe('#POST /nuevaOferta', function () {

    });*/

    // todo: finish this test suite
    describe('#POST /perfil', function () {

        let loginCredentials = {
            companyName: 'pragma',
            password: 'pragmaPassword'
        };

        before('insert a new company in to the db', function (done) {

            let registrationURL = rootURL + 'registrar';

            request
                .post(registrationURL)
                .set('Content-Type', 'application/json')
                .send(companyUser)
                .end(function (err) {
                    expect(err).to.be.null;
                    done();
                });
        });

        it('can load details', function (done) {
            let profileURL = rootURL + 'retornarPerfil';
            let loginURL = rootURL + 'login';

            request
                .post(loginURL)
                .set('Content-Type', 'application/json')
                .send(loginCredentials)
                .end(function (err, res) {

                    expect(err).to.be.null;
                    let jwt = res.body.token;
                    request
                        .get(profileURL)
                        .set('x-access-token', jwt)
                        .end(function (err, res) {
                            done();
                        })
                });
        });

        after('delete all the company users in the database', function (done) {
            Company.remove({}, function (err) {
                expect(err).to.be.null;
                done()
            });
        });
    });

});

