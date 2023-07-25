const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');

router.get("/get-apsiders", async (req, res, next) => {
    console.info("Inicio get-apsiders");

    const groupId = req.query.groupId;
    console.debug('groupId: ' + groupId);

    if (!groupId) {
        console.error('groupId esta vacío', req.query);
        return res.status(200).json({
            status: 'error',
            message: 'groupId esta vacío'
        });
    }

    const query = 'SELECT * FROM apsiders WHERE disabled = 0 AND grupo_id = :groupId';
    console.debug('query: ' + query);

    const parameters = {
        groupId: groupId,
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
    return res.status(200).json({
        status: "success",
        length: rows?.length,
        result: rows
    })
});

module.exports = router;