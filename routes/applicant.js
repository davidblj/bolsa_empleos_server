let express = require('express');
let status = require('http-status');
let auth =  require('../middleware/auth');

module.exports = function (wagner) {

    let api = express();

    // marked for delete
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

    // marked for delete
    api.get('/getAppliedJobs', auth.verifyToken, wagner.invoke(function (Applicant) {

        return function (req, res) {

            let applicantId = req.decoded._id;

            Applicant.findOne({_id: applicantId}, 'jobs',function (err, Applicant) {

                if (err) {
                    let content = {message: err.toString()};
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json(content);
                }

                return res.json(Applicant);
            });
        };
    }));

    // todo: put is more adequate
    api.post('/apply', auth.verifyToken, wagner.invoke(function (Job, Applicant) {

        return function (req, res) {

            let applicantId = req.decoded._id;
            let jobId = req.body.content.jobId;

            // todo: check if the user is not already subscribed
            Job.findOneAndUpdate(
                {_id: jobId},
                {$push: {candidates: applicantId}},
                {returnNewDocument: true },
                function (err, job) {

                    if (err) {
                        let content = {message: err.toString()};
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json(content);
                    }

                    // todo: debug this variable, null response
                    // console.log(job);

                    Applicant.findOneAndUpdate(
                        {_id:applicantId},
                        {$push: {jobs: jobId}},
                        {returnNewDocument: true},
                        function (err, applicant) {

                            if (err) {
                                let content = {message: err.toString()};
                                return res
                                    .status(status.INTERNAL_SERVER_ERROR)
                                    .json(content);
                            }

                            console.log(applicant);
                            return res.json({})
                        }
                    )
                })
        }
    }));

    return api;
};