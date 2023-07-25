const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');


router.post("/addApsiderGroup", async (req, res, next) => {
    console.info("Inicio addApsiderGroup");

    const groupId = req.body.groupId;
    const apsidersToAdd = req.body.apsidersToAdd

    console.debug("groupId:", groupId);
    console.debug("apsidersToAdd:", JSON.stringify(apsidersToAdd));

    if (!groupId || apsidersToAdd.length === 0) {
        console.error("groupId esta vacio o apsiders to add esta vacio")
        return res.status(200).json({ 
            status: 'error',
            message: 'groupId esta vacio o apsiders to add esta vacio.' 
        });
    }

    const query = `UPDATE apsiders SET ;`;
    console.debug('query: ' + query);

    try {
        console.log("añadiendo apsiders al grupo")

        var sql_update = `UPDATE apsiders SET grupo_id = :grupo_id 
            WHERE id = :id`;

        for (const apsiderToAdd of apsidersToAdd){
            const params = {
                id: apsiderToAdd.id,
                grupo_id: groupId
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
            message: 'Error al crear grupos.' 
        });
    }


    console.info("Fin create-group");
    return res.status(200).json({
        status: "success"
    });
});

module.exports = router;