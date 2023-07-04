const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.get("/asistenciasApsiders", async (req, res, next) => {
    console.info("Inicio asistenciaApsiders");

    // que flojera conectar esto a una api externa que te calcule los dias laborales
    // asi que añadimos un array con los dias laborales por 20 años
    const totalDiasLaborales = [
        { año: 2023, dias: 123 }, // aca le reste porque ya estamos a mitad de año
        { año: 2024, dias: 250 },
        { año: 2025, dias: 249 },
        { año: 2026, dias: 250 },
        { año: 2027, dias: 252 },
        { año: 2028, dias: 248 },
        { año: 2029, dias: 248 },
        { año: 2030, dias: 249 },
        { año: 2031, dias: 249 },
        { año: 2032, dias: 253 },
        { año: 2033, dias: 251 },
        { año: 2034, dias: 248 },
        { año: 2035, dias: 248 },
        { año: 2036, dias: 250 },
        { año: 2037, dias: 250 },
        { año: 2038, dias: 252 },
        { año: 2039, dias: 251 },
        { año: 2040, dias: 249 },
        { año: 2041, dias: 249 },
        { año: 2042, dias: 249 },
        { año: 2043, dias: 250 },
        { año: 2044, dias: 251 },
    ]
    
    const diasLaboralesAnnioActual = totalDiasLaborales.find(annio => annio.año === new Date().getFullYear()).dias;

    if (!diasLaboralesAnnioActual) {
        console.error('joseee añade mas dias laborales al json porfis :3');
        return res.status(400).json({
            status: 'error',
            message: 'joseee añade mas dias laborales al json porfis :3'
        });
    }

    const query = `SELECT 
                        apsiders.id,
                        apsiders.name,
                        apsiders.email,
                        apsiders.avatar,
                        COUNT(asistencias.id) as total_asistencias 
                    FROM apsiders
                    JOIN asistencias ON apsiders.id = asistencias.apsider_id
                    WHERE TIME(asistencias.hora) BETWEEN '08:45:00' AND '09:00:00'
                        AND YEAR(asistencias.fecha) = YEAR(CURDATE())
                    GROUP BY apsiders.id, apsiders.name
                    ORDER BY total_asistencias DESC;`;

    console.debug('query: ' + query);

    let rows;
    try {
        const [result] = await pool.query(query);
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

    rows = rows.map(apsider => {
        return {
            ...apsider,
            porcentaje: (apsider.total_asistencias / diasLaboralesAnnioActual) * 100
        }
    })

    res.status(200).json({
        status: 'success',
        message: 'Registros obtenidos correctamente',
        data: rows,
    });
});

module.exports = router;