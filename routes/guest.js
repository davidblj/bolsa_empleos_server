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

            CompanyUser.find({companyName: companyName}, '-hash -role',function (err, company) {

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
                Job.find({ownerCompany: companyName}, 'jobName technicalRole', function (err, jobs) {

                    if(err){
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                    }

                    let companyDetails = {
                        companyDetails: company,
                        jobOffers: jobs
                    };

                    res.json(companyDetails);
                })
            });
        }
    }));

    // api.get()

    return api;
};
