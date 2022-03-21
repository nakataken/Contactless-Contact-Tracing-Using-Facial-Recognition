const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = './public/uploads/' + file.fieldname;
        fs.mkdirSync(dir, { recursive: true })
        cb(null, dir);
    },

    filename: (request, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 10,
    },
});

module.exports = upload;