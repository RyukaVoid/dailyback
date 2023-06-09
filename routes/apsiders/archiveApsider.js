const { pool } = require('../../dbConnector');
const express = require("express");
const router = express.Router();

router.patch("/archive_apsider", async (req, res, next) => {
    console.info("Inicio archive_apsider");

    const ARCHIVE = req.body.archive;
    const ID = req.body.id;

    console.debug('ARCHIVE: ' + ARCHIVE);
    console.debug('ID: ' + ID);

    if (!ARCHIVE || !ID) {
        console.error('archive o id esta vacío', req.body);
        return res.status(400).json({
            status: 'error',
            message: 'archive o id esta vacío'
        });
    }

    const query = `UPDATE apsiders SET 
            archived = :archived 
        WHERE id = :id`;
    console.debug('query: ' + query);

    const parameters = {
        archived: ARCHIVE,
        id: ID
    };
    console.debug('parameters: ' + JSON.stringify(parameters));

    let rows;
    try {
        const [results] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        rows = results;
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error al actualizar apsiders: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al actualizar apsiders.' 
        });
    }

    console.info("fin archive_apsider");

    res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente'
    });
});

module.exports = router;