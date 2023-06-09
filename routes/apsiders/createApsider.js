const { pool } = require('../../dbConnector');
const express = require("express");
const router = express.Router();

router.post("/apsider", async (req, res, next) => {
    console.info("Inicio de create_apsider");

    const ID = req.body.id;
    const NAME = req.body.name;
    const EMAIL = req.body.email;
    const AVATAR = req.body.avatar;
    const ASSISTED = 0;
    const MANDATED = 0;
    const ARCHIVED = 1

    console.debug('ID: ' + ID);
    console.debug('NAME: ' + NAME);
    console.debug('EMAIL: ' + EMAIL);
    console.debug('AVATAR: ' + AVATAR);
    
    if (!ID || !NAME || !EMAIL || !AVATAR) {
        console.error('ID, NAME, EMAIL o AVATAR esta vacío', req.body);
        return res.status(400).json({
            status: 'error',
            message: 'ID, NAME, EMAIL o AVATAR esta vacío'
        });
    }

    const query = `INSERT INTO apsiders (
            id,
            name,
            email,
            avatar,
            assisted,
            mandated,
            archived
        ) VALUES (
            :id,
            :name,
            :email,
            :avatar,
            :assisted,
            :mandated,
            :archived)`;
    console.debug('query: ' + query);

    const parameters = {
        id: ID,
        name: NAME,
        email: EMAIL,
        avatar: AVATAR,
        assisted: ASSISTED,
        mandated: MANDATED,
        archived: ARCHIVED
    };
    console.debug('parameters: ' + parameters);

    try {
        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${rows.affectedRows} fila(s) afectada(s).`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        return res.status(500).json({ 
            status: 'error',
            message: 'Error al crear apsiders.' 
        });
    }

    console.info("Fin de create_apsider");
    res.status(200).json({
        status: 'success',
        message: 'Registro creado correctamente'
    });
});

module.exports = router;