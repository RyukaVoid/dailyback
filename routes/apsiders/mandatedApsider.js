const express = require("express");
const router = express.Router();
const clients = require("../../app");
const { pool } = require('../../dbConnector');

router.post("/mandated_apsider", async (req, res, next) => {
    console.info("Inicio mandated_apsider");

    const QUERY_MANDATED = `
        PDATE apsiders 
            SET mandated = :set_mandated 
        WHERE mandated = :new_mandated
    `;
    console.debug('QUERY_MANDATED: ' + QUERY_MANDATED);

    const PARAMS_MANDATED = {
        set_mandated: 0,
        new_mandated: 1
    };
    console.debug('PARAMS_MANDATED: ' + PARAMS_MANDATED);

    const QUERY_APSIDER_MANDATED = `
        UPDATE apsiders 
            SET mandated = :mandated
        WHERE id = :id
    `;
    console.debug('QUERY_APSIDER_MANDATED: ' + QUERY_APSIDER_MANDATED);

    const PARAMS_APSIDER_MANDATED = {
        mandated: 1,
        id: req.body.id
    }
    console.debug('PARAMS_APSIDER_MANDATED: ' + PARAMS_APSIDER_MANDATED);

    const QUERY_SELECT_APSIDER = `
        SELECT * FROM apsiders 
            WHERE id = :id
    `;
    console.debug('QUERY_SELECT_APSIDER: ' + QUERY_SELECT_APSIDER);

    const PARAMS_SELECT_APSIDER = {
        id: req.body.id
    };
    console.debug('PARAMS_SELECT_APSIDER: ' + PARAMS_SELECT_APSIDER);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(QUERY_MANDATED, PARAMS_MANDATED);
        console.info(`Se actualizaron las filas donde mandated=1`);
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);

        const [rows2] = await connection.query(
            QUERY_APSIDER_MANDATED, PARAMS_APSIDER_MANDATED);
        console.info(`${rows2.affectedRows} fila(s) afectada(s)`);
       

        const [apsider] = await connection.query(
            QUERY_SELECT_APSIDER, PARAMS_SELECT_APSIDER);
        console.info(`Se seleccionó el apsider con id=${req.body.id}`);

        console.info("Enviando mensaje a los clientes");
        [...clients.keys()].forEach((c) => {
            c.send(JSON.stringify({
                action: "mandated-updated",
                apsider: apsider[0],
            }));
        });

        await connection.commit();

        console.info("Fin mandated_apsider");
        res.status(200).json({
            status: "success",
            result: apsider
        });

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

    console.info("Fin mandated_apsider");
});

module.exports = router;