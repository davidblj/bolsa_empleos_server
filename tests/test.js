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

        it('should return a correct message as an Array', function (done) {
            request
                .get(url)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.statusCode).to.equal(200);
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
        it('it should return status 400 when no data is provided', function(done) {
            organization =  {};
            let url = '/organizacion/registrar';
            request.post(url).set('Content-Type', 'application/json')
                .send(organization)
                .expect(400, done);

        });
    });


});



// describe('Organization API', function() {

//     var server;
//     var OrganizationUser;

//     before(function() {
        
//         var app = express();
//         require('../config/config')(app);
//         require('../endpoints/routes')(app);

//         models = require('../models/models')(wagner);
//         OrganizationUser = models.User; 

//         server = app.listen(3000);
//     });


//     // after(function() {
//     //     server.close();
//     // });

//     beforeEach(function(done) {
//         OrganizationUser.remove({}, function(error) {
//             assert.ifError(error);
//             done();
//         });
//     });

//     it('it should return status 400 when no data is sended', function(done) {
//         organization =  {};
//         var url = 'http://localhost:3000/organizacion/registrar';
//         superagent.post(url).set('Content-Type', 'application/json')
//             .send(organization)
//             .end(
//                 (error, res)=> {
//                     console.log(res.statusCode);
//                     assert.equal(res.statusCode, 400);

//                     done();
//                 }
//             );

//    });
// });
