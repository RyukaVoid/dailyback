const { pool } = require('../dbConnector');
const { DateTime } = require("luxon");

const notifyAllClients = require('../utils');

require('dotenv').config();

module.exports = async function(oldState, newState) {
    console.info("Inicio VoiceStateUpdate");
    console.debug("oldState", oldState.channelId);
    console.debug("newState", newState.channelId);
    console.debug("env", process.env.DAILY_CHANNEL_ID);

    if (oldState.channelId !== null && newState.channelId !== null) {
        if (oldState.channelId !== process.env.DAILY_CHANNEL_ID ||
                newState.channelId !== process.env.DAILY_CHANNEL_ID) {
            console.info("entreif no es daily");
            return;
        }
    }

    if(oldState.channelId === null) {
        console.info('un usuario se ha unido al canal daily')
        console.debug('usuario:', oldState.member.user.id,
            oldState.member.user.username);

        const apsider = await archiveApsider(pool, 0, oldState.member.user.id);

        notifyAllClients(JSON.stringify({
            action: "user-joined",
            apsider: apsider
        }));

        const success = await markAttendance(apsider);

        if (success) {
            console.info('asistencia marcada para', apsider.name, apsider.id);
        }else{
            console.error('error al marcar asistencia para', apsider.name, apsider.id);
        }

    } else if (newState.channelId === null) {
        console.info('un usuario ha dejado el canal daily')
        console.debug('usuario:', newState.member.user.id,
            newState.member.user.username);

        const apsider = await archiveApsider(pool, 1, newState.member.user.id);
        notifyAllClients(JSON.stringify({
            action: "user-left",
            apsider: apsider
        }));
    }
    console.info("fin VoiceStateUpdate");
}

async function archiveApsider(pool, state, user_id, callback) {
    const [updateResult] = await pool.query(
        "UPDATE apsiders SET archived = ? WHERE id = ?",
        [state,user_id]
    );
    console.debug("usuario archived updated",
        state, updateResult.affectedRows);
    
    const [selectResult] = await pool.query(
        "SELECT * FROM apsiders WHERE id = ?",
        [user_id]
    );
    console.debug("usuario obtenido", selectResult);
    return selectResult[0];
}

async function markAttendance(apsider){
    console.info("Inicio de mark-attendance");

    const APSIDER_ID = apsider.id;

    console.debug('APSIDER_ID: ' + APSIDER_ID);

    const fecha = DateTime.now()
                .setZone('America/Santiago').toFormat('yyyy-MM-dd');
    const hora = DateTime.now()
                .setZone('America/Santiago').toFormat('HH:mm:ss');

    console.debug('fechaHoraHoy: ', fecha + ' ' + hora);

    const query = `INSERT IGNORE INTO asistencias (
            apsider_id,
            fecha,
            hora
        ) VALUES (
            :apsider_id,
            :fecha,
            :hora
        )
    `;
    console.debug('query: ', query);

    const parameters = {
        apsider_id: APSIDER_ID,
        fecha: fecha,
        hora: hora
    };
    console.debug('parameters:', JSON.stringify(parameters));

    try {
        const [rows] = await pool.query({
            sql: query,
            values: parameters,
            namedPlaceholders: true
        });
        console.info(`${rows.affectedRows} fila(s) afectada(s).`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        return false
    }

    console.info("Fin de mark-attendance");
    return true
}