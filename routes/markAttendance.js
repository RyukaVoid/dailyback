const { pool } = require('../dbConnector');
const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");

router.post("/mark-attendance", async (req, res, next) => {
    console.info("Inicio de mark-attendance");

    const APSIDER_ID = req.body.apsider_id;

    console.debug('APSIDER_ID: ' + APSIDER_ID);
    
    if (!APSIDER_ID) {
        console.error('APSIDER_ID es requerido', req.body);
        return res.status(400).json({
            status: 'error',
            message: 'APSIDER_ID es requerido'
        });
    }

    const fecha = DateTime.now()
                .setZone('America/Santiago').toFormat('yyyy-MM-dd');
    const hora = DateTime.now()
                .setZone('America/Santiago').toFormat('HH:mm:ss');

    console.debug('fechaHoraHoy: ', fecha + ' ' + hora);

    const query = `INSERT IGNORE INTO asistencias (
            apsider_id,
            fecha,
            hora
        ) VALUES (
            :apsider_id,
            :fecha,
            :hora
        )
    `;
    console.debug('query: ', query);

    const parameters = {
        apsider_id: APSIDER_ID,
        fecha: fecha,
        hora: hora
    };
    console.debug('parameters:', JSON.stringify(parameters));

    try {
        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${rows.affectedRows} fila(s) afectada(s).`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al marcar asistencia. ' + err.message 
        });
    }

    console.info("Fin de mark-attendance");
    res.status(200).json({
        status: 'success',
        message: 'Registro creado correctamente'
    });
});

module.exports = router;