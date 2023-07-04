const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.get("/leastAssistedApsiders", async (req, res, next) => {
    console.info("Inicio leastAssistedApsiders");

    const interval = req.query.interval_months;
    console.debug('interval: ' + interval);

    if (!interval) {
        console.error('interval esta vacío', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'interval esta vacío'
        });
    }

    const query = `SELECT 
                        apsiders.id,
                        apsiders.name,
                        COUNT(asistencias.id) as total_asistencias 
                    FROM apsiders
                    JOIN asistencias ON apsiders.id = asistencias.apsider_id
                    WHERE disabled = :disabled
                        AND asistencias.fecha >= DATE_SUB(CURDATE(), INTERVAL :interval MONTH)
                        AND TIME(asistencias.hora) BETWEEN '08:45:00' AND '09:00:00'
                    GROUP BY apsiders.id, apsiders.name
                    ORDER BY total_asistencias ASC
                    LIMIT 15;`;

    console.debug('query: ' + query);

    const params = {
        disabled: 0,
        interval: interval
    }

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

    const categories = [];
    const data = [];

    rows.forEach(row => {
        categories.push(row.name);
        data.push(row.total_asistencias);
    });

    console.info("fin mostAssistedApsiders");

    res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente',
        preview: rows,
        categories,
        data,
        actualMonth: new Date().toLocaleString('es-CL', { month: 'long' })
    });
});

module.exports = router;