const express = require("express");
const router = express.Router();
const { pool } = require('../dbConnector');
const notifyAllClients = require('../utils');

router.post("/reset_assisted", async (req, res) => {
    console.info("Inicio reset_assisted");

    const query = 'UPDATE apsiders SET assisted = :assisted';
    console.debug('query: ' + query);

    const parameters = { assisted: 0 };
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
        channel.send(`Error al actualizar apsiders: ${err.message}`);
        return;
    }

    console.info("Notificando a los clientes");
    notifyAllClients(JSON.stringify({
        action: "assisted-updated",
    }));

    console.info("Fin reset_assisted");
    res.status(200).json({
        status: "success",
        result: rows
    })
});

module.exports = router;