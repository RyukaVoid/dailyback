const { pool } = require('../../dbConnector');

module.exports = async function (channel) {
    console.info("Inicio statusCommand");

    const query = `
        SELECT name, assisted, mandated
            FROM apsider
        WHERE archived = :archived
    `;
    console.debug('query: ' + query);

    const parameters = { archived: 0 };
    console.debug('params: ' + parameters);

    try {
        const [rows] = await pool.query(query, parameters);
        console.info(`${rows.affectedRows} fila(s) afectada(s)`);
    } catch (err) {
        console.error(`Error al actualizar apsiders: ${err.message}`);
        channel.send(`Error al actualizar apsiders: ${err.message}`);
        return;
    }
    console.debug('rows: ' + rows);

    let response = "";
    if (rows.length > 0){
        console.info("Hay usuarios en la daily");
        const assisted = rows.filter(function(apsider){
            return apsider.assisted === 1});
        const notAssisted = rows.filter(function(apsider){
            return apsider.assisted === 0});

        response += `__Apsiders en daily:__ **${rows.length}**\n\n`;

        response += `========================= \n`;
        response += `:x: Apsiders que no han presentado **${notAssisted.length}**\n\n`;
        response += notAssisted.map((apsider) => `- ${apsider.name} `).join("\n");
        response += `\n=========================\n`;

        response += `=========================\n`;
        response += `:white_check_mark: Apsiders que presentaron **${assisted.length}**\n\n`;
        response += assisted.map((apsider) => `- ${apsider.name}`).join("\n");
        response += `\n=========================\n`;

    }else{
        console.info("No hay usuarios en la daily");
        response = "No hay usuarios en la daily."
    }

    console.info("Fin statusCommand");
    channel.send(response);
}