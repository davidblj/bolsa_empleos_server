let express = require('express');
let status = require('http-status');

module.exports = function (wagner) {

    let api = express();

    api.get('/getCompanyDetails', wagner.invoke(function (CompanyUser, Job) {

        return function (req, res) {

            let companyName = req.query.companyName;

            if(!companyName) {

                return res
                    .status(status.BAD_REQUEST)
                    .json({error: 'No company has been specified'});
            }

            CompanyUser.findOne({companyName: companyName}, '-hash -role',function (err, company) {

                // todo: use a function;
                if(err){
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json({error: err.toString()});
                }

                if(!company) {
                    return res
                        .status(status.BAD_REQUEST)
                        .json({error: 'The company do not exist'});
                }

                // todo: embed the city location if need it
                // todo: do a pagination
                Job.find({ownerCompany: companyName}, 'jobName description expiryDate technicalRole', function (err, jobs) {

                    if(err){
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                    }

                    let companyDetails = {
                        company: company,
                        jobs: jobs
                    };

                    res.json(companyDetails);
                })
            });
        }
    }));

    api.get('/getAvailableOffers', wagner.invoke(function (Job) {

        return function (req, res) {

            Job.find({}, '_id jobName ownerCompany salary', function (err, jobs) {

                if(err) {
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json({error: err.toString()});
                }

                if(!jobs) {
                    let content = { message: 'No hay ofertas registradas' };
                    return res.json(content);
                }

                res.json(jobs);
            })
        }
    }));

    api.get('/getJobDetails', wagner.invoke(function (Job) {

        return function (req, res) {

            let jobId = req.query.jobId;

            Job.findOne({ _id: jobId }, '-candidates' , function (err, job) {

                if(err) {
                    return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json({error: err.toString()});
                }

                if(!job) {
                    let content = { message: 'La oferta seleccionada no existe' };
                    return res.json(content);
                }

                res.json(job);
            });
        };
    }));

    return api;
};
