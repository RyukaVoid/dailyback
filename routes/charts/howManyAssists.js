const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.get("/howManyAssists", async (req, res, next) => {
    console.info("Inicio arriveOnTime");

    const interval = req.query.interval;
    console.debug('interval: ' + interval);

    const query = `
        SELECT 
            DATE_FORMAT(fecha, '%d/%m/%Y') AS fecha,
            COUNT(DISTINCT apsider_id) AS cantidad_usuarios
        FROM asistencias
        WHERE fecha BETWEEN CURDATE() - INTERVAL :interval MONTH AND CURDATE()
        GROUP BY fecha;
    `;
    console.debug('query: ' + query);

    const parameters = {
        interval: interval,
    };
    console.debug('parameters: ' + JSON.stringify(parameters));

    let rows;
    try {
        const [result] = await pool.query({
            sql: query,
            values: parameters,
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

    const categories = [];
    const data = [];

    rows.forEach(row => {
        categories.push(row.fecha);
        data.push(row.cantidad_usuarios);
    });

    console.info("fin arriveOnTime");

    return res.status(200).json({
        status: 'success',
        message: 'Datos obtenido correctamente',
        preview: rows,
        categories,
        data,
    });
});

module.exports = router;