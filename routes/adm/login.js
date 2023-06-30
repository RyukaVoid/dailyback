const { pool } = require('../../dbConnector');
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const argon2 = require('argon2');

router.post("/adm/login", async (req, res, next) => {
    console.info("Inicio adm_login");

    const entry_username = req.body.username;
    const entry_password = req.body.password;

    console.debug('username: ' + entry_username);
    console.debug('password: ' + entry_password);

    if (!entry_username || !entry_password) {
        console.error('username o password esta vacío', req.body);
        return res.status(200).json({
            status: 'error',
            message: 'username o password esta vacío'
        });
    }

    const query = `SELECT * from users 
        WHERE username = :username`;
    console.debug('query: ' + query);

    const parameters = {
        username: entry_username,
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
        return res.status(200).json({
            status: 'error',
            message: 'Usuario y/o contraseña incorrecta'
        });
    }

    if (rows.length === 0) {
        console.error('No se encontró el usuario', req.body);
        return res.status(200).json({
            status: 'error',
            message: 'Usuario y/o contraseña incorrecta'
        });
    }

    const user = rows[0];
    console.log('user: ' + JSON.stringify(user));

    if (!await argon2.verify(user.password, entry_password)) {
        console.error('Contraseña incorrecta', req.body);
        return res.status(200).json({
            status: 'error',
            message: 'Usuario y/o contraseña incorrecta'
        });
    }

    const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '';
    if (JWT_TOKEN_SECRET === '') {
        console.error('JWT_TOKEN_SECRET not defined');
        throw new Error('JWT_TOKEN_SECRET not defined');
    }

    const token = jwt.sign(
        { userId: user.id },
        JWT_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    console.info("fin adm_login");

    res.status(200).json({
        status: 'success',
        message: 'Inicio de sesion exitoso',
        token: token,
        type : 'Bearer',
        user: user,
        expiration: 7 * 24 * 60 * 60 * 1000
    });
});

module.exports = router;