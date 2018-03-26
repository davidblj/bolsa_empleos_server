const multer = require('multer');
const crypto = require('crypto');

// file uploads must follow an specific order (the file to be
// uploaded must be placed at the end of the form-data), or
// sometimes (or quite often) multer might hung up.
// https://github.com/expressjs/multer/issues/53

const upload = (path) => {

    const storage = multer.diskStorage({

        destination: function (req, file, cb) {

            // destination is relative to
            // the main node js process
            cb(null, path)
        },
        filename: async function (req, file, cb) {

            try {
                // raw is a node js buffer object
                const raw = await crypto.randomBytes(16);
                const key = raw.toString('hex');
                cb(null, key + '_' + file.originalname);
            } catch (e){
                return cb(e);
            }
        }
    });

    return multer({storage: storage});
};

module.exports = upload;
