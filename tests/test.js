// const assert = require('assert');
// const superagent = require('superagent');
// const wagner = require('wagner-core');
// const express = require('express');
// const URL_ROOT = 'http://localhost:3000';


var   supertest = require('supertest'),
        wagner = require('wagner-core'),
        chai = require('chai'),
        should = require('should'),
        assert = require('assert'),
        app = require('../app/app')

const request = supertest(app);
const expect = chai.expect;

describe('Organization API', function() {
    
    it('it should return status 400 when no data is sended', function(done) {
        organization =  {};
        var url = '/organizacion/registrar';
        request.post(url).set('Content-Type', 'application/json')
            .send(organization)
            .expect(400, done);
            // .end(
            //     (error, res)=> {
            //         console.log(res.statusCode);
            //         assert.equal(res.statusCode, 400);

            //         done();
            //     }
            // );
                
                
                
    });
})



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
//     // describe('Array', function() {
//     //     describe('#indexOf()', function() {
            
//     //     });
//     // });
//     // it('should return -1 when the value is not present', function() {
//     //     assert.equal(-1, [1,2,3].indexOf(4));
//     // });


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
        
        
        
//     });
// });