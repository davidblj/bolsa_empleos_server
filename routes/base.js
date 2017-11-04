let express = require('express');
let status = require('http-status');

module.exports = function(){
    let api = express.Router();
    api.get('/', function (User) {
        
        return function (req, res) {

            return res.status(200).json({'hola':'heroku'});
        };
    });
}