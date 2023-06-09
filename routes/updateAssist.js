const express = require("express");
const router = express.Router();
const clients = require("../app");
const { pool } = require('../dbConnector');

router.post("/update_assist", async (req, res) => {
    console.info("Inicio update_assist");

    const query = 'UPDATE apsiders SET assisted = :assisted WHERE id = :id';
    console.debug('query: ' + query);

    const parameters = { assisted: req.body.assist, id: req.body.id };
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
            action: "assisted-updated",
            data: {
                id: req.body.id,
                assist: req.body.assist
            }
        }));
    });

    console.info("Fin update_assist");
    res.status(200).json({
        status: "success",
        result: rows
    })
});

module.exports = router;