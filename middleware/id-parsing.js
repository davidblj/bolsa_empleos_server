const mongoose = require('mongoose');
const error = require('../utils/error');
const log = require(process.cwd() + '/utils/debug');

const idParsing = (name, getId) => (req, res, next) => {

    let id = getId(req, res, next);
    log.common(`${name} param was detected: ${id} `);

    try {
        id = new mongoose.Types.ObjectId(id);
        req[name] = id;
        next();
    } catch(e) {
        next(error(status.BAD_REQUEST, `${name}: ${id} must be a valid representation of a MongoDB id`));
    }
};

module.exports = idParsing;
