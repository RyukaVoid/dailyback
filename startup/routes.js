require('dotenv').config();

const archiveApsiders = require("../routes/apsiders/archiveApsider");
const createApsider = require("../routes/apsiders/createApsider");
const update_apsider = require("../routes/apsiders/updateApsider");
const deleteApider = require("../routes/apsiders/deleteApsider");
const getApsider = require("../routes/apsiders/getApsider");
const getApsiders = require("../routes/apsiders/getApsiders");
const getApsidersDiscord = require("../routes/apsiders/getApsidersDiscord");
const mandatedApsider = require("../routes/apsiders/mandatedApsider");
const resetAssisted = require("../routes/resetAssisted");
const updateAssist = require("../routes/updateAssist");
const markAttendance = require("../routes/markAttendance");

module.exports = function(app) {
    console.info("montando rutas");
    const API_PREFIX = process.env.API_PREFIX || "/api";

    app.use(API_PREFIX, archiveApsiders);
    app.use(API_PREFIX, createApsider);
    app.use(API_PREFIX, update_apsider);
    app.use(API_PREFIX, deleteApider);
    app.use(API_PREFIX, getApsider);
    app.use(API_PREFIX, getApsiders)
    app.use(API_PREFIX, getApsidersDiscord);
    app.use(API_PREFIX, mandatedApsider);
    app.use(API_PREFIX, resetAssisted);
    app.use(API_PREFIX, updateAssist);
    app.use(API_PREFIX, markAttendance);

    console.info("rutas montadas");
};
