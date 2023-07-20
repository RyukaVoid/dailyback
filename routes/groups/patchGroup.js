const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');
var app = require("../../app");


router.patch("/group", async (req, res, next) => {
    console.info("Inicio patch-group");

    const groupName = req.body.name;
    const channelId = req.body.channelId;

    const query = `UPDATE grupos (name) VALUES (:name) 
        WHERE channel_id = :channel_id;`;
    console.debug('query: ' + query);

    const connection = await pool.getConnection();
    let channel
    try {
        const discordClient = app.discordClient;
        const channelToEdit = await discordClient.channels.get(channelId)
        channelToEdit.setName(groupName);

        console.info("Nombre de canal actualizado exitosamente:",
            channelToEdit);
        channel = channelToEdit;

        console.log("------ channel id:", channel.id)
    } catch (err) {
        console.error("Error al crear grupo")
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al crear grupo.' 
        });
    }

    try {
        await connection.beginTransaction();

        const params = {
            "name": groupName,
            "channel_id": channel.id
        }

        const [result] = await connection.query(query, {
            sql: query,
            values: params,
            namedPlaceholders: true
        });

        console.info(`${result.affectedRows} fila(s) afectadas(s)`);
        
    } catch (err) {
        console.error(`Error al obtener grupos: ${err.message}`);
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al crear grupos.' 
        });
    }


    console.info("Fin patch-group");
    return res.status(200).json({
        status: "success"
    });
});

module.exports = router;