const mysql2 = require('mysql2/promise');
require('dotenv').config();

console.info('inicio dbConnector.js');

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;

console.debug('DB_HOST: ' + DB_HOST);
console.debug('DB_USER: ' + DB_USER);
console.debug('DB_PASSWORD: ' + DB_PASSWORD.substring(0, 3) + '...');
console.debug('DB_PORT: ' + DB_PORT);
console.debug('DB_DATABASE: ' + DB_DATABASE);

const pool = mysql2.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
    waitForConnections: true,
});

console.info("conectando a la base de datos...");

// Probar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectarse a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos!');

    connection.release(); // Devolver la conexión al pool
});

const closeConnection = (pool) => {
    if (pool) {
        console.info('Cerrando pool de conexiones...');
        pool.end((err) => {
        if (err) {
            console.error('Error al cerrar el pool de conexiones:', err);
            return;
        }
        console.log('Pool de conexiones cerrado exitosamente!');
        });
    }
};
module.exports = { pool, closeConnection };
