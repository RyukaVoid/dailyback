const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.get("/apsider/:id", async (req, res, next) => {
    console.info("Inicio get_apsider");

    const ID = req.params.id;

    console.debug('ID: ' + ID);

    if (!ID) {
        console.error('id esta vacío', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'id esta vacío'
        });
    }

    if(isNaN(ID)){
        console.error('id no es un número', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'id no es un número'
        });
    }

    const query = `SELECT * FROM apsiders 
        WHERE id = :id`;
    console.debug('query: ' + query);

    const parameters = {
        id: ID
    }

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

    console.info("fin archive_apsider");

    res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente',
        data: rows
    });
});

module.exports = router;