const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');
var app = require("../../app");

router.delete("/group", async (req, res, next) => {
    console.info("Inicio delete-group");

    const groupId = req.body.id;

    console.debug("groupId:", groupId);

    if (!groupId) {
        console.error("groupId esta vacio")
        return res.status(200).json({ 
            status: 'error',
            message: 'groupId esta vacio.' 
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

    const grupo = rows[0]

    // eliminando el canal
    try {
        const discordClient = app.discordClient;
        const SERVER_ID = process.env.DAILY_GUILD_ID;
        console.debug('SERVER_ID: ' + SERVER_ID);

        const guild = discordClient.guilds.cache.get(SERVER_ID);

        await guild.channels.cache.get(grupo.channel_id).delete();

        console.log("channel id:", grupo.name, "eliminado")
    } catch (err) {
        console.error("Error al eliminar grupo", err)
        return res.status(200).json({ 
            status: 'error',
            message: 'Error fatal eliminar grupo.' 
        });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const apsidersQuery = `UPDATE apsiders SET grupo_id = NULL
            WHERE grupo_id = ?`;

        const [result1] = await connection.query(apsidersQuery, [groupId]);
        console.info(
            `${result1.affectedRows} fila(s) afectadas(s) apsidersquery`);

        const query = `DELETE FROM grupos WHERE id = ?;`;
        console.debug('query: ' + query);
        const [result] = await connection.query(query, [groupId]);

        console.info(`${result.affectedRows} fila(s) afectadas(s)`);
        connection.commit();
    } catch (err) {
        console.error(`Error al eliminar grupo: ${err.message}`);
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al eliminar grupo.' 
        });
    }

    console.info("Fin delete-group");
    return res.status(200).json({
        status: "success",
    });
});

module.exports = router;