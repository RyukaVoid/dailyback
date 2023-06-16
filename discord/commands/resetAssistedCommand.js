const { pool } = require('../../dbConnector');
const notifyAllClients = require('../../utils');

module.exports = async function (channel) {
    console.info("Inicio resetAssisted apsiders");

    const query = 'UPDATE apsiders SET assisted = :assisted';
    console.debug('query: ' + query);

    const parameters = { assisted: 0 }
    console.debug('parameters:', JSON.stringify(parameters));

    try {
        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error en resetAssisted apsiders: ${err.message}`);
        channel.send(`Error al resetAssisted apsiders: ${err.message}`);
        return;
    }

    console.info("Notificando a los clientes");
    notifyAllClients(JSON.stringify({
        action: "assisted-updated",
    }));

    console.info("Fin resetAssisted apsiders");
    channel.send('Todos los apsiders colocados en **no asistidos** Correctamente');
}