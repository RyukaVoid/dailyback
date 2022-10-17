const express = require("express");

const apsiders = require("../routes/get_apsiders");
const update_assist = require("../routes/update_assist");
const archive_apsiders = require("../routes/archive_apsider");
const mandated_apsider = require("../routes/mandated_apsider");

module.exports = function(app) {
    app.use('/api',apsiders);
    app.use('/api',update_assist);
    app.use('/api',archive_apsiders);
    app.use('/api',mandated_apsider);
};
