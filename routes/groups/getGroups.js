const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');

router.get("/groups", async (req, res, next) => {
    console.info("Inicio get-groups");

    const query = `SELECT * FROM grupos;`;
    console.debug('query: ' + query);

    let rows;
    try {
        const [result] = await pool.query(query);
        rows = result;
        console.info(`${rows.length} fila(s) obtenida(s)`);
        console.debug('rows: ' + JSON.stringify(rows));
    } catch (err) {
        console.error(`Error al obtener grupos: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al obtener grupos.' 
        });
    }

    if (rows.length === 0) {
        return res.status(200).json({
            status: "empty",
            message: "no hay grupos para listar"
        });
    }

    let grupos = [];
    for (const grupoRow of rows) {
        const grupo = {
            id: grupoRow.id,
            name: grupoRow.name,
            channelId: grupoRow.channel_id,
            apsiders: [],
        };

        const [usersRows] = await pool.query(
            'SELECT * FROM apsiders WHERE grupo_id = ? AND disabled = ?',
            [grupo.id, 0]);
        
        grupo.apsiders = usersRows;

        grupos.push(grupo);
    }

    console.info("Fin get-groups");
    return res.status(200).json({
        status: "success",
        length: grupos?.length,
        result: grupos
    });
});

module.exports = router;