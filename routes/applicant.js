let express = require('express');
let status = require('http-status');
let auth =  require('../middleware/auth');

module.exports = function (wagner) {

    let api = express();

    api.post('/applicantRegistration', wagner.invoke(function (Applicant) {

        return function (req, res) {

            let userRequest = req.body;

            req.assert('applicantName').notEmpty();
            req.assert('username').notEmpty();
            req.assert('id').notEmpty();
            req.assert('age').notEmpty();
            req.assert('email').notEmpty();
            req.assert('cellphone').notEmpty();
            req.assert('jobTitle').notEmpty();
            req.assert('location').notEmpty();
            req.assert('password').notEmpty();
            req.assert('skills').notEmpty();

            let errors = req.validationErrors();

            if(errors) {
                console.error('errors: ', errors);
                return res
                    .status(status.BAD_REQUEST)
                    .send(errors);
            }

            Applicant.findOne({$or: [{username: userRequest.username}, {email: userRequest.email}] }, function (err, user) {

                if(err){
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json({error: error.toString()});
                }

                if(user){

                    // todo: create a new service to verify the user or email existence
                    return res
                        .status(status.CONFLICT)
                        .json({error: 'The username or email already exists'});
                }

                // json string to array of strings
                userRequest.skills = JSON.parse(userRequest.skills);

                Applicant.create(userRequest, function (error) {

                    if(error){
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: error.toString()});
                    }

                    let content = { message: 'Successful registration' };
                    res
                        .status(status.CREATED)
                        .json(content);
                });
            });

        }
    }));

    return api;
};