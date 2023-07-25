const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');


router.post("/removeApsiderGroup", async (req, res, next) => {
    console.info("Inicio removeApsiderGroup");

    const apsidersToRemove = req.body.apsidersToRemove

    console.debug("apsidersToAdd:", JSON.stringify(apsidersToRemove));

    if (apsidersToRemove.length === 0) {
        console.error("apsiders to remove esta vacio")
        return res.status(200).json({ 
            status: 'error',
            message: 'apsiders to remove esta vacio.' 
        });
    }

    try {
        console.log("eliminando apsiders del grupo")

        let sql_update = `UPDATE apsiders SET grupo_id = NULL 
            WHERE id = :id`;

        for (const apsiderToRemove of apsidersToRemove){
            const params = {
                id: apsiderToRemove.id,
            }

            const [rows] = await pool.query({
                sql: sql_update,
                values: params,
                namedPlaceholders: true
            })

            console.info(`${rows.affectedRows} fila(s) afectadas(s)`);   
        }
        console.info("Fin añadir apsiders al grupo");
    } catch (err) {
        console.error(`Error al obtener grupos: ${err.message}`);
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al eliminar apsiders.' 
        });
    }

    console.info("Fin removeApsiderGroup");
    return res.status(200).json({
        status: "success"
    });
});

module.exports = router;