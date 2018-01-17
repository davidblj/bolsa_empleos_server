const express = require('express');
const router = express.Router();
const status = require('http-status');

const createCandidate = require('../../controllers/candidates/createCandidate');

router.post('/', async (req, res, next) => {

    try {
        await createCandidate(req.body);
        res.status(status.CREATED).json({message: 'success'});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
