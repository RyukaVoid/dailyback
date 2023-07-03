const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.get("/asistenciaApsider", async (req, res, next) => {
    console.info("Inicio asistenciaApsiders");

    const apsider_id = req.query.apsider_id;
    console.debug('apsider_id: ' + apsider_id);

    if (!apsider_id) {
        console.error('apsider_id esta vacío', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'apsider_id esta vacío'
        });
    }

    const query = `SELECT
        DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
        TIME_FORMAT(hora, '%H:%i:%s') AS hora
    from asistencias where apsider_id = :apsider_id`;
    console.debug('query: ' + query);

    const params = { apsider_id: parseInt(apsider_id) }
    console.debug('params: ' + JSON.stringify(params));

    let rows;
    try {
        const [result] = await pool.query({
            sql: query,
            values: params,
            namedPlaceholders: true
        });
        rows = result;
        console.info(`${rows.length} fila(s) obtenidas(s)`);
        console.debug('rows: ' + JSON.stringify(rows));
    } catch (err) {
        console.error(`Error al obtener apsiders: ${err.message}`);
        return res.status(500).json({ 
            success: false,
            message: 'Error al obtener apsiders.' 
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Registro obtenido correctamente',
        data: rows,
    });
});

module.exports = router;