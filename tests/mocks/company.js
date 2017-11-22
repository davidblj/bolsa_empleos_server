let rootURL = '/company/';

let loginURL = rootURL + 'login';
let registrationURL = rootURL + 'registrar';
let listCompanies = rootURL + 'listarEmpresas';
let getProfile = rootURL + 'retornarPerfil';

exports.loginURL = loginURL;
exports.registrationURL = registrationURL;
exports.getProfile = getProfile;
exports.listCompanies = listCompanies;

exports.loginCredentials = {
    username: 'pragma',
    password: 'pragmaPassword'
};

exports.companyUser = {
    companyName: 'pragma',
    companyDetails: 'We focus our efforts in developing cutting edge software solutions',
    website: 'www.pragma.com',
    name: 'David',
    lastName: 'Jaramillo',
    contact: '3003102703',
    workingRole: 'Manager',
    nit: 'N2405',
    city: 'Medellin, Antioquia, Colombia',
    employmentSector: 'Software development',
    password: 'pragmaPassword',
};