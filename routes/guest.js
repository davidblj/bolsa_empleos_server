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

    // indexed fields: jobName, ownerCompany
    api.get('/fetchJobs', wagner.invoke(function (Job) {

        return function (req, res) {

            // todo: validations
            // todo: trim results by date

            let query = {};
            let searchQuery = req.query.find;
            let salaryQuery;

            if (req.query.salary) {

                salaryQuery = +req.query.salary;
            }

            // options population
            for(let key in req.query) {

                if(req.query.hasOwnProperty(key)
                    && key !== 'find' && key !== 'salary') {

                    query[key] = req.query[key];
                }
            }

            let pipe = [];

            // mongodb aggregate pipeline setup (order is vital)
            if(searchQuery) {

                pipe.push({
                    $match: {
                        $text: {$search: searchQuery}
                    }
                });
            }

            if(salaryQuery) {

                pipe.push({
                    $match: {
                        salary: {$gte: salaryQuery}
                    }
                });
            }

            pipe.push({
                $match: {
                    $or: [query]
                }
            });

            Job.aggregate(
                pipe,
                function (err, jobs) {

                    if (err) {
                        console.log(err.toString());
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                    }

                    console.log(jobs);
                    res.json(jobs);
                });
        }
    }));

    return api;
};
