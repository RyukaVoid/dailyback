const { pool } = require('../../dbConnector');

const express = require("express");
const router = express.Router();

router.patch("/disableApsider", async (req, res, next) => {
    console.info("Inicio disable_apsider");

    const ID = req.body.id;
    const DISABLED = req.body.disabled;

    console.debug('ID: ' + ID);
    console.debug('DISABLED: ' + DISABLED);

    if (!ID) {
        console.error('id esta vacío', req.params);
        return res.status(400).json({
            status: 'error',
            message: 'id esta vacío'
        });
    }

    const query = `UPDATE apsiders SET
        disabled = :disabled
        WHERE id = :id`;
    console.debug('query: ' + query);

    const parameters = {
        id: ID,
        disabled: DISABLED
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

    console.info("fin disable_apsider");

    return res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente'
    });
});

module.exports = router;