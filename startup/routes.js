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
const getAsistenciasApsiders = require("../routes/apsiders/getAsistenciasApsiders");
const getAsistenciaApsider = require("../routes/apsiders/getAsistenciaApsider");
const bugReport = require("../routes/bugReport");

//groups
const getGroups = require("../routes/groups/getGroups");
const apsidersWithoutGroup = require('../routes/groups/getApsidersWithoutGroup');
const createGroup = require("../routes/groups/createGroup");
const patchGroup = require("../routes/groups/patchGroup");
const deleteGroup = require("../routes/groups/deleteGroup");
const addApsidersToGroup = require("../routes/groups/addApsidersToGroup");
const removeApsidersToGroup = require("../routes/groups/removeApsidersFromGroup");

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
    app.use(API_PREFIX, bugReport);

    app.use(API_PREFIX, getGroups);
    app.use(API_PREFIX, apsidersWithoutGroup);
    app.use(API_PREFIX, auth, createGroup);
    app.use(API_PREFIX, auth, patchGroup);
    app.use(API_PREFIX, auth, deleteGroup);
    app.use(API_PREFIX, auth, addApsidersToGroup);
    app.use(API_PREFIX, auth, removeApsidersToGroup);
    
    app.use(API_PREFIX, auth, getApsidersDiscord);
    app.use(API_PREFIX, auth, mostAssistedApsiders);
    app.use(API_PREFIX, auth, leastAssistedApsiders);
    app.use(API_PREFIX, auth, arriveOnTime);
    app.use(API_PREFIX, auth, notArriveOnTime);
    app.use(API_PREFIX, auth, howManyAssists);
    app.use(API_PREFIX, auth, getAsistenciasApsiders);
    app.use(API_PREFIX, auth, getAsistenciaApsider);
    
    console.info("rutas montadas");
};
