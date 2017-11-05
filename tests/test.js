let supertest = require('supertest'),
    wagner = require('wagner-core'),
    chai = require('chai'),
    app = require('../app/app');

let request = supertest(app);
let expect = chai.expect;

describe('Organization API', function() {

    let rootURL = '/organizacion/';

    describe('#GET /listarEmpresas', function () {

        let url = rootURL + 'listarEmpresas';
        let Company;

        before(function () {
            let models = require('../models/models')(wagner);
            Company = models.User;
        });

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

        it('should return a Content-Type application/json', function (done) {
            request
                .get(url)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    done();
                })
        });

        it('should return a correct message as a Json Object', function (done) {
            request
                .get(url)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('Array');
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
    
    describe('#Registrar', function () {
        it('it should return status 400 when no data is sended', function(done) {
            organization =  {};
            let url = '/organizacion/registrar';
            request.post(url).set('Content-Type', 'application/json')
                .send(organization)
                .expect(400, done);
        });
    });

});