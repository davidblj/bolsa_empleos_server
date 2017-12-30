let express = require('express');
let status = require('http-status');
let mongoose = require('mongoose');

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
            // todo: organize by highest pay, most relevant. Possibly most viewed
            // todo: reduce query length

            // filtering
            let searchQuery = req.query.find;
            let salaryQuery = req.query.salary;

            // pagination
            let pageSize = 3;
            let pipe = [];

            let currentId = req.query.currentId;
            let pageJump = req.query.pageJump;
            let dayOffset = req.query.dayPosted;
            let highestPay = req.query.highestPay;
            let relevance = req.query.relevance;

            if (salaryQuery) {

                salaryQuery = +req.query.salary;
            }

            // options population
            let optionsByField = [];
            for(let key in req.query) {

                // todo: refactor
                if(req.query.hasOwnProperty(key)
                    && key !== 'find' && key !== 'salary' && key !== 'dayPosted'
                        && key !== 'currentId' && key !== 'pageJump') {

                    let tempOptions =  req.query[key].split(',');
                    for(let i = 0; i < tempOptions.length; i++) {

                        let value = {};
                        value[key] = tempOptions[i];
                        tempOptions[i] = value;
                    }

                    optionsByField.push(tempOptions);
                }
            }

            let query = [];
            function buildQueryByFields(index, tempQuery) {

                let field = optionsByField[index];

                for(let i = 0; i < field.length; i ++) {

                    let optionInField = field[i];

                    // this is a one time execution loop
                    for(let key in optionInField) {
                        if(optionInField.hasOwnProperty(key)) {

                            tempQuery[key] = optionInField[key];

                            if(index === (optionsByField.length - 1)) {

                                let copy = Object.assign({}, tempQuery);
                                query.push(copy);
                                delete tempQuery[key];

                            } else {
                                buildQueryByFields(index + 1, tempQuery);
                            }
                        }
                    }
                }
            }

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

            if(optionsByField.length) {

                buildQueryByFields(0, {});
                pipe.push({
                    $match: {
                        $or: query
                    }
                });
            }

            // last day, last week, last 2 weeks, last month, any time
            if(dayOffset) {

                let dateInUTC = new Date();
                let millisecondsOffset = dayOffset * 24 * 60 * 60 * 1000;

                let dayLimitInMillis = (dateInUTC.getTime() - millisecondsOffset) + dateInUTC.getTimezoneOffset();
                let date = new Date(dayLimitInMillis);

                pipe.push(
                    {
                        $match: {
                            timePosted: {$gt: date}
                        }
                    }
                );

                if(pageJump > 0 || !currentId) {

                    pipe.push({
                        $sort: { _id: -1}
                    });
                }

                // todo: refactor
                if(currentId && pageJump) {

                    if(pageJump > 0) {

                        pipe.push(
                            {
                                $sort: {_id: -1}
                            },
                            {
                                $match: {
                                    _id: {$gt: currentId}
                                }
                            },
                            {
                                $skip: pageJump * pageSize
                            });

                    } else {

                        pipe.push(
                            {
                                $match: {
                                    _id: {$gt: currentId}
                                }
                            },
                            {
                                $skip: (-pageJump - 1) * pageSize
                            },
                            {
                                $limit: pageSize
                            },
                            {
                                $sort: {_id: -1}
                            })
                    }
                }
            }

            /*if(highestPay) {
                // todo: highest payed pagination
            }

            if(relevance) {
                // todo: most applied pagination
            }*/

            if(!relevance && !highestPay && !dayOffset) {

                // do not sort the insertion order when the page jump is negative
                if(pageJump > 0 || !currentId) {

                    pipe.push({
                        $sort: { _id: -1}
                    });
                }

                if (currentId && pageJump) {

                    currentId = new mongoose.Types.ObjectId(currentId.toString());
                    if (pageJump > 0) {

                        pipe.push(
                            {
                                $match: {
                                    _id: {$lte: currentId}
                                }
                            },
                            {
                                $skip: pageJump * pageSize
                            });

                    } else {

                        pipe.push(
                            {
                                $match: {
                                    _id: {$gt: currentId}
                                }
                            },
                            {
                                $skip: (-pageJump - 1) * pageSize
                            },
                            {
                                $limit: pageSize
                            },
                            {
                                $sort: {_id: -1}
                            });
                    }
                }
            }

            // the page limit is automatically applied if a forward pagination has been made
            if (pageJump > 0 || !currentId) {

                pipe.push({
                    $limit: pageSize
                });
            }

            // todo: project values: _id, jobName, salary and ownerCompany

            Job.aggregate(
                pipe,
                function (err, jobs) {

                    if (err) {
                        console.log(err.toString());
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                    }

                    res.json(jobs);
                });
            // console.log(jobs);
        }
    }));

    return api;
};
