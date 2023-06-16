const { pool } = require('../../dbConnector');
const { clients } = require("../../app");
const notifyAllClients = require('../../utils');

module.exports = async function (autor, channel) {
    console.info("Inicio notReadyCommand");

    const user_id = autor.id
    console.debug('user_id: ' + user_id);

    const query = ` 
        UPDATE apsiders 
            SET assisted = :assisted 
        WHERE id = :id ;
    `;
    console.debug('query: ' + query);

    const parameters = {
        assisted: 0,
        id: user_id,
    };

    console.debug('params:', JSON.stringify(parameters));

    try {
        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error al actualizar apsiders: ${err.message}`);
        channel.send(`Error al actualizar apsiders: ${err.message}`);
        return;
    }

    console.info("Notificando a los clientes");
    notifyAllClients(JSON.stringify({
        action: "assisted-updated",
        data: {
            id: user_id,
            assist: 0
        }
    }));

    console.info("Fin notReadyCommand");
    channel.send('Ausentado correctamente');
}