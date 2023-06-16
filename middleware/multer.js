var multer = require("multer")
require('dotenv').config('./.env');

custom_destination = process.env.DEFAULT_DESTINATION || '';
var destination = "./public/" + custom_destination;

function fileFilter(req, file, cb) {
    if (file.mimetype !== "image/jpeg") {
        return cb(new Error("Solo se permiten archivos jpeg"))
    }
    cb(null, true);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destination)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    fileFilter: fileFilter,
    storage: storage
})

module.exports = upload;