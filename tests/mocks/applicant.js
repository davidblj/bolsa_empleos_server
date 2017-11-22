let rootURL = '/applicant/';

let loginURL = '/company/' + 'login';
let registrationURL = rootURL +  'applicantRegistration';

exports.loginURL = loginURL;
exports.registrationURL = registrationURL;

exports.loginCredentials = {
    username: 'david',
    password: 'david',
};

exports.applicantUser = {
    "age": "22",
    "applicantName": "David Jaramillo Bolivar",
    "username": "david",
    "cellphone": "3003102703",
    "email": "david@gmail.com",
    "id": "1152209135",
    "jobTitle": "developer",
    "location": "medellin",
    "password": "david",
    "skills": "[\"item1\", \"item2\"]"
};