const { pool } = require('../../dbConnector');
const express = require("express");
const router = express.Router();
var upload = require("../../middleware/multer")

router.patch("/apsider", upload.single("avatar"), async (req, res, next) => {
    console.info("Inicio de update_apsider");

    const ID = req.body.id;
    // const NAME = req.body.name;
    const EMAIL = req.body.email || null;
    const AVATAR = req.file || null;
    const ASSISTED = req.body.assisted || null;
    const MANDATED = req.body.mandated || null;
    const ARCHIVED = req.body.archived || null;

    console.debug('ID: ' + ID);
    console.debug('EMAIL: ' + EMAIL);
    console.debug('AVATAR:',  JSON.stringify(AVATAR));
    console.debug('ASSISTED: ' + ASSISTED);
    console.debug('MANDATED: ' + MANDATED);
    console.debug('ARCHIVED: ' + ARCHIVED);
    
    if (!ID) {
        console.error('ID es requerido', req.body);
        return res.status(400).json({
            status: 'error',
            message: 'ID es requerido'
        });
    }

    var selectQuery = `SELECT avatar FROM apsiders WHERE id = :id`;
    console.debug('selectQuery: ' + selectQuery);

    var selectParameters = {
        id: ID
    };
    console.debug('selectParams: ' + selectParameters);

    let old_avatar_name = "";
    try {
        const [rows] = await pool.query({
            sql: selectQuery,
            values: selectParameters,
            namedPlaceholders: true
        });
        console.info(`${rows.length} fila(s) seleccionada(s).`);

        if (rows.length > 0) {
            old_avatar_name = rows[0].avatar;
            console.debug('old_avatar_name: ' + old_avatar_name);
        }

        if (rows.length === 0) {
            console.error('No existe apsider con ID: ' + ID);
            return res.status(400).json({
                status: 'error',
                message: 'No existe apsider con ID: ' + ID
            });
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Error al seleccionar apsider.'
        });
    }

    const query = `
        UPDATE apsiders SET
            email = COALESCE(:email, email),
            avatar = COALESCE(:avatar, avatar),
            assisted = COALESCE(:assisted, assisted),
            mandated = COALESCE(:mandated, mandated),
            archived = COALESCE(:archived, archived)
        WHERE
            id = :id;
    `;
    console.debug('query: ' + query);

    const parameters = {
        id: ID,
        email: EMAIL,
        avatar: AVATAR.originalname,
        assisted: ASSISTED,
        mandated: MANDATED,
        archived: ARCHIVED
    };
    console.debug('parameters:', JSON.stringify(parameters));

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });

        if (old_avatar_name  || 
            old_avatar_name != '' && 
            old_avatar_name !== AVATAR.originalname
        ) {
            console.info('Eliminando avatar anterior');
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '../../public/apsiders/' + old_avatar_name);
            console.debug('filePath: ' + filePath);

            try {
                fs.unlinkSync(filePath);
                console.info('Avatar anterior eliminado');
            } catch (err) {
                console.error(`Error: ${err.message}`);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar avatar anterior, ' + err.message
                });
            }
        }

        await connection.commit();
        console.info(`${rows.affectedRows} fila(s) afectada(s).`);

    } catch (err) {
        console.error(`Error: ${err.message}`);

        if (connection) {
            await connection.rollback();
        }

        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar apsiders.' 
        });
    }

    console.info("Fin de update_apsider")
    res.status(200).json({
        status: 'success',
        message: 'Apsider actualizado correctamente'
    });
});

module.exports = router;