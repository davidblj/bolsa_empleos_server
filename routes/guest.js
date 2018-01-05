let express = require('express');
let status = require('http-status');
let mongoose = require('mongoose');

// todo: use a middleware to handle errors
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

    // indexed fields: jobName (text), ownerCompany (text)
    // compound indexed fields: (salary: -1, _id: -1)
    api.get('/fetchJobs', wagner.invoke(function (Job) {

        return function (req, res) {

            // todo: validations
            // todo: organize by most popular
            // todo: reduce query length

            // filtering
            let searchQuery = req.query.find;
            let salaryQuery = +req.query.salary;
            let publishedDate = req.query.publishedDate;

            // pagination
            let pageSize = 3;
            let pipe = [];

            let currentId = req.query.currentId;
            let pageJump = req.query.pageJump;

            let sortedBySalary = req.query.sortedBySalary;
            let currentSalaryPrice = +req.query.currentSalaryPrice;

            let relevance = req.query.relevance;

            if (currentId) {

                currentId = new mongoose.Types.ObjectId(currentId.toString());
            }

            // options population
            let optionsByField = [];
            for (let key in req.query) {

                // todo: refactor
                if (req.query.hasOwnProperty(key)
                    && key !== 'find' && key !== 'salary' && key !== 'publishedDate'
                    && key !== 'currentId' && key !== 'pageJump' && key !== 'sortedBySalary'
                    && key !== 'currentSalaryPrice') {

                    let tempOptions = req.query[key].split(',');
                    for (let i = 0; i < tempOptions.length; i++) {

                        let value = {};
                        value[key] = tempOptions[i];
                        tempOptions[i] = value;
                    }

                    optionsByField.push(tempOptions);
                }
            }

            // todo: refactor
            let query = [];

            function buildQueryByFields(index, tempQuery) {

                let field = optionsByField[index];

                for (let i = 0; i < field.length; i++) {

                    let optionInField = field[i];

                    // this is a one time execution loop
                    for (let key in optionInField) {
                        if (optionInField.hasOwnProperty(key)) {

                            tempQuery[key] = optionInField[key];

                            if (index === (optionsByField.length - 1)) {

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

            // mongodb aggregate pipeline setup
            if (searchQuery) {

                pipe.push({
                    $match: {
                        $text: {$search: searchQuery}
                    }
                });
            }

            if (salaryQuery) {

                pipe.push({
                    $match: {
                        salary: {$gte: salaryQuery}
                    }
                });
            }

            if (publishedDate) {

                let dateInUTC = new Date();
                let timeOffset = publishedDate * 24 * 60 * 60 * 1000;

                let dayLimitInMilliseconds = (dateInUTC.getTime() - timeOffset);
                let date = new Date(dayLimitInMilliseconds);

                pipe.push(
                    {
                        $match: {
                            timePosted: {$gt: date}
                        }
                    }
                );
            }

            if (optionsByField.length) {

                buildQueryByFields(0, {});
                pipe.push({
                    $match: {
                        $or: query
                    }
                });
            }

            if(sortedBySalary) {

                if (pageJump > 0 || !currentId) {

                    pipe.push({
                            $sort: {salary: -1, _id: -1}
                        });
                }

                if (currentId && currentSalaryPrice && pageJump) {

                    if (pageJump > 0) {

                        pipe.push(
                            {
                                $match: {
                                    $or: [
                                        {salary: {$lt: currentSalaryPrice}},
                                        {$and: [ {_id: {$lte: currentId}}, {salary: currentSalaryPrice} ]}
                                    ]
                                }
                            },
                            {
                                $skip: pageJump * pageSize
                            });

                    } else {

                        pipe.push(
                            {
                                $sort: {salary: 1, _id: 1}
                            },
                            {
                                $match: {
                                    $or: [
                                        {salary: {$gt: currentSalaryPrice}},
                                        {$and: [ {_id: {$gt: currentId}}, {salary: currentSalaryPrice} ]}
                                    ]
                                }
                            },
                            {
                                $skip: (-pageJump - 1) * pageSize
                            },
                            {
                                $limit: pageSize
                            },
                            {
                                $sort: {salary: -1, _id: -1}
                            });
                    }
                }
            }

            /*if(relevance) {
                // todo: most applied pagination
            }*/

            if (!relevance && !sortedBySalary) {

                // do not sort the insertion order when the page jump is negative
                if (pageJump > 0 || !currentId) {

                    pipe.push({
                        $sort: {_id: -1}
                    });
                }

                if (currentId && pageJump) {

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

            pipe.push({
                $project: {
                    jobName: 1,
                    ownerCompany: 1,
                    salary: 1
                }
            });

            // console.log(JSON.stringify(pipe));
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
        }
    }));

    return api;
};
