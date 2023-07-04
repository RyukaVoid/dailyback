const cron = require('node-cron');
const { pool } = require('../../dbConnector');

cron.schedule('0 0 * * *', async function () {
    console.info('Inicio cron resetAssisted 0 0 * * * (cada día a las 00:00))');
  
    const query = `
        UPDATE apsiders
            SET assisted = :assisted
    `;
    console.debug('query: ' + query);

    const parameters = { assisted: 0 };
    console.debug('params: ' + parameters);
  
    try {
        const [rows] = await pool.query(query, parameters);
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error cron resetAssisted ${err.message}`);
        return;
    }

    console.info('Fin cron resetAssisted');
});