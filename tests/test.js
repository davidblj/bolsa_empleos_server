let supertest = require('supertest'),
    wagner = require('wagner-core'),
    chai = require('chai'),
    app = require('../app/app');

let request = supertest(app);
let expect = chai.expect;

chai.use(require('chai-http'));

describe('Organization API', function() {

    let rootURL = '/organizacion/';

    let Company;

    before(function () {
        let models = require('../models/models')(wagner);
        Company = models.User;
    });

    describe('#GET /listarEmpresas', function () {

        let url = rootURL + 'listarEmpresas';

        beforeEach('delete company users in the database', function (done) {
            Company.remove({}, function (err) {
                expect(err).to.be.null;
                done()
            })
        });

        it('should return status 200', function(done) {
            request
                .get(url)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    done();
            })
        });

        it('should return a Content-Type application/json response', function (done) {
            request
                .get(url)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(res).to.be.json;
                    done();
                })
        });

        it('should return a response message as an Array', function (done) {
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
        });

        it('should return the correct company details', function (done) {
            let companyUser = {
                companyName: 'pragma',
                password: 'pragma',
                role: 'company'
            };

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
        });
    });
    
    describe('#POST /registrar', function () {

        let url = rootURL + 'registrar';
        let companyUser = {
            companyName: 'pragma',
            password: 'pragma',
            role: 'company'
        };

        beforeEach('delete company users in the database', function (done) {
            Company.remove({}, function (err) {
                expect(err).to.be.null;
                done()
            })
        });

        it('it should return status 400 when no data is provided', function(done) {
            let companyUser =  {};

            request.post(url)
                .set('Content-Type', 'application/json')
                .send(companyUser)
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
});

