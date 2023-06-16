const express = require("express");
const router = express.Router();
const { pool } = require('../dbConnector');
const notifyAllClients = require('../utils');

router.post("/update_assist", async (req, res) => {
    console.info("Inicio update_assist");

    const query = 'UPDATE apsiders SET assisted = :assisted WHERE id = :id';
    console.debug('query: ' + query);

    const parameters = { assisted: req.body.assist, id: req.body.id };
    console.debug('params:', JSON.stringify(parameters));

    let rows;
    try {
        const [results] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${results.affectedRows} fila(s) afectada(s)`);
        rows = results;
    } catch (err) {
        console.error(`Error al actualizar apsiders: ${err.message}`);
        return;
    }

    console.info("Notificando a los clientes");
    notifyAllClients(JSON.stringify({
        action: "assisted-updated",
        data: {
            id: req.body.id,
            assist: req.body.assist
        }
    }));

    console.info("Fin update_assist");
    res.status(200).json({
        status: "success",
        result: rows
    })
});

module.exports = router;