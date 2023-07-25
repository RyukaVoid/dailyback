const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');
var app = require("../../app");


router.patch("/group", async (req, res, next) => {
    console.info("Inicio patch-group");

    const groupId = req.body.id;
    const groupNewName = req.body.name;

    if (!groupId || !groupNewName) {
        console.error("Error al editar grupo")
        return res.status(200).json({ 
            status: 'error',
            message: 'Error, groupId o groupNewName.' 
        });
    }

    sql_validate = "SELECT * from grupos WHERE id = ?";
    [rows] = await pool.query(sql_validate, [groupId]);

    if (rows.length <= 0) {
        console.error("El grupo no existe")
        return res.status(200).json({ 
            status: 'error',
            message: 'El grupo no existe.' 
        });
    }

    const groupData = rows[0]

    // actualizando canal
    try {
        const discordClient = app.discordClient;
        const SERVER_ID = process.env.DAILY_GUILD_ID;
        console.debug('SERVER_ID: ' + SERVER_ID);

        const guild = discordClient.guilds.cache.get(SERVER_ID);

        await guild.channels.cache.get(
            groupData.channel_id).setName(groupNewName);

        console.log("channel id:", groupNewName, "actualizado")
    } catch (err) {
        console.error("Error al editar grupo", err)
        return res.status(200).json({ 
            status: 'error',
            message: 'Error fatal al editar grupo.' 
        });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const query = `UPDATE grupos SET name = :name 
            WHERE channel_id = :channel_id;`;
        console.debug('query: ' + query);

        const params = {
            "name": groupNewName,
            "channel_id": groupData.channel_id
        }

        const [result] = await connection.query({
            sql: query,
            values: params,
            namedPlaceholders: true
        });

        console.info(`${result.affectedRows} fila(s) afectadas(s)`);
        connection.commit()
        
    } catch (err) {
        console.error(`Error al obtener grupos: ${err.message}`);
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al editar grupos.' 
        });
    }

    console.info("Fin patch-group");
    return res.status(200).json({
        status: "success"
    });
});

module.exports = router;