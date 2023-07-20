var app = require("../app");
const express = require("express");
const router = express.Router();
require('dotenv').config('../.env');

router.post("/bug-report", async (req, res, next) => {
    console.info("Inicio bug-report");

    const reportNombres = req.body.name;
    const reportInfo = req.body.info;
    
    const discordClient = app.discordClient;
    console.log("discordClient",discordClient);

    const ADMIN_ID = process.env.ADMIN_ROLE_ID;
    console.debug('ADMIN_ID: ' + ADMIN_ID);

    discordClient.users.fetch(ADMIN_ID).then((user) => {
        console.log("user",user);
        user.send(
            `**${reportNombres}** ha reportado un bug: ${reportInfo}`
        );
    }).catch((err) => {
        console.error("Error al obtener usuario de discord", err);
        return res.status(500).json({
            status: 'error',
            message: 'Error al enviar reporte de bug'
        });
    });

    console.info("fin bug-report");
    return res.status(200).json({
        status: 'success',
        message: 'Reporte enviado correctamente',
    });
});

module.exports = router;
