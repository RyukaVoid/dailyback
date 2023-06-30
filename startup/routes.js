require('dotenv').config();

const auth = require('../middleware/auth');

const AdmLogin = require("../routes/adm/login");

const archiveApsiders = require("../routes/apsiders/archiveApsider");
const createApsider = require("../routes/apsiders/createApsider");
const update_apsider = require("../routes/apsiders/updateApsider");
const deleteApider = require("../routes/apsiders/deleteApsider");
const disableApsider = require("../routes/apsiders/disableApsider");
const getApsider = require("../routes/apsiders/getApsider");
const getApsiders = require("../routes/apsiders/getApsiders");
const getApsidersDiscord = require("../routes/apsiders/getApsidersDiscord");
const mandatedApsider = require("../routes/apsiders/mandatedApsider");
const resetAssisted = require("../routes/resetAssisted");
const updateAssist = require("../routes/updateAssist");
const markAttendance = require("../routes/markAttendance");

// charts
const mostAssistedApsiders = require("../routes/charts/mostAssistedApsiders");
const leastAssistedApsiders = require("../routes/charts/leastAssistedApsiders");
const arriveOnTime = require("../routes/charts/arriveOnTime");
const notArriveOnTime = require("../routes/charts/notArriveOnTime");
const howManyAssists = require("../routes/charts/howManyAssists");

module.exports = function(app) {
    console.info("montando rutas");
    const API_PREFIX = process.env.API_PREFIX || "/api";

    app.use(API_PREFIX, AdmLogin);
    app.use(API_PREFIX, archiveApsiders);
    app.use(API_PREFIX, createApsider);
    app.use(API_PREFIX, update_apsider);
    app.use(API_PREFIX, deleteApider);
    app.use(API_PREFIX, disableApsider);
    app.use(API_PREFIX, getApsider);
    app.use(API_PREFIX, getApsiders)
    app.use(API_PREFIX, mandatedApsider);
    app.use(API_PREFIX, resetAssisted);
    app.use(API_PREFIX, updateAssist);
    app.use(API_PREFIX, markAttendance);
    
    app.use(API_PREFIX, auth, getApsidersDiscord);
    app.use(API_PREFIX, auth, mostAssistedApsiders);
    app.use(API_PREFIX, auth, leastAssistedApsiders);
    app.use(API_PREFIX, auth, arriveOnTime);
    app.use(API_PREFIX, auth, notArriveOnTime);
    app.use(API_PREFIX, auth, howManyAssists);
    
    console.info("rutas montadas");
};
