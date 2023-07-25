const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');

router.get("/apsidersWithoutGroup", async (req, res, next) => {
    console.info("Inicio apsidersWithoutGroup");

    const query = `SELECT * FROM apsiders where disabled = ?
        AND grupo_id IS null;`;
    console.debug('query: ' + query);

    let rows;
    try {
        const [result] = await pool.query(query, [0]);
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

    if (rows.length === 0) {
        return res.status(200).json({
            status: "empty",
            result: "no hay apsiders sin grupos para listar"
        });
    }

    console.info("Fin apsidersWithoutGroup");
    return res.status(200).json({
        status: "success",
        length: rows?.length,
        result: rows
    });
});

module.exports = router;