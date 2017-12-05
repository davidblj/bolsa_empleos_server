let chai = require('chai'),
    listCompaniesTests = require('./company/list-companies'),
    getProfileTests = require('./company/get-profile'),
    registerCompanyTest = require('./company/register'),
    loginTest = require('./company/login');

chai.use(require('chai-http'));
chai.use(require('chai-jwt'));

describe('Organization API', function() {

    describe('#GET /listarEmpresas', function () {

        before('initialize models', listCompaniesTests.beforeAllTests);

        it('should return status 200', listCompaniesTests.status200);
        it('should return a Content-Type application/json response', listCompaniesTests.jsonResponse);
        it('should return a response message as an empty Array', listCompaniesTests.emptyArray);
        it('should return the correct company details', listCompaniesTests.companyDetails);

        afterEach('delete all users in the database', listCompaniesTests.afterEachTest);
    });

    // todo: add tests for a minimun length in the user credentials and for fields with non alphanumeric characters
    describe('#POST /registrar', function () {

        before('initialize models', registerCompanyTest.beforeAllTests);

        it('it should return status 400 when no data is provided', registerCompanyTest.status400);
        it('it should return status 409 when a user already exist', registerCompanyTest.status409);
        it('it should return status 201', registerCompanyTest.status201);
        it('should return a Content-Type application/json response', registerCompanyTest.jsonResponse);
        it('should return a string response', registerCompanyTest.stringResponse);
        it('should return a successful registration response ', registerCompanyTest.successfulRegistration);

        afterEach('delete all users in the database', registerCompanyTest.afterEachTest);
    });


    // todo: add test for a minimun length in the login credentials
    // todo: add test for an applicant user
    describe('#POST /login', function () {

        before('initialize models', loginTest.beforeAllTests);

        it('it should return status 400 when no data is provided', loginTest.status400);
        it('it should return status 401 when the username don\'t exist', loginTest.status401);
        it('it should return status 401 when the user\'s password don\'t match', loginTest.status401Mismatch);
        it('it should return a Content-Type application/json response', loginTest.jsonResponse);
        it('it should return a json with the corresponding username, role and token', loginTest.responseDetails);
        it('should return a json with a valid token signature', loginTest.tokenDetails);

        after('delete all the company users in the database', loginTest.afterAllTests);
    });

    /*describe('#POST /nuevaOferta', function () {

    });*/

    describe('#POST /retornarPerfil', function () {

        before('initialize models', getProfileTests.beforeAllTests);
        before('insert a new employer in to the database', getProfileTests.insertACompanyUser);
        before('insert a new applicant user into the database', getProfileTests.insertAnApplicantUser);

        it('should return status 403 when the role is not authorized', getProfileTests.status403);
        it('should return status 200', getProfileTests.status200);
        it('should return a Content-Type application/json response', getProfileTests.jsonResponse);
        it('should return the right details', getProfileTests.details);

        after('delete all users in the database', getProfileTests.afterAllTest);
    });

});

