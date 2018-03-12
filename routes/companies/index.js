// libraries
const express = require('express');
const status = require('http-status');
const handler = require(process.cwd() + '/utils/controller-handler');
const upload = require(process.cwd() + '/config/multer-config');

// routing
const router = express.Router();

// middleware
const idParsing = require(process.cwd() + '/middleware/id-parsing');

// controllers
const createCompany = require(process.cwd() + '/controllers/companies/createCompany');
const getCompany = require(process.cwd() + '/controllers/companies/getCompany');

router.post('/', upload.single('logo'), handler(createCompany, status.CREATED,
    (req, res, next) => [req.body, req.file])
);

router.use('/:companyId', idParsing('companyId',
    (req, res, next) => req.params.companyId)
);

router.get('/:companyId', handler(getCompany, status.OK,
    (req, res, next) => [req.companyId])
);

module.exports = router;
