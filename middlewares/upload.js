const multer = require("multer");
const fs = require('fs');

// // Visitor Route
// const faceStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dir = './public/uploads/faces/';
//         fs.mkdirSync(dir, { recursive: true })
//         cb(null, dir);
//     },

//     filename: (request, file, cb) => {
//         cb(null, Date.now() + file.originalname);
//     },
// });

// const uploadFace = multer({
//     storage: faceStorage,
//     limits: {
//         fieldSize: 1024 * 1024 * 5,
//     },
// });

// Establishment route
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

// const verificationStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let dir = './public/uploads/verify/';
//         fs.mkdirSync(dir, { recursive: true })
//         cb(null, dir);
//     },

//     filename: (request, file, cb) => {
//         cb(null, Date.now() + file.originalname);
//     },
// });

// const uploadVerify = multer({
//     storage: verificationStorage,
//     limits: {
//         fieldSize: 1024 * 1024 * 5,
//     },
// });

module.exports = upload;