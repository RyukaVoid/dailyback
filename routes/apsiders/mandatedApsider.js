var app = require("../../app");
const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');
const notifyAllClients = require('../../utils');

// actualiza el campo mandated de la tabla apsiders
// recibiendo el id de la persona que se va a liderar la proxima daily
// y actualizando el campo mandated de la persona que se lideraba la daily anteriormente
router.post("/mandated_apsider", async (req, res, next) => {
    console.info("Inicio mandated_apsider");

    const MANDATED_ID = req.body.id;

    if (!MANDATED_ID) {
        console.error('id esta vacío', req.body);
        return res.status(400).json({
            status: 'error',
            message: 'id esta vacío'
        });
    }

    const QUERY_MANDATED = `
        UPDATE apsiders 
            SET mandated = :set_mandated 
        WHERE mandated = :new_mandated
    `;
    console.debug('QUERY_MANDATED: ' + QUERY_MANDATED);

    const PARAMS_MANDATED = {
        set_mandated: 0,
        new_mandated: 1
    };
    console.debug('PARAMS_MANDATED:', JSON.stringify(PARAMS_MANDATED));

    const QUERY_APSIDER_MANDATED = `
        UPDATE apsiders 
            SET mandated = :mandated
        WHERE id = :id
    `;
    console.debug('QUERY_APSIDER_MANDATED: ' + QUERY_APSIDER_MANDATED);

    const PARAMS_APSIDER_MANDATED = {
        mandated: 1,
        id: MANDATED_ID
    }
    console.debug('PARAMS_APSIDER_MANDATED:',
        JSON.stringify(PARAMS_APSIDER_MANDATED));

    const QUERY_SELECT_APSIDER = `
        SELECT * FROM apsiders 
            WHERE id = :id
    `;
    console.debug('QUERY_SELECT_APSIDER: ' + QUERY_SELECT_APSIDER);

    const PARAMS_SELECT_APSIDER = {
        id: MANDATED_ID
    };
    console.debug('PARAMS_SELECT_APSIDER:', JSON.stringify(PARAMS_SELECT_APSIDER));

    let apsider;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query({
            sql: QUERY_MANDATED,
            values: PARAMS_MANDATED,
            namedPlaceholders: true
        });
        console.info(`Se actualizaron las filas donde mandated = 1 a 0`);
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);

        const [rows2] = await connection.query({
            sql: QUERY_APSIDER_MANDATED,
            values: PARAMS_APSIDER_MANDATED,
            namedPlaceholders: true
        });
        console.info(`Se actualizó la fila donde id = ${MANDATED_ID}`);
        console.info(`${rows2.affectedRows} fila(s) afectada(s)`);

        const [rows3] = await connection.query({
            sql: QUERY_SELECT_APSIDER,
            values: PARAMS_SELECT_APSIDER,
            namedPlaceholders: true
        });
        console.info(`Se seleccionó el apsider con id = ${MANDATED_ID}`);
        apsider = rows3;

        notifyAllClients(JSON.stringify({
            action: "mandated-updated",
            apsider: apsider[0],
        }));

        await connection.commit();
    } catch (err) {
        console.error(`Error en mandated_apsiders: ${err.message}`);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({
            status: 'error',
            message: 'Error en mandated_apsiders.'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }

    // notificar por el servidor de eventos
    const discordClient = app.discordClient;

    if (discordClient) {

        const DAILY_TEXT_CHANNEL_ID = process.env.DAILY_TEXT_CHANNEL_ID || 0;
        console.debug('DAILY_CHANNEL_ID: ' + DAILY_TEXT_CHANNEL_ID);

        const DAILY_CHANNEL = discordClient.channels.cache.get(DAILY_TEXT_CHANNEL_ID);

        DAILY_CHANNEL.send(`Felicidades @${apsider[0].name}, azotado!`,
            {files:["http://localhost:8999/apsiders/" + apsider.avatar]}
        );
    }

    console.info("Fin mandated_apsider");
    res.status(200).json({
        status: "success",
        result: apsider
    });
});

module.exports = router;