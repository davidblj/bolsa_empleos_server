let express = require('express');
let status = require('http-status');
let auth =  require('../middleware/auth');

module.exports = function(wagner) {

    let api = express.Router();

    // liste todas las empresas registradas: http://localhost:3000/organizacion/listar
    // Request headers:  name: Content-Type  value: application/json
    api.get('/listarEmpresas', wagner.invoke(function (User) {

        return function (req, res) {

            User.find({}, '_id companyName').exec(function (error, User) {
                if (error) {
                    return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
                }
                // todo: set a response for no results

                res.json(User);
            })
        };
    }));

    // Registre al nuevo usuario: http://localhost:3000/organizacion/registrar
    // Request headers:  name: Content-Type  value: application/json
    api.post('/registrar', wagner.invoke( function (User) {

        return function (req, res) {

            let reqUser = req.body;
            req.assert('companyName', 'You must enter the company Username').notEmpty();
            req.assert('password', 'Password must be at least 4 characters long').len(4);

            let errors = req.validationErrors();

            if(errors) {
                console.error('errors: ', errors);
                return res.status(status.BAD_REQUEST).send(errors);
            }

            process.nextTick(function () {

                User.findOne({companyName: reqUser.companyName}, function (err, user) {

                    if(err){
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: error.toString()});
                    }

                    if(user){

                        return res
                            .status(status.CONFLICT)
                            .json({error: 'The username already exist'});
                    }

                    User.create(reqUser, function (error) {

                        if(error){
                            return res
                                .status(status.INTERNAL_SERVER_ERROR)
                                .json({error: error.toString()});
                        }

                        let content = { message: 'Successful registration' };
                        res.json(content);
                    });
                });
            });
        }
    }));

    // autentique al usuario: http://localhost:3000/organizacion/login
    // Request headers:  name: Content-Type  value: application/json
    api.post('/login', wagner.invoke(function (User) {

        return function (req,res) {
            req.assert('companyName', 'You must enter the company Username').notEmpty();
            req.assert('password', 'Password must be at least 4 characters long').len(4);

            let errors = req.validationErrors();

            if(errors) {
                console.error('errors: ', errors);
                return res.status(status.BAD_REQUEST).send(errors);
            }

            let reqAccess = req.body;

            process.nextTick(function () {

                User.findOne({companyName: reqAccess.companyName}, function (err, user) {

                    if(err){
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: error.toString()});
                    }

                    if(!user){
                        let content = { message: 'Incorrect username or password' };
                        return res
                            .status(status.UNAUTHORIZED)
                            .json(content);
                    }

                    if(user){

                        if(!user.validPassword(reqAccess.password)){
                            let content = { message: 'Incorrect username or password' };
                            return res
                                .status(status.UNAUTHORIZED)
                                .json(content);
                        }

                        let token = user.generateJwt();
                        let content = {
                            user: user.companyName,
                            role: user.role,
                            token: token
                        };

                        res.json(content);
                    }
                });
            });
        }
    }));

    // Registre la oferta: http://localhost:3000/organizacion/nuevo
    // Request headers:  name: Content-Type  value: application/json
    api.post('/nuevaOferta', auth.verifyToken, wagner.invoke(function (Job) {

        return function (req, res) {

            // todo: field validation (by asserts or using the built-in mongoose validators)

            let reqJob = req.body.content;
            let role = req.decoded.role;
            let companyName = req.decoded.name;

            // todo: delete process.next tick
            process.nextTick(function () {

                if(role !== 'company') {
                    let content = { message: 'You don\'t have permission for this type of request'};
                    return res
                        .status(status.FORBIDDEN)
                        .json(content);
                }

                Job.findOne({ownerCompany: companyName, jobName: reqJob.jobName}, function (err, job) {

                    if(err){
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                    }

                    if(job){
                        return res
                            .status(status.CONFLICT)
                            .json({error: 'This offer has already been registered'});
                    }

                    reqJob.ownerCompany = companyName;

                    Job(reqJob).save(function (error) {
                        if(error){
                            return res
                                .status(status.INTERNAL_SERVER_ERROR)
                                .json({error: error.toString()});
                        }

                        let content = { message: 'Job has been successfully registered' };
                        res.json(content);
                    });
                })
            })
        }
    }));

    // liste las ofertas por empresa:  http://localhost:3000/organizacion/listarOfertas
    // Request headers:  name: x-access-token  value: xxx.xxx.xxx
    api.get('/listarOfertas', auth.verifyToken, wagner.invoke(function (Job) {

        return function (req, res) {

            let role = req.decoded.role;
            let companyName = req.decoded.name;

            if (role !== 'company') {
                let content = { message: 'You don\'t have permission for this type of request'};
                return res
                    .status(status.FORBIDDEN)
                    .json(content);
            }

            // todo: return the quantity

            Job.find({ownerCompany: companyName}, '_id jobName expiryDate', function (err, job) {

                if (err) {
                    let content = { message: err.toString() };
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json(content);
                }

                // todo: set a response for no results
                res.json(job);
            });
        }
    }));

    return api;
};