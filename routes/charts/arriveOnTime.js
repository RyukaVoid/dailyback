const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.get("/arriveOnTime", async (req, res, next) => {
    console.info("Inicio arriveOnTime");

    const limit = req.query.limit;
    console.debug('limit: ' + limit);

    if (!limit) {
        console.error('limit esta vacío', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'limit esta vacío'
        });
    }

    const query = `
        SELECT 
            apsiders.id,
            apsiders.avatar,
            apsiders.name,
            AVG(TIME_TO_SEC(asistencias.hora)) AS promedio_hora
        FROM apsiders
        JOIN asistencias ON apsiders.id = asistencias.apsider_id
        WHERE TIME(asistencias.hora) BETWEEN '08:45:00' AND '09:15:00'
        GROUP BY apsiders.id, apsiders.name
        ORDER BY promedio_hora ASC
        LIMIT :limit;
    `;

    console.debug('query: ' + query);

    const params = { limit: parseInt(limit) }

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
    console.info("fin arriveOnTime");

    rows = rows.map(row => {
        const horas = Math.floor(row.promedio_hora / 3600);
        const minutos = Math.floor((row.promedio_hora % 3600) / 60);
        const segundos = Math.floor(row.promedio_hora % 60);
        
        const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        const sinMilisegundos = horaFormateada.split('.')[0];

        return {
            id: row.id,
            name: row.name,
            avatar: row.avatar,
            promedio_hora: sinMilisegundos
        }
    });
    
    return res.status(200).json({
        status: 'success',
        message: 'Datos obtenido correctamente',
        data: rows,
    });
});

module.exports = router;