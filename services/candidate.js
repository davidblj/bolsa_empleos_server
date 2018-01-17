let userModel = require('../models/candidate/user');

//errors are handled by mongoose

let createCandidate = (data) => {
    return userModel.create(data);
};

let getCandidate = (query) => {
    return userModel.findOne(query).exec();
};

module.exports = {
  createCandidate: createCandidate,
  getCandidate: getCandidate
};