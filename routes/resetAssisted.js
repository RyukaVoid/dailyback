const express = require("express");
const router = express.Router();
const clients = require("../app");
const { pool } = require('../dbConnector');

router.post("/reset_assisted", async (req, res) => {
    console.info("Inicio reset_assisted");

    const query = 'UPDATE apsiders SET assisted = :assisted';
    console.debug('query: ' + query);

    const parameters = { assisted: 0 };
    console.debug('params: ' + parameters);

    try {
        const [rows] = await pool.query(query, parameters);
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error al actualizar apsiders: ${err.message}`);
        channel.send(`Error al actualizar apsiders: ${err.message}`);
        return;
    }

    console.info("Notificando a los clientes");
    [...clients.keys()].forEach((c) => {
        c.send(JSON.stringify({
            action: "resset_assisted_all",
        }));
    });

    console.info("Fin reset_assisted");
    res.status(200).json({
        status: "success",
        result: rows
    })
});

module.exports = router;