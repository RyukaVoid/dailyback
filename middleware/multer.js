const multer = require("multer");
const { randomBytes } = require("crypto");
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

console.info("inicio multer.js");

const DEFAULT_FILE_LOCATION = process.env.DEFAULT_DESTINATION || "images";

console.debug('DEFAULT_FILE_LOCATION: ', DEFAULT_FILE_LOCATION);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DEFAULT_FILE_LOCATION);
  },
  filename: (req, file, cb) => {
    cb(null, randomBytes(4).toString("hex") + "-" + file.originalname);
  },
});

console.debug('fileStorage: ', JSON.stringify(fileStorage));

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

console.debug('fileFilter: ', JSON.stringify(fileFilter));

module.exports = multer({ storage: fileStorage, fileFilter }).single("image");