const express = require('express');
const router = express.Router();

let candidates = require('./candidates');

router.use('/candidates', candidates);
/*router.use('/company', require('../routes/company')(wagner));
router.use('/guest', require('../routes/guest')(wagner));*/

router.use((err, req, res, next) => {
   res.status(err.status || 500).json({ error: err.message || err.toString()});
    // todo: handle errors that are not an instance of Error
});

module.exports = router;