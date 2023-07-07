const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');

router.get("/groups", async (req, res, next) => {
    console.info("Inicio get-groups");

    const query = `SELECT g.id, g.name, GROUP_CONCAT(a.name) as apsiders FROM grupos g
    INNER JOIN apsiders a ON g.id = a.grupo_id
    GROUP BY g.id
    ORDER BY g.id ASC;`;
    console.debug('query: ' + query);

    let rows;
    try {
        const [result] = await pool.query(query);
        rows = result;
        console.info(`${rows.length} fila(s) obtenida(s)`);
        console.debug('rows: ' + JSON.stringify(rows));
    } catch (err) {
        console.error(`Error al obtener grupos: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al obtener grupos.' 
        });
    }

    if (rows.length !== 0) {
        rows = rows.map(row => {
            return {
                id: row.id,
                name: row.name,
                apsiders: row.apsiders.split(',') || []
            }
        });
    }

    console.info("Fin get-groups");
    res.status(200).json({
        status: "success",
        length: rows?.length,
        result: rows
    })
});

module.exports = router;