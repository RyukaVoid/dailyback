const { pool } = require('../../dbConnector');
const clients = require("../../app");

module.exports = async function (channel) {
    console.info("Inicio resetAssisted apsiders");

    const query = 'UPDATE apsiders SET assisted = :assisted';
    console.debug('query: ' + query);

    const parameters = { assisted: 0 }
    console.debug('params: ' + parameters);

    try {
        const [rows] = await pool.query(query, parameters);
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error en resetAssisted apsiders: ${err.message}`);
        channel.send(`Error al resetAssisted apsiders: ${err.message}`);
        return;
    }

    console.info("Notificando a los clientes");
    [...clients.keys()].forEach((c) => {
        c.send(JSON.stringify({
            action: "resset_assisted_all",
        }));
    });

    console.info("Fin resetAssisted apsiders");
    channel.send('Todos los apsiders colocados en **no asistidos** Correctamente');
}