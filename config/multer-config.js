const multer = require('multer');
const crypto = require('crypto');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        // destination is relative to
        // the main node js process
        cb(null, './gallery/staging')
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

const upload = multer({storage: storage});
module.exports = upload;
