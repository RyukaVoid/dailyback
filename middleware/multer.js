let multer = require("multer")
require('dotenv').config('./.env');

let custom_destination = process.env.DEFAULT_DESTINATION || '';
let destination = "./public/" + custom_destination;

function fileFilter(req, file, cb) {
    console.log("filetype:",  file.mimetype)
    if (file.mimetype !== "image/jpeg") {
        return cb(new Error("Solo se permiten archivos jpg"))
    }
    cb(null, true);
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destination)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

let upload = multer({
    fileFilter: fileFilter,
    storage: storage
})

module.exports = upload;