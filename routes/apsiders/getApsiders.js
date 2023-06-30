const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');

router.get("/get-apsiders", async (req, res, next) => {
    console.info("Inicio get-apsiders");

    const query = 'SELECT * FROM apsiders WHERE disabled = 0';
    console.debug('query: ' + query);

    let rows;
    try {
        const [result] = await pool.query(query);
        rows = result;
        console.info(`${rows.length} fila(s) obtenida(s)`);
        console.debug('rows: ' + JSON.stringify(rows));
    } catch (err) {
        console.error(`Error al actualizar apsiders: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al obtener apsiders.' 
        });
    }

    console.info("Fin get-apsiders");
    res.status(200).json({
        status: "success",
        length: rows?.length,
        result: rows
    })
});

module.exports = router;