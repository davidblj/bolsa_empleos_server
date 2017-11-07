let express = require('express');
let status = require('http-status');
let auth =  require('../middleware/auth');

module.exports = function(wagner) {

    let api = express.Router();

    api.get('/', wagner.invoke(function () {

        return function (req, res) {

           return res.status(200).json({'Hola ': 'Heroku'});
        };
    }));

    // liste todas las empresas registradas: http://localhost:3000/organizacion/listar
    // Request headers:  name: Content-Type  value: application/json
    api.get('/listarEmpresas', wagner.invoke(function (CompanyUser) {

        return function (req, res) {

            CompanyUser.find({}, '_id companyName').exec(function (error, user) {
                if (error) {
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json({error: error.toString()});
                }
                // todo: set a response for no results

                res.json(user);
            })
        };
    }));


    // Registre al nuevo usuario: http://localhost:3000/organizacion/registrar
    // Request headers:  name: Content-Type  value: application/json
    api.post('/registrar', wagner.invoke( function (CompanyUser) {

        return function (req, res) {

            let reqUser = req.body;
            req.assert('companyName', 'value is not in range')
                .isLength({min: 3, max: 15})
                .isAlphanumeric('es-ES');
            req.assert('password', 'value is not in range')
                .isLength({min: 3, max: 15})
                .isAlphanumeric('es-ES');
            req.assert('companyDetails', 'This field is required')
                .notEmpty();
            req.assert('website', 'This field is required')
                .notEmpty();
            req.assert('name', 'This field is required')
                .notEmpty();
            req.assert('lastName', 'This field is required')
                .notEmpty();
            req.assert('contact', 'This field is required')
                .notEmpty();
            req.assert('nit', 'This field is required')
                .notEmpty();
            req.assert('city', 'This field is required')
                .notEmpty();
            req.assert('employmentSector', 'This field is required')
                .notEmpty();

            let errors = req.validationErrors();

            if(errors) {
                // console.error('errors: ', errors);
                return res.status(status.BAD_REQUEST).send(errors);
            }

            process.nextTick(function () {

                CompanyUser.findOne({companyName: reqUser.companyName}, function (err, user) {

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

                    CompanyUser.create(reqUser, function (error) {

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
            });
        }
    }));

    // autentique al usuario: http://localhost:3000/organizacion/login
    // Request headers:  name: Content-Type  value: application/json
    api.post('/login', wagner.invoke(function (CompanyUser) {

        return function (req,res) {

            req.assert('companyName', 'value is not in range')
                .isLength({min: 3, max: 15})
                .isAlphanumeric('es-ES');
            req.assert('password', 'value is not in range')
                .isLength({min: 3, max: 15})
                .isAlphanumeric('es-ES');

            let errors = req.validationErrors();

            if(errors) {
                return res.status(status.BAD_REQUEST).send(errors);
            }

            let reqAccess = req.body;

            process.nextTick(function () {

                CompanyUser.findOne({companyName: reqAccess.companyName}, function (err, user) {

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


    // todo: add this as a general route for an employee to consume.
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

    api.get('/retornarPerfil', auth.verifyToken, wagner.invoke(function (CompanyUser) {

        return function (req, res) {

            let role = req.decoded.role;
            let companyName = req.decoded.name;

            if (role !== 'company') {
                let content = { message: 'You don\'t have permission for this type of request'};
                return res
                    .status(status.FORBIDDEN)
                    .json(content);
            }

            CompanyUser.findOne({companyName: companyName}, '-salt -hash', function (err, user) {

                if (err) {
                    let content = { message: err.toString() };
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json(content);
                }

                return res.json(user);
            });
        };
    }));

    // todo: remove duplicate code from error responses
    // todo: split this file and export the functions

    return api;
};