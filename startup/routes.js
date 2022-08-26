const express = require("express");

const apsiders = require("../routes/get_apsiders");
const update_assist = require("../routes/update_assist");
const archive_apsiders = require("../routes/archive_apsider");
const mandated_apsider = require("../routes/mandated_apsider");

module.exports = function(app) {
    app.use(apsiders);
    app.use(update_assist);
    app.use(archive_apsiders);
    app.use(mandated_apsider);
};
