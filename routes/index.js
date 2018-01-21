// libraries
const express = require('express');
const router = express.Router();
const log = require('../utils/debug');

// routes
let candidates = require('./candidates');

// todo(1): handle errors that are not an instance of Error (500)

router.use('/candidates', candidates);
/*router.use('/company', require('../routes/company')(wagner));
router.use('/guest', require('../routes/guest')(wagner));*/

router.use((err, req, res, next) => {
   if (err.stack) log.error(err.stack);
   res.status(err.status || 400).json({ error: err.message || err.toString()});
});

module.exports = router;