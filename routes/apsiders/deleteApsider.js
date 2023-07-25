const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.delete("/apsider/:id", async (req, res, next) => {
    console.info("Inicio delete_apsider");

    const ID = req.params.id;

    console.debug('ID: ' + ID);

    if (!ID) {
        console.error('id esta vacío', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'id esta vacío'
        });
    }

    const query = `DELETE FROM apsiders 
        WHERE id = :id`;
    console.debug('query: ' + query);

    const parameters = {
        id: ID
    };
    console.debug('parameters: ' + JSON.stringify(parameters));

    try {
        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${rows.affectedRows} fila(s) eliminada(s)`);
    } catch (err) {
        console.error(`Error al eliminar apsiders: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al eliminar apsiders.'
        });
    }

    console.info("fin delete_apsider");

    return res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente'
    });
});

module.exports = router;